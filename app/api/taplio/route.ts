import { NextResponse } from 'next/server';

const TAPLIO_API_BASE = 'https://api.taplio.com/v1';
const TAPLIO_API_KEY  = process.env.TAPLIO_API_KEY ?? '';

function taplioHeaders() {
  return {
    'Authorization': `Bearer ${TAPLIO_API_KEY}`,
    'Content-Type': 'application/json',
  };
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
