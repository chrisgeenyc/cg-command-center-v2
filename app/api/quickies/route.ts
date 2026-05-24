import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('quickies')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Map trigger_text -> trigger for component compatibility
  const mapped = (data ?? []).map((row) => ({
    ...row,
    trigger: row.trigger_text,
  }));

  return NextResponse.json(mapped);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { trigger, ...rest } = body;

  const { data, error } = await supabaseAdmin
    .from('quickies')
    .insert({ ...rest, trigger_text: trigger })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ...data, trigger: data.trigger_text });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, trigger, ...rest } = body;

  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  const updates: Record<string, unknown> = { ...rest, updated_at: new Date().toISOString() };
  if (trigger !== undefined) updates.trigger_text = trigger;

  const { data, error } = await supabaseAdmin
    .from('quickies')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ...data, trigger: data.trigger_text });
}
