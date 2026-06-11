import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

interface TavilyResult {
  title: string;
  url: string;
  content: string;
  published_date?: string;
  score: number;
}

interface TavilyResponse {
  results: TavilyResult[];
}

interface BriefingStory {
  brief_type: string;
  section: string;
  headline: string;
  url: string;
  publication: string;
  published_date: string;
  summary: string;
}

const PUB_MAP: Record<string, string> = {
  'prweek.com': 'PR Week',
  'provokemedia.com': 'PRovoke',
  'prdaily.com': 'PR Daily',
  'axios.com': 'Axios',
  'wsj.com': 'WSJ',
  'bloomberg.com': 'Bloomberg',
  'forbes.com': 'Forbes',
  'fastcompany.com': 'Fast Company',
  'hbr.org': 'HBR',
  'nytimes.com': 'NYT',
  'reuters.com': 'Reuters',
  'ft.com': 'FT',
  'theguardian.com': 'The Guardian',
  'ragan.com': 'Ragan',
  'adage.com': 'AdAge',
};

function pubFromUrl(url: string): string {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '');
    return PUB_MAP[host] ?? host;
  } catch {
    return url;
  }
}

async function tavilySearch(query: string, maxResults: number): Promise<TavilyResult[]> {
  const res = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.TAVILY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      max_results: maxResults,
      search_depth: 'basic',
      topic: 'news',
      days: new Date().getDay() === 1 ? 3 : 1,
    }),
  });
  if (!res.ok) throw new Error(`Tavily error ${res.status}: ${await res.text()}`);
  const data: TavilyResponse = await res.json();
  return data.results ?? [];
}

function mapToStory(result: TavilyResult, briefType: string, section: string): BriefingStory {
  return {
    brief_type: briefType,
    section,
    headline: result.title,
    url: result.url,
    publication: pubFromUrl(result.url),
    published_date: result.published_date ?? '',
    summary: result.content?.slice(0, 400) ?? '',
  };
}

// Ask Claude to cluster same-story coverage among recent stories,
// then delete all but the newest article in each cluster. Fails
// open — any error means nothing gets deleted.
async function removeTopicalDuplicates(cutoff: string): Promise<number> {
  try {
    if (!process.env.ANTHROPIC_API_KEY) return 0;

    const { data: rows } = await supabaseAdmin
      .from('briefing_stories')
      .select('id, brief_type, headline, summary, synced_at')
      .gte('synced_at', cutoff)
      .order('synced_at', { ascending: false });

    if (!rows || rows.length < 2) return 0;

    const listing = rows
      .map(r => `${r.id} | ${r.brief_type} | ${r.headline} | ${(r.summary ?? '').slice(0, 120)}`)
      .join('\n');

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: `Below is a list of news stories, one per line: id | brief_type | headline | summary excerpt.

Identify groups of entries that cover the SAME underlying news event (e.g., two outlets reporting the same announcement). Only group entries with the same brief_type. Be conservative: stories on the same broad theme but about different events are NOT duplicates.

Respond with ONLY this JSON, no other text:
{"duplicate_groups": [["id-a","id-b"], ...]}

If there are no duplicates, respond: {"duplicate_groups": []}

Stories:
${listing}`,
        }],
      }),
    });

    if (!res.ok) return 0;
    const msg = await res.json();
    const text: string = msg?.content?.[0]?.text ?? '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return 0;
    const parsed = JSON.parse(jsonMatch[0]) as { duplicate_groups?: string[][] };

    const validIds = new Set(rows.map(r => r.id));
    const byId = new Map(rows.map(r => [r.id, r]));
    const toDelete: string[] = [];

    for (const group of parsed.duplicate_groups ?? []) {
      const members = group.filter(id => validIds.has(id));
      if (members.length < 2) continue;
      // Keep the newest article, delete the rest
      const sorted = [...members].sort((a, b) =>
        (byId.get(b)!.synced_at as string).localeCompare(byId.get(a)!.synced_at as string)
      );
      toDelete.push(...sorted.slice(1));
    }

    if (toDelete.length > 0) {
      await supabaseAdmin.from('briefing_stories').delete().in('id', toDelete);
    }
    return toDelete.length;
  } catch {
    return 0;
  }
}

