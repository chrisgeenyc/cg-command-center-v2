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
    // Full schema introspection to discover available queries
    const schemaData = await bufferQuery(`
      query {
        __schema {
          queryType {
            fields {
              name
              args { name type { name kind ofType { name kind } } }
            }
          }
        }
      }
    `);

    const queryFields: Array<{ name: string; args: unknown[] }> =
      schemaData?.__schema?.queryType?.fields ?? [];

    // Return schema discovery for debugging
    const snapshot = {
      queue: [],
      sent: [],
      profiles: [],
      _schemaQueries: queryFields.map(f => f.name),
    };

    const { error } = await supabaseAdmin
      .from('pulse_snapshot')
      .insert({ data: snapshot });

    if (error) throw error;

    return NextResponse.json({ ok: true, queue_count: 0, _schemaQueries: snapshot._schemaQueries });
  } catch (err) {
    const msg = err instanceof Error ? err.message : JSON.stringify(err);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
