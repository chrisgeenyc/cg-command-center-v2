import { NextResponse } from 'next/server';
import ical, { VEvent } from 'node-ical';

// Today's calendar from a secret iCal feed (Google Calendar →
// Settings → your calendar → "Secret address in iCal format").
// Set CALENDAR_ICS_URL in Vercel env vars.

export const dynamic = 'force-dynamic';

interface CalEvent {
  time: string;
  title: string;
  sub: string;
  tag: 'client' | 'deadline' | 'focus';
  startISO: string;
}

const ET = 'America/New_York';
const dayFmt = new Intl.DateTimeFormat('en-CA', { timeZone: ET });
const rangeFmt = new Intl.DateTimeFormat('en-US', {
  timeZone: ET, hour: 'numeric', minute: '2-digit',
});

// node-ical text fields can be a string or { val, params }
function asText(v: unknown): string {
  if (typeof v === 'string') return v;
  if (v && typeof v === 'object' && 'val' in v) return String((v as { val: unknown }).val);
  return '';
}

function tagFor(ev: VEvent): CalEvent['tag'] {
  const text = `${asText(ev.summary)} ${asText(ev.description)} ${asText(ev.location)}`.toLowerCase();
  if (/deadline|due |ship |submit/.test(text)) return 'deadline';
  if (/zoom|meet\.google|teams|call|session|training|retreat|workshop|client|interview|podcast|coffee|lunch/.test(text) || ev.attendee) return 'client';
  return 'focus';
}

function isAllDay(ev: VEvent): boolean {
  return (ev.datetype === 'date') ||
    (ev.end && ev.start && ev.end.getTime() - ev.start.getTime() >= 24 * 3600 * 1000) === true;
}

function toCalEvent(ev: VEvent, start: Date, end: Date | null): CalEvent {
  const allDay = isAllDay(ev);
  const time = allDay
    ? 'All day'
    : end
      ? rangeFmt.formatRange(start, end)
      : rangeFmt.format(start);
  const subRaw = asText(ev.location) || asText(ev.description).split('\n')[0] || 'Google Calendar';
  const sub = subRaw.length > 60 ? subRaw.slice(0, 57) + '…' : subRaw;
  return {
    time,
    title: asText(ev.summary) || 'Untitled',
    sub,
    tag: tagFor(ev),
    startISO: start.toISOString(),
  };
}

export async function GET() {
  const url = process.env.CALENDAR_ICS_URL;
  if (!url) return NextResponse.json({ events: [], error: 'CALENDAR_ICS_URL not set' });

  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return NextResponse.json({ events: [], error: `ICS fetch → ${res.status}` });
    const text = await res.text();
    const parsed = ical.sync.parseICS(text);

    const now = new Date();
    const todayET = dayFmt.format(now);
    // Expansion window wide enough to cover today in ET regardless of UTC offset
    const windowStart = new Date(now.getTime() - 36 * 3600 * 1000);
    const windowEnd = new Date(now.getTime() + 36 * 3600 * 1000);

    const events: CalEvent[] = [];

    for (const key of Object.keys(parsed)) {
      const ev = parsed[key];
      if (!ev || ev.type !== 'VEVENT') continue;
      const vev = ev as VEvent;

      if (vev.rrule) {
        const duration = vev.end && vev.start ? vev.end.getTime() - vev.start.getTime() : 0;
        const exdates = new Set(
          Object.values(vev.exdate ?? {}).map(d => dayFmt.format(d as Date))
        );
        for (const occ of vev.rrule.between(windowStart, windowEnd, true)) {
          if (dayFmt.format(occ) !== todayET || exdates.has(dayFmt.format(occ))) continue;
          // Recurrence overrides (moved/edited single occurrences)
          const overrideKey = occ.toISOString().slice(0, 10);
          const override = vev.recurrences?.[overrideKey] as VEvent | undefined;
          const source = override ?? vev;
          const start: Date = override?.start ?? occ;
          const end = duration ? new Date(start.getTime() + duration) : null;
          events.push(toCalEvent(source, start, end));
        }
      } else if (vev.start && dayFmt.format(vev.start) === todayET) {
        events.push(toCalEvent(vev, vev.start, vev.end ?? null));
      }
    }

    events.sort((a, b) => a.startISO.localeCompare(b.startISO));

    return NextResponse.json({ events, synced_at: now.toISOString() });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ events: [], error: msg });
  }
}
