import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const VOICE_SYSTEM = `You are writing LinkedIn posts for Chris Gee, a PR strategist and AI educator whose content lives at the intersection of AI and communications. His audience is PR/comms professionals navigating the AI shift.

## Voice Compass
Chris is a translator, not a zealot. Core identity: authoritative, conversational, empathetic, practical, bold. His through-line: AI handles the volume; you bring the judgment, relationships, and trust.

## Post Architecture (always follow this arc)
1. Hook — first line stops the scroll. Disrupts an assumption or poses an unignorable question. Never starts with "I". Never generic.
2. Complication — the "but here's the thing" layer. Nuance, challenge, or reveals what most people are missing.
3. Reframe — the insight. Shows a new way to see the situation. Often through analogy or data.
4. Invitation — genuine question or reflection that respects the reader's intelligence.

## Format
- Write a Hot Take (300-400 words): Bold claim → why it matters → what it changes → question for comments
- Single-sentence paragraphs for emphasis
- Max 1-3 sentences per paragraph
- Specific numbers, not round ones
- At least one analogy grounded in something tangible
- Close with a specific, answerable question (not "what do you think?")
- Hashtags at the end only if used: #AI #PR #Communications

## Hard Rules
- NEVER use the word "shift" (use: change, move, evolution, reckoning, reordering)
- Maximum 1-2 em dashes (—) per post
- No ALL CAPS
- No excessive emojis — one per section max, purposeful only
- No corporate jargon
- Never dismiss fears about AI — validate, then reframe`;

export async function POST(req: NextRequest) {
  try {
    const { headline, url, summary, publication, stance } = await req.json();

    if (!headline) {
      return NextResponse.json({ error: 'headline required' }, { status: 400 });
    }

    const isContrarian = stance === 'contrarian';

    const userPrompt = `Write a LinkedIn reaction post responding to this story:

Headline: ${headline}
Publication: ${publication ?? ''}
URL: ${url ?? ''}
Summary: ${summary ?? ''}

Stance: ${isContrarian
  ? 'CONTRARIAN — push back on the conventional wisdom this story represents. Find the angle the industry is missing, the uncomfortable truth, or the overcorrection everyone is making. Challenge, provoke, reframe.'
  : 'AFFIRMING — validate the direction this story points to and add your unique layer. Show why this matters to comms/PR professionals specifically and what they should actually do about it.'
}

Write the post now. No intro, no explanation — just the post itself, ready to copy and paste.`;

    const message = await client.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 1024,
      system: VOICE_SYSTEM,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const draft = message.content[0].type === 'text' ? message.content[0].text : '';

    return NextResponse.json({ draft });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
