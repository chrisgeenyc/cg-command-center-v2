import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  const expected = `Bearer ${process.env.CRON_SECRET}`;
  if (process.env.CRON_SECRET && auth !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const base = new URL(req.url).origin;
  const res = await fetch(`${base}/api/briefings`, { method: 'POST' });
  const result = await res.json();

  return NextResponse.json({ ok: true, synced_at: new Date().toISOString(), result });
}