export async function GET() {
  try {
    const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { data, error } = await supabaseAdmin
      .from('briefing_stories')
      .select('*')
      .gte('synced_at', cutoff)
      .order('synced_at', { ascending: false });

    if (error) throw error;

    // Rows arrive newest-first. Dedupe by URL (the same article can
    // land in consecutive daily batches), keeping the newest copy.
    // Then cap the display at 5 per brief: comms takes the 5
    // freshest; jobs takes a section mix (3 displacement /
    // 1 legislation / 1 organizing) from the latest batch,
    // backfilling if a section came up empty.
    const seen = new Set<string>();
    const rows = (data ?? []).filter(r => {
      const key = r.url || r.headline;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    const comms = rows.filter(r => r.brief_type === 'ai-comms').slice(0, 5);

    const jobsRecent = rows.filter(r => r.brief_type === 'ai-jobs').slice(0, 9);
    const jobs = [
      ...jobsRecent.filter(r => r.section === 'displacement').slice(0, 3),
      ...jobsRecent.filter(r => r.section === 'legislation').slice(0, 1),
      ...jobsRecent.filter(r => r.section === 'organizing').slice(0, 1),
    ];
    for (const r of jobsRecent) {
      if (jobs.length >= 5) break;
      if (!jobs.includes(r)) jobs.push(r);
    }

    return NextResponse.json({ 'ai-comms': comms, 'ai-jobs': jobs.slice(0, 5) });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

export async function POST() {
  try {
    // AI + Comms searches — run in parallel, dedupe by URL, take top 5 by score
    const commsQueries = [
      'AI communications PR strategy news',
      'generative AI public relations marketing news',
      'AI media relations crisis communications',
    ];

    const commsResultArrays = await Promise.all(
      commsQueries.map(q => tavilySearch(q, 10))
    );

    const commsByUrl = new Map<string, TavilyResult>();
    for (const results of commsResultArrays) {
      for (const r of results) {
        const existing = commsByUrl.get(r.url);
        if (!existing || r.score > existing.score) {
          commsByUrl.set(r.url, r);
        }
      }
    }
    const commsTop5 = Array.from(commsByUrl.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    // AI + Jobs searches — run in parallel
    const [jobsDisplacement, jobsLegislation, jobsOrganizing] = await Promise.all([
      tavilySearch('AI job displacement layoffs workers', 10),
      tavilySearch('AI labor legislation workers protection bill', 5),
      tavilySearch('union workers AI opposition organizing strike', 5),
    ]);

    const displacementTop5 = jobsDisplacement.sort((a, b) => b.score - a.score).slice(0, 5);
    const legislationTop2 = jobsLegislation.sort((a, b) => b.score - a.score).slice(0, 2);
    const organizingTop2 = jobsOrganizing.sort((a, b) => b.score - a.score).slice(0, 2);

    const stories: BriefingStory[] = [
      ...commsTop5.map(r => mapToStory(r, 'ai-comms', 'top-stories')),
      ...displacementTop5.map(r => mapToStory(r, 'ai-jobs', 'displacement')),
      ...legislationTop2.map(r => mapToStory(r, 'ai-jobs', 'legislation')),
      ...organizingTop2.map(r => mapToStory(r, 'ai-jobs', 'organizing')),
    ];

    // Skip articles we already stored in the last 7 days
    const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { data: existing } = await supabaseAdmin
      .from('briefing_stories')
      .select('url')
      .gte('synced_at', cutoff);
    const existingUrls = new Set((existing ?? []).map(r => r.url));
    const fresh = stories.filter(s => !existingUrls.has(s.url));

    if (fresh.length > 0) {
      const { error } = await supabaseAdmin.from('briefing_stories').insert(fresh);
      if (error) throw error;
    }

    // Different outlets cover the same news story — URL dedupe can't
    // catch that. Have Claude cluster the stored stories by topic and
    // delete all but the newest article in each cluster.
    const topicalRemoved = await removeTopicalDuplicates(cutoff);

    return NextResponse.json({
      ok: true,
      comms_count: fresh.filter(s => s.brief_type === 'ai-comms').length,
      jobs_count: fresh.filter(s => s.brief_type === 'ai-jobs').length,
      skipped_duplicates: stories.length - fresh.length,
      topical_duplicates_removed: topicalRemoved,
    });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
