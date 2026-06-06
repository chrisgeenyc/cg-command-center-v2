import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  const expected = `Bearer ${process.env.CRON_SECRET}`;
  if (process.env.CRON_SECRET && auth !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const base = new URL(req.url).origin;
  const routes = ['/api/asana', '/api/hubspot', '/api/buffer', '/api/briefings'];

  const results = await Promise.allSettled(
    routes.map(route =>
      fetch(`${base}${route}`, { method: 'POST' }).then(r => r.json())
    )
  );

  const summary = results.map((r, i) => ({
    route: routes[i],
    status: r.status,
    value: r.status === 'fulfilled' ? r.value : String((r as PromiseRejectedResult).reason),
  }));

  return NextResponse.json({ ok: true, synced_at: new Date().toISOString(), results: summary });
}
