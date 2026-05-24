import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const BUFFER_BASE = 'https://api.bufferapp.com/1';

async function bufferGet(path: string) {
  const token = process.env.BUFFER_ACCESS_TOKEN;
  const sep = path.includes('?') ? '&' : '?';
  const res = await fetch(`${BUFFER_BASE}${path}${sep}access_token=${token}`);
  if (!res.ok) throw new Error(`Buffer ${path} → ${res.status}`);
  return res.json();
}

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('pulse_snapshot')
    .select('*')
    .order('id', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    return NextResponse.json({ queue: [], sent: [], profiles: [] });
  }

  return NextResponse.json({
    queue: (data.data as { queue?: unknown[] }).queue ?? [],
    sent: (data.data as { sent?: unknown[] }).sent ?? [],
    profiles: (data.data as { profiles?: unknown[] }).profiles ?? [],
    synced_at: data.synced_at,
  });
}

export async function POST() {
  try {
    const profiles = await bufferGet('/profiles.json');
    const profileList = Array.isArray(profiles) ? profiles.slice(0, 3) : [];

    const queue: unknown[] = [];
    const sent: unknown[] = [];

    await Promise.all(
      profileList.map(async (profile: { id: string }) => {
        try {
          const [pending, postedSent] = await Promise.all([
            bufferGet(`/profiles/${profile.id}/updates/pending.json`),
            bufferGet(`/profiles/${profile.id}/updates/sent.json`),
          ]);
          if (pending?.updates) queue.push(...pending.updates);
          if (postedSent?.updates) sent.push(...postedSent.updates);
        } catch {
          // profile fetch failed — skip
        }
      })
    );

    const snapshot = { queue, sent, profiles: profileList };

    const { error } = await supabaseAdmin
      .from('pulse_snapshot')
      .insert({ data: snapshot });

    if (error) throw error;

    return NextResponse.json({ ok: true, queue_count: queue.length, sent_count: sent.length });
  } catch (err) {
    const msg = err instanceof Error ? err.message : JSON.stringify(err);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
