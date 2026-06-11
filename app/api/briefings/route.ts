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

    return NextResponse.json({
      ok: true,
      comms_count: fresh.filter(s => s.brief_type === 'ai-comms').length,
      jobs_count: fresh.filter(s => s.brief_type === 'ai-jobs').length,
      skipped_duplicates: stories.length - fresh.length,
    });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
