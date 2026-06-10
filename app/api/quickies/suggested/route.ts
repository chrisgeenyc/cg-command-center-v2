import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

// Suggests follow-ups from HubSpot contacts that have gone quiet.
// Reads the latest pipeline_snapshot (contacts synced by /api/hubspot POST)
// and returns contacts with no recorded touch in 30+ days, quietest first.

interface HubSpotContact {
  id: string;
  properties: {
    firstname?: string;
    lastname?: string;
    email?: string;
    company?: string;
    jobtitle?: string;
    notes_last_contacted?: string;
    lastmodifieddate?: string;
  };
}

const DAY = 86400000;
const QUIET_THRESHOLD_DAYS = 30;

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('pipeline_snapshot')
      .select('*')
      .order('id', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) return NextResponse.json({ suggestions: [] });

    const contacts = (data.data as { contacts?: HubSpotContact[] }).contacts ?? [];

    const suggestions = contacts
      .map(c => {
        const p = c.properties ?? {};
        const name = [p.firstname, p.lastname].filter(Boolean).join(' ') || p.email || 'Unknown';
        const lastTouch = p.notes_last_contacted ?? p.lastmodifieddate ?? null;
        const t = lastTouch ? new Date(lastTouch).getTime() : null;
        const daysSilent = t && !Number.isNaN(t)
          ? Math.floor((Date.now() - t) / DAY)
          : null; // null = never contacted
        return {
          id: c.id,
          who: name,
          ctx: [p.jobtitle, p.company].filter(Boolean).join(' · ') || p.email || '',
          daysSilent,
          reason: daysSilent === null ? 'never contacted' : `${daysSilent}d silent`,
        };
      })
      .filter(s => s.daysSilent === null || s.daysSilent >= QUIET_THRESHOLD_DAYS)
      .sort((a, b) => (b.daysSilent ?? 9999) - (a.daysSilent ?? 9999))
      .slice(0, 6);

    return NextResponse.json({ suggestions });
  } catch (err) {
    const msg = err instanceof Error ? err.message : JSON.stringify(err);
    return NextResponse.json({ suggestions: [], error: msg });
  }
}
