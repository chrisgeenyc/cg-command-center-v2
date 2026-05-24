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
    // Get account info (org ID) then fetch channels + posts
    const accountData = await bufferQuery(`
      query {
        account { id name currentOrganization { id name } }
      }
    `);
    const orgId: string =
      accountData?.account?.currentOrganization?.id ?? accountData?.account?.id ?? '';

    const [channelsData, postsData] = await Promise.all([
      bufferQuery(`
        query {
          channels(input: { organizationId: "${orgId}" }) {
            id name service
          }
        }
      `).catch(() => ({ channels: [] })),
      bufferQuery(`
        query {
          posts(input: { organizationId: "${orgId}", status: "pending" }) {
            id text scheduledAt status
            channel { id name service }
          }
        }
      `).catch(() => ({ posts: [] })),
    ]);

    const channels = channelsData?.channels ?? [];
    const queue = postsData?.posts ?? [];

    const snapshot = {
      queue,
      sent: [],
      profiles: channels.map((c: Record<string, unknown>) => ({
        id: c.id,
        service: c.service,
        name: c.name,
      })),
    };

    const { error } = await supabaseAdmin
      .from('pulse_snapshot')
      .insert({ data: snapshot });

    if (error) throw error;

    return NextResponse.json({ ok: true, queue_count: queue.length, channel_count: channels.length });
  } catch (err) {
    const msg = err instanceof Error ? err.message : JSON.stringify(err);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
