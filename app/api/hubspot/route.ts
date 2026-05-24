import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const HS_BASE = 'https://api.hubapi.com';

function hsHeaders() {
  return {
    Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
    'Content-Type': 'application/json',
  };
}

async function hsGet(path: string) {
  const res = await fetch(`${HS_BASE}${path}`, { headers: hsHeaders() });
  if (!res.ok) throw new Error(`HubSpot ${path} → ${res.status}`);
  return res.json();
}

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('pipeline_snapshot')
    .select('*')
    .order('id', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    return NextResponse.json({ deals: [], pipelines: [] });
  }

  return NextResponse.json({
    deals: (data.data as { deals?: unknown[] }).deals ?? [],
    pipelines: (data.data as { pipelines?: unknown[] }).pipelines ?? [],
    synced_at: data.synced_at,
  });
}

export async function POST() {
  try {
    const dealsRes = await hsGet(
      '/crm/v3/objects/deals?properties=dealname,amount,dealstage,closedate,hubspot_owner_id,hs_deal_stage_probability&limit=100'
    );
    const pipelinesRes = await hsGet('/crm/v3/pipelines/deals');

    const snapshot = {
      deals: dealsRes.results ?? [],
      pipelines: pipelinesRes.results ?? [],
    };

    const { error } = await supabaseAdmin
      .from('pipeline_snapshot')
      .insert({ data: snapshot });

    if (error) throw error;

    return NextResponse.json({ ok: true, deal_count: snapshot.deals.length });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
