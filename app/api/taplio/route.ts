import { NextResponse } from 'next/server';

const TAPLIO_API_BASE = 'https://api.taplio.com/v1';
const TAPLIO_API_KEY  = process.env.TAPLIO_API_KEY ?? '';

function taplioHeaders() {
  return {
    'Authorization': `Bearer ${TAPLIO_API_KEY}`,
    'Content-Type': 'application/json',
  };
}

// GET /api/taplio — recent posts, with published-today highlighted.
// Taplio's list endpoint shape can vary, so normalize defensively.
export async function GET() {
  if (!TAPLIO_API_KEY) {
    return NextResponse.json({ posts: [], postedToday: [] });
  }

  try {
    const res = await fetch(`${TAPLIO_API_BASE}/posts?limit=25`, { headers: taplioHeaders() });
    if (!res.ok) {
      return NextResponse.json({ posts: [], postedToday: [], error: `Taplio ${res.status}` });
    }
    const raw = await res.json();
    const list: Record<string, unknown>[] = Array.isArray(raw) ? raw
      : Array.isArray(raw.posts) ? raw.posts
      : Array.isArray(raw.data) ? raw.data
      : Array.isArray(raw.items) ? raw.items
      : [];

    const posts = list.map(p => ({
      id: String(p.id ?? ''),
      content: String(p.content ?? p.text ?? ''),
      status: String(p.status ?? ''),
      published_at: (p.published_at ?? p.posted_at ?? p.publishedAt ?? null) as string | null,
      scheduled_for: (p.scheduled_for ?? p.scheduledFor ?? null) as string | null,
    }));

    const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
    const postedToday = posts.filter(p => {
      if (!p.published_at) return false;
      const t = new Date(p.published_at).getTime();
      return !Number.isNaN(t) && t >= todayStart.getTime();
    });

    return NextResponse.json({ posts, postedToday });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ posts: [], postedToday: [], error: msg });
  }
}

export async function POST(request: Request) {
  if (!TAPLIO_API_KEY) {
    return NextResponse.json({ error: 'Taplio API key not configured' }, { status: 500 });
  }

  let body: { content?: string; scheduled_for?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { content, scheduled_for } = body;

  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    return NextResponse.json({ error: 'content is required' }, { status: 400 });
  }

  if (content.length > 3000) {
    return NextResponse.json({ error: 'content exceeds 3000 character limit' }, { status: 400 });
  }

  let draft: { id: string; status: string; content: string; created_at: string };
  try {
    const createRes = await fetch(`${TAPLIO_API_BASE}/posts/drafts`, {
      method: 'POST',
      headers: taplioHeaders(),
      body: JSON.stringify({ content: content.trim() }),
    });

    if (!createRes.ok) {
      const err = await createRes.json().catch(() => ({}));
      return NextResponse.json(
        { error: (err as { error?: { message?: string } })?.error?.message ?? `Taplio error ${createRes.status}` },
        { status: createRes.status }
      );
    }

    draft = await createRes.json();
  } catch (e) {
    console.error('[taplio] network error on create', e);
    return NextResponse.json({ error: 'Failed to reach Taplio API' }, { status: 502 });
  }

  if (scheduled_for) {
    try {
      const schedRes = await fetch(`${TAPLIO_API_BASE}/posts/drafts/${draft.id}/schedule`, {
        method: 'POST',
        headers: taplioHeaders(),
        body: JSON.stringify({ scheduled_for }),
      });

      if (!schedRes.ok) {
        const err = await schedRes.json().catch(() => ({}));
        return NextResponse.json(
          { ...draft, scheduleError: (err as { error?: { message?: string } })?.error?.message ?? 'Schedule step failed' },
          { status: 207 }
        );
      }

      return NextResponse.json(await schedRes.json(), { status: 200 });
    } catch (e) {
      console.error('[taplio] network error on schedule', e);
      return NextResponse.json({ ...draft, scheduleError: 'Network error during schedule step' }, { status: 207 });
    }
  }

  return NextResponse.json(draft, { status: 201 });
}
