import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const BUFFER_GRAPHQL = 'https://api.buffer.com';

async function bufferQuery(query: string) {
  const res = await fetch(BUFFER_GRAPHQL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.BUFFER_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Buffer GraphQL → ${res.status}: ${text.slice(0, 300)}`);
  }
  const json = await res.json();
  if (json.errors?.length) throw new Error(`Buffer GraphQL error: ${json.errors[0].message}`);
  return json.data;
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
    // Introspect Channel type to find available fields
    const introData = await bufferQuery(`
      query {
        __type(name: "Channel") {
          fields { name }
        }
      }
    `);
    const channelFields: string[] = (introData?.__type?.fields ?? []).map(
      (f: { name: string }) => f.name
    );

    // Build channel query with only fields that exist
    const usernameField = channelFields.find(f =>
      ['handle', 'username', 'serviceUsername', 'screenName'].includes(f)
    ) ?? null;
    const queueField = channelFields.find(f =>
      ['queue', 'updates', 'scheduledUpdates', 'pendingUpdates'].includes(f)
    ) ?? null;

    const channelSubfields = ['id', 'name', 'service'];
    if (usernameField) channelSubfields.push(usernameField);
    const queueSubquery = queueField
      ? `${queueField} { id text scheduledAt status }`
      : '';

    const data = await bufferQuery(`
      query {
        channels {
          ${channelSubfields.join('\n          ')}
          ${queueSubquery}
        }
      }
    `);

    const channels = data?.channels ?? [];
    const queue = queueField
      ? channels.flatMap((c: Record<string, unknown[]>) => (c[queueField] as unknown[]) ?? [])
      : [];

    const snapshot = {
      queue,
      sent: [],
      channelFields,
      profiles: channels.map((c: Record<string, unknown>) => ({
        id: c.id,
        service: c.service,
        username: usernameField ? c[usernameField] : null,
        name: c.name,
      })),
    };

    const { error } = await supabaseAdmin
      .from('pulse_snapshot')
      .insert({ data: snapshot });

    if (error) throw error;

    return NextResponse.json({ ok: true, queue_count: queue.length });
  } catch (err) {
    const msg = err instanceof Error ? err.message : JSON.stringify(err);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
