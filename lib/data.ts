// Static data — all types + constants for CG Command Center

export interface MetricItem {
  label: string;
  value: string | number;
  unit?: string;
  prefix?: string;
  sub: string;
  subDot: "risk" | "healthy" | "stale" | "blocked";
  trend: { dir: "up" | "down" | "flat"; text: string };
  spark?: boolean;
}

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  count?: number;
  contextual?: boolean;
  sub?: string;
}

export interface QuickieItem {
  who: string;
  ctx: string;
  action: string;
  channel: string;
  trigger: string;
  tint: string;
  rel: string;
  touch: string;
  temp: string;
  done: boolean;
  pinned?: boolean;
}

export interface TaskItem {
  name: string;
  project: string;
  percent: number;
  urgent: boolean;
}

export interface CalendarItem {
  time: string;
  title: string;
  sub: string;
  tag: string;
}

export interface WinItem {
  name: string;
  sub: string;
  amount: string;
  recur?: string;
  client?: string;
  when?: string;
  note?: string;
}

export interface StatusItem {
  name: string;
  sub: string;
  status: string;
  pill: string;
  icon: string;
}

export interface PulseCard {
  id: string;
  headline: string;
  source: string;
  publishedAt: string;
  sourceUrl: string;
  whyItMatters: string;
  summary: string;
  stance: string;
  draft: string;
  status: string;
}

export interface DealItem {
  client: string;
  stage: string;
  value: string;
  next: string;
  last: string;
  owner: string;
  stuck: boolean;
}

export interface LossItem {
  client: string;
  amount: string;
  date: string;
  reason: string;
}

export interface LeadItem {
  name: string;
  source: string;
  contact: string;
  stage: string;
  value: string;
  days: number;
  next: string;
  last: string;
  status: string;
  suggest: string;
  _flash?: string;
}

export interface ProjectCard {
  name: string;
  client: string;
  deadline: string;
  daysLeft: number | null;
  percent: number;
  openTasks: number;
  blockers: number;
  last: string;
  health: string;
  stage: string;
}

export interface NoteItem {
  id: string;
  title: string;
  preview: string;
  edited: string;
  body: string;
  links: { type: string; label: string }[];
  pinned: boolean;
}

export interface ConnectorItem {
  name: string;
  status: string;
  lastSync: string;
  for: string;
}

export interface TeamMember {
  name: string;
  email: string;
  role: string;
  avatar: string;
  you: boolean;
  defaultView: string;
}

export interface RelationshipRow {
  id: string;
  label: string;
  total: number;
  warm: number;
  cooling: number;
  cold: number;
  debt: number;
  hint: string;
}

export interface SavedCue {
  id: string;
  headline: string;
  source: string;
  savedAt: string;
  words: number;
  queueSlot: string | null;
  stance: string;
  expiresIn: number;
  hook: string;
  body: string;
  cta: string;
  note: string;
}

export interface QueueSlot {
  id: string;
  slot: string;
  title: string;
  status: string;
}

// ─── DATA ───────────────────────────────────────────────────────────────────

export const TODAY_LABEL = "Thursday, May 14";

export const HOOK = "Stage day. LSG Retreat Day 1 at 1307 New York Avenue NW kicks off at 1:30. Ragan AI training session squeezes in via Zoom at 2:45 — back-to-back trainer mode in DC.";

export const PRIORITY = {
  kicker: "TODAY'S SINGLE PRIORITY",
  title: "Day 1 LSG AI Session. Break a leg!",
  hint: "1:30 PM at 1307 New York Avenue NW. Trust the deck. Trust the room.",
  progressLabel: "DAY 1 OF 2",
  percent: 50,
};

export const METRICS: MetricItem[] = [
  { label: "Active Projects",  value: "4",   sub: "Retreat live · Coursera due Fri", subDot: "risk", trend: { dir: "flat", text: "execution mode" } },
  { label: "Open Tasks",       value: "4",   sub: "Day 1 stage stack", subDot: "healthy", trend: { dir: "flat", text: "no change" } },
  { label: "Pipeline Won",     value: "36",  unit: "K",  prefix: "$",         sub: "+ Fenton $10K/mo retainer", subDot: "healthy", trend: { dir: "up", text: "+12%" }, spark: true },
  { label: "This Week's Deadlines", value: "2", sub: "Retreat Day 2 tomorrow · Coursera Fri",  subDot: "risk",    trend: { dir: "flat", text: "in the thick" } },
];

export const PROJECTS: StatusItem[] = [
  { name: "CG Command Center",        sub: "Live · v2 dashboard auto-refresh wired today",        status: "healthy", pill: "Shipped",  icon: "terminal" },
  { name: "Team LSG · AI Retreat",    sub: "Wed-Thu May 13-14 · 1307 NY Ave NW DC · Day 1 on stage today", status: "risk",    pill: "Live · Day 1", icon: "video" },
  { name: "Coursera Wk 6–10",         sub: "Drafts done · video recording + upload remain",       status: "risk",    pill: "Due Fri",  icon: "video" },
  { name: "Fenton retainer",          sub: "Active · weekly check-ins via Shakirah",              status: "healthy", pill: "Healthy",  icon: "mail" },
];

export const BLOCKED: StatusItem[] = [
  { name: "Audit HubSpot contacts — clean unworked leads", sub: "Due Apr 10 · unassigned · 820+ contacts to triage", status: "blocked", pill: "33d overdue", icon: "alert" },
  { name: "Coursera Wk 6–10: Create content & assets",     sub: "Due Fri May 15 · drafts done, videos + upload remain", status: "risk",    pill: "2d to deadline", icon: "video" },
  { name: "“I used to think…” (Social Media Calendar)",    sub: "Due 2023-07-11 · appears abandoned",               status: "stale",   pill: "Stale — archive?", icon: "archive" },
];

export const CALENDAR: CalendarItem[] = [
  { time: "1:30–3:10",    title: "LSG Retreat — Day 1 Foundational",         sub: "1307 New York Ave NW · on stage",      tag: "client" },
  { time: "2:45–4:00",    title: "Ragan AI Training — Guest Expert",         sub: "Zoom · Command Center session for Ragan team", tag: "client" },
  { time: "8:00–10:00",   title: "Evening Block",                            sub: "Day 1 debrief · Day 2 prep",           tag: "focus" },
];

export const WINS: WinItem[] = [
  { name: "Team LSG · Teal Baker",      sub: "Closed Apr 13 · AI pilots + agency workflow automation", amount: "$20,000" },
  { name: "Fenton · Wagner + Hill Taylor", sub: "Ongoing monthly retainer",                             amount: "$10,000",  recur: "/mo" },
  { name: "Emory University",            sub: "Closed Apr 02 · Faculty workshop, half-day",            amount: "$2,500"  },
  { name: "Ruder Finn",                  sub: "Closed Mar 28 · Single-session AI strategy",            amount: "$3,500"  },
];

export const QUICKIES: QuickieItem[] = [
  { who: "Maria",  ctx: "comms lead @ Tegna",       action: "Send the AI-in-PR article from TIC.",          channel: "email",    trigger: "she asked last week", tint: "yellow", rel: "active",  touch: "value", temp: "warm",    done: false },
  { who: "Tom B.", ctx: "former CMO, Edelman",      action: "Ping — haven't talked in 3 months.",           channel: "linkedin", trigger: "3 mo since last touch", tint: "blue", rel: "past",    touch: "checkin", temp: "cooling", done: false },
  { who: "Jordan", ctx: "intro from Priya",         action: "Reply to LinkedIn DM about retreat speaker slot.", channel: "linkedin", trigger: "DM from Tue",       tint: "pink", rel: "network", touch: "ask",     temp: "warm",    done: false },
  { who: "Dr. K.", ctx: "Emory program lead",       action: "Confirm Q3 workshop dates before she boards Fri.", channel: "email",    trigger: "her flight Fri",   tint: "mint", rel: "partner", touch: "ask",     temp: "warm",    done: false },
  { who: "Riley",  ctx: "podcast booker",           action: "Quick text — confirm Tuesday taping is still on.", channel: "text",     trigger: "taping in 4 days", tint: "peach",rel: "network", touch: "checkin", temp: "warm",    done: true  },
];

export const TASKS: TaskItem[] = [
  { name: "AI Agents for PR Pros — Session 2 prep (12 PM)", project: "Comms Collectiv", percent: 70, urgent: true },
  { name: "Retreat deck — opening + closing pass",          project: "Team LSG · AI Retreat", percent: 60, urgent: true },
  { name: "Pack travel kit before Acela 3 PM",              project: "Travel · DC", percent: 0, urgent: true },
  { name: "Brief Sharisse on Fenton check-in coverage",     project: "Fenton retainer", percent: 20, urgent: false },
];

export const NAV: NavItem[] = [
  { id: "today", label: "Today", icon: "sun", count: 7 },
  { id: "pipeline", label: "Pipeline", icon: "trend", count: 6 },
  { id: "projects", label: "Projects", icon: "grid", count: 4 },
  { id: "quickies", label: "Quickies", icon: "sparkles", count: 8 },
  { id: "pulse", label: "Pulse", icon: "pulse", count: 5 },
];

export const NAV_SETTINGS: NavItem[] = [
  { id: "notes", label: "Notes", icon: "note" },
  { id: "settings", label: "Settings", icon: "gear" },
];

// ─── PULSE ───────────────────────────────────────────────────────────────────

export const PULSE_METRICS: MetricItem[] = [
  { label: "Stories Today",       value: "5", sub: "fresh @ 7:58 AM May 13",   subDot: "healthy", trend: { dir: "flat", text: "manual pull" } },
  { label: "Posts Shipped (Wk)",  value: "1", sub: "of 5 target · retreat wk", subDot: "risk",    trend: { dir: "down", text: "−2 on the road" } },
  { label: "Posts Shipped (Mo)",  value: "6", sub: "May",                      subDot: "healthy", trend: { dir: "up",   text: "on pace" } },
  { label: "Avg Engagement",      value: "—", sub: "v2 metric — coming soon",  subDot: "stale",   trend: { dir: "flat", text: "tracking soon" } },
];

export const PULSE_CARDS: PulseCard[] = [
  {
    id: "p1",
    headline: "Sinch: 74% of enterprises have rolled back live AI customer comms agents",
    source: "PR Newswire / Sinch",
    publishedAt: "2026-05-09T09:00:00Z",
    sourceUrl: "https://www.prnewswire.com/news-releases/sinch-research-reveals-74-of-enterprises-have-rolled-back-live-ai-customer-communications-agents-302770730.html",
    whyItMatters: "The 'AI agent revolution' is quietly being undone in customer-facing comms.",
    summary: "New Sinch research finds 74% of enterprises have pulled or shut down a live AI customer communications agent after deployment — citing governance failures, not technology limits. The PR narrative is still 'AI is unstoppable.' The operating reality, especially in comms-adjacent functions, is far messier.",
    stance: "contrarian",
    draft: "Every keynote this spring told you AI agents were inevitable in customer communications.\n\nSinch just dropped research showing 74% of enterprises have already pulled the plug on one.\n\nNot because the agents couldn't write. Because nobody could answer the simplest questions a comms leader asks before launch: who reviews the draft? Who's liable when it goes wrong? Whose voice does it speak in?\n\nThree reads on this for comms leaders:\n\n1. The bottleneck isn't the model. It's governance. The companies that paused their agents didn't lose the tech race — they noticed they'd skipped the comms-and-legal review before going live.\n\n2. The contrarian career move is being the person who slows it down. Every comms team has an AI champion racing to ship. The next 18 months will reward the person willing to put the brake pedal next to the gas — the one asking who approves the AI's draft to the public.\n\n3. The vendors won't tell you this number. The downstream agencies and platforms will keep telling you 'agents are working at scale' because their pipeline depends on you believing it.\n\nIf your AI agent is in front of customers, it's a comms problem long before it's a technology problem.",
    status: "fresh",
  },
  {
    id: "p2",
    headline: "O'Dwyer's: The deepfake era has arrived — and PR is the front line",
    source: "O'Dwyer's",
    publishedAt: "2026-05-11T08:00:00Z",
    sourceUrl: "https://www.odwyerpr.com/story/public/24726/2026-05-11/deepfake-era-has-arrived-pr-is-front-line.html",
    whyItMatters: "Crisis comms playbooks built for misinformation don't survive synthetic CEO statements.",
    summary: "In the first four months of 2026, deepfakes crossed the line from emerging threat to operational attack vector — used against public companies. PR is now the function that has to detect, debunk, and respond inside an hour. Most teams aren't equipped.",
    stance: "standard",
    draft: "The deepfake call is no longer theoretical for communications leaders.\n\nO'Dwyer's reported this week that in the first four months of 2026, synthetic CEO statements moved from proof-of-concept to operational attack vector. The playbook your team built for misinformation was designed for fake quotes, screenshot edits, and bad reporting. None of those move at the speed of a 90-second deepfake video that looks like your CEO.\n\nThree shifts to make in the next two weeks:\n\n1. Define an internal authentication signal. A code phrase, a verified channel, a known cadence — anything that gives journalists and partners a way to know a statement is real. The biggest weakness in deepfake response isn't tech, it's that nobody pre-positioned a 'how to verify' anchor.\n\n2. Pre-write your debunk template. The first 60 minutes after a deepfake hits is when your audience decides whether to trust your eventual response. If you're drafting from scratch, you're already losing.\n\n3. Brief your CEO and exec team on what's already loose. Audio clones from publicly available interviews. Video synthesis from any podcast appearance. Tell them what's possible so they don't assume 'they wouldn't do that to me.'\n\nThis is no longer 'monitor and prepare.' It's an active threat against your principals' voice — and PR owns the response.",
    status: "fresh",
  },
  {
    id: "p3",
    headline: "OpenAI and Anthropic both launch enterprise AI consulting arms",
    source: "TechCrunch",
    publishedAt: "2026-05-04T13:00:00Z",
    sourceUrl: "https://techcrunch.com/2026/05/04/anthropic-and-openai-are-both-launching-joint-ventures-for-enterprise-ai-services/",
    whyItMatters: "The AI labs just became competitors of Accenture, Deloitte — and your firm's AI advisory practice.",
    summary: "Within days of each other, Anthropic and OpenAI both formed joint ventures to sell and install AI tools to enterprises. Anthropic partnered with Wall Street firms; OpenAI launched DeployCo with $4B in capital. The model providers are moving downstream into implementation work that consulting firms — and growing AI advisory practices inside PR firms — have been monetizing.",
    stance: "standard",
    draft: "If your PR firm built an AI advisory practice in the last 18 months, your competitive set just changed.\n\nThis week, OpenAI launched DeployCo with $4 billion in capital. Anthropic spun up a joint venture with Wall Street firms doing the same work. Both are now in the AI implementation business — not just selling the model, but doing the configuration, change management, and rollout that consultancies, agencies, and PR firms have been pricing as $50K–$500K engagements.\n\nThree implications worth thinking about:\n\n1. Your 'we'll help you adopt AI' pitch now has a $4B competitor with the source model under its arm. The differentiation can't be 'we know AI.' It has to be 'we know your industry, your audiences, and your reputation risks.'\n\n2. The labs will sell to your clients directly. Expect inbound from clients asking 'should we go straight to OpenAI for this?' The honest answer is sometimes yes — and the firms that say so will keep the relationship for the strategy work the labs can't do.\n\n3. Repositioning matters more than capability building. The advisory practices that survive aren't the ones with the most certifications. They're the ones whose insight about *what to communicate* about an AI rollout can't be replaced by the people building the tool.\n\nThe AI labs are now in your competitive set. Plan accordingly.",
    status: "fresh",
  },
  {
    id: "p4",
    headline: "AI in Communications Education Index 2026 — most programs still bolt-on",
    source: "EPR Research / Everything-PR",
    publishedAt: "2026-05-07T10:00:00Z",
    sourceUrl: "https://everything-pr.com/epr-post-the-ai-in-communications-education-index-2026/",
    whyItMatters: "The talent pipeline arriving in 18 months barely had a single AI-native class.",
    summary: "EPR Research's 2026 index grades U.S. PR, comms, advertising, and IMC programs on AI integration. Only a handful — Denver, Loyola Chicago — offer dedicated AI-in-comms concentrations. Most have added one elective. The grads entering the industry in 2027 will have less AI fluency than the ChatGPT-using interns you have right now.",
    stance: "standard",
    draft: "EPR Research just published the 2026 AI in Communications Education Index, and the headline isn't what most academic press releases want you to read.\n\nA handful of programs — the University of Denver, Loyola Chicago — are leading with dedicated AI-in-comms concentrations. The vast majority of comms, PR, advertising, and IMC programs have added one elective and called it a curriculum response.\n\nWhat this means for the next two years of hiring:\n\n1. Your incoming class of 2027 grads won't be AI-native by virtue of their degree. They'll be AI-curious individuals trying to teach themselves on top of a curriculum that assumes the industry didn't change in 2023.\n\n2. The gap between best-in-class programs and the median is widening — fast. Hire from a handful of named programs and you get a measurably different baseline. Hire from a median program and plan to do AI onboarding internally.\n\n3. Your existing junior talent who already use ChatGPT every day are more useful to you than next year's grads. Don't lose them while you wait for the pipeline to catch up.\n\nThe academy is lagging the industry by at least 24 months. Plan your talent strategy around that gap, not around hopes that it will close.",
    status: "fresh",
  },
  {
    id: "p5",
    headline: "Trump admin moves further into AI oversight — will test Google, Microsoft, xAI models",
    source: "CNBC",
    publishedAt: "2026-05-05T15:00:00Z",
    sourceUrl: "https://www.cnbc.com/2026/05/05/ai-oversight-trump-google-microsoft-xai.html",
    whyItMatters: "Government testing of frontier models means new disclosure expectations for every enterprise AI rollout.",
    summary: "The Trump administration is expanding federal AI oversight to require testing of Google, Microsoft, and xAI models. The framework is still being defined, but the direction is clear: enterprises deploying these models will face documentation and disclosure expectations that don't exist today. PR teams should expect to draft the public side of these disclosures within the next two quarters.",
    stance: "standard",
    draft: "Federal AI oversight is finally landing in something operational.\n\nThis week the Trump administration moved to test frontier models from Google, Microsoft, and xAI under a new regulatory framework. The mechanics are still being worked out, but the trajectory is now clear: enterprises that use these models in customer-facing or sensitive work will be asked to disclose how they're using them, what testing they've done, and what fail-safes they have in place.\n\nThree near-term implications for comms leaders:\n\n1. Your AI use-case inventory is about to be a regulatory artifact, not just an internal document. Who's using what model, for what purpose, with what review process? The answer needs to be writeable.\n\n2. The AI rollout press releases that worked in 2024 won't survive 2027. 'We're using AI to do X' is no longer enough; expect to need 'we tested it for Y risks and put Z controls in place.' That's a comms structural change, not a one-time write.\n\n3. Your legal and policy partners just became your closest collaborators. The teams that move on this proactively — instead of waiting for the framework to harden — will be the ones whose enterprises don't have to retrofit messaging at the last minute.\n\nThis isn't the EU AI Act. It's an administration moving fast on a smaller surface. PR teams that lean in now will look prescient in Q3.",
    status: "fresh",
  },
];

export const PULSE_DRAFTS_SAVED = [
  { id: "d1", headline: "OpenAI’s enterprise pricing shift — what it signals for AI procurement", source: "Reuters", savedAt: "2 days ago", words: 218 },
  { id: "d2", headline: "Why every PR firm is suddenly hiring ‘AI ethicists’ (and what they actually do)", source: "PRWeek", savedAt: "4 days ago", words: 167 },
];

export const PULSE_ARCHIVE_COUNT = 47;

// ─── PIPELINE ────────────────────────────────────────────────────────────────

export const PIPELINE_METRICS: MetricItem[] = [
  { label: "Open Pipeline",     value: "184", unit: "K", prefix: "$", sub: "across 9 deals",         subDot: "healthy", trend: { dir: "up",   text: "+18% QoQ" } },
  { label: "Active Deals",      value: "9",                          sub: "3 stuck · 6 moving",      subDot: "risk",    trend: { dir: "flat", text: "no change" } },
  { label: "90-Day Forecast",   value: "98",  unit: "K", prefix: "$", sub: "weighted by stage",      subDot: "healthy", trend: { dir: "up",   text: "+22% vs Q1" } },
  { label: "Won This Quarter",  value: "112", unit: "K", prefix: "$", sub: "Q2 goal $150K",          subDot: "healthy", trend: { dir: "up",   text: "75% to goal" } },
  { label: "Win Rate",          value: "42",  unit: "%",              sub: "trailing 4 quarters",    subDot: "healthy", trend: { dir: "up",   text: "+6 pts" } },
  { label: "Avg Cycle Time",    value: "31",  unit: "d",              sub: "first touch → close",    subDot: "risk",    trend: { dir: "down", text: "+4 days" } },
];

export const PIPELINE_REVENUE_SERIES = {
  months:    ["May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar","Apr"],
  retainer:  [ 8, 10, 10, 10, 12, 14, 14, 16, 18, 20, 22, 22 ],
  workshop:  [ 6,  4,  9, 12,  6, 18,  8, 22, 14, 10, 28, 18 ],
  advisory:  [ 4,  3,  6,  4,  8,  6, 12,  9, 12,  8, 14, 16 ],
};

export const PIPELINE_FORECAST_BY_SERVICE = [
  { label: "Workshop / training", value: 42, share: 0.43 },
  { label: "Strategic advisory",  value: 28, share: 0.29 },
  { label: "Monthly retainer",    value: 18, share: 0.18 },
  { label: "Speaking",            value: 10, share: 0.10 },
];

export const LEAD_NURTURE: LeadItem[] = [
  { name: "Aspen Group",     source: "Inbound · LinkedIn",       contact: "Lena Park, comms director", stage: "MQL",   value: "$22K", days: 14, next: "Send framework one-pager",     last: "2d ago",   status: "warm",  suggest: "graduate" },
  { name: "Gartner Comms",   source: "Referred · Sharisse",       contact: "Avi Mehta, research lead",  stage: "Lead",  value: "$15K", days: 9,  next: "Confirm contact role",         last: "5d ago",   status: "warm",  suggest: "touch" },
  { name: "BCG · Atlanta",   source: "Outbound · Q1 list",        contact: "Marisol Reyes, principal",  stage: "MQL",   value: "$48K", days: 31, next: "Wait — they replied Mon",      last: "yesterday", status: "warm",  suggest: "graduate" },
  { name: "Penguin Random",  source: "Inbound · website form",    contact: "Theo Wynne, brand strategy",stage: "Lead",  value: "$8K",  days: 21, next: "Graduate or cool — 21d quiet", last: "21d ago",  status: "cool",  suggest: "cool" },
  { name: "Square Inc.",     source: "Conf · AI+Comms NYC",       contact: "Devi Anand, VP comms",      stage: "Lead",  value: "$12K", days: 44, next: "Cool-off — wrong moment",      last: "44d ago",  status: "cold",  suggest: "cool" },
  { name: "Tasveer Studios", source: "Referred · Priya",          contact: "Priya Iyer, co-founder",    stage: "MQL",   value: "$18K", days: 4,  next: "Schedule discovery call",      last: "today",    status: "warm",  suggest: "graduate" },
];

export const RELATIONSHIP_OVERVIEW = {
  rows: [
    { id: "active",  label: "Active clients",   total: 5, warm: 5, cooling: 0, cold: 0, debt: 3, hint: "3 owed a value-drop" },
    { id: "past",    label: "Past clients",     total: 11, warm: 4, cooling: 5, cold: 2, debt: 0, hint: "5 sliding past 90d" },
    { id: "partner", label: "Partners",         total: 7, warm: 5, cooling: 1, cold: 1, debt: 0, hint: "Healthy" },
    { id: "network", label: "Network",          total: 38, warm: 12, cooling: 18, cold: 8, debt: 0, hint: "8 fully gone silent" },
    { id: "mentor",  label: "Mentors / friends", total: 6, warm: 5, cooling: 1, cold: 0, debt: 0, hint: "Birthday — Priya" },
  ] as RelationshipRow[],
};

export const PULSE_SAVED_CUES: SavedCue[] = [
  {
    id: "sc1",
    headline: "OpenAI’s enterprise pricing shift — what it signals for AI procurement",
    source: "Reuters", savedAt: "2 days ago", words: 218, queueSlot: null,
    stance: "standard", expiresIn: 12,
    hook: "OpenAI just made every enterprise AI procurement conversation harder.",
    body: "OpenAI’s enterprise pricing change this week — moving from seat-based to usage-tiered with platform commitments — quietly does three things to your 2026 procurement playbook.\n\nFirst, the budget conversation moves from IT to finance. Usage-based pricing without firm caps is a CFO problem, not a CIO one.\n\nSecond, the multi-vendor strategy that everyone said they were doing ‘someday’ just became ‘this quarter.’ If your contract terms can’t survive a 30% price jump on a single SKU, you’re not actually multi-vendor.\n\nThird — and this is the one most teams will miss — the shift advantages incumbents with predictable workloads, not innovators with experimental ones. The companies racing to find new use cases are about to get a bill that doesn’t reward exploration.\n\nThe move this week: if you’re a comms or marketing leader briefing finance, get ahead of it. Map your AI spend to *outcomes per dollar*, not seats. The procurement team will thank you in Q3.",
    cta: "If you’re heading into procurement renewals, what are you watching for?",
    note: "Soften the ‘CFO problem’ line — too dunky for LinkedIn",
  },
  {
    id: "sc2",
    headline: "Why every PR firm is suddenly hiring ‘AI ethicists’ (and what they actually do)",
    source: "PRWeek", savedAt: "4 days ago", words: 167, queueSlot: "Tue 9:00 AM",
    stance: "contrarian", expiresIn: 10,
    hook: "Every PR firm is hiring an ‘AI ethicist.’ Most of them are window dressing.",
    body: "Edelman, Weber, BCW, FleishmanHillard — every top-10 firm has now posted an AI ethicist role in the past 90 days. The job descriptions are nearly identical. So is the problem.\n\nThe role is being scoped as a *permission layer* — someone who reviews AI-generated content before it ships. That’s not ethics. That’s compliance with extra steps.\n\nReal AI ethics in a comms firm looks different:\n\n- It’s a seat at the *strategy* table, not the review queue. Decisions about *what* to automate matter more than how.\n- It’s a calibration role, not a gate. The ethicist should be defining what the firm’s AI shouldn’t be asked to do at all — not catching mistakes after they’re made.\n- It’s a builder role. The output is policy, not vetoes.\n\nIf your firm’s new AI ethicist isn’t in the room when you’re scoping a client’s AI launch — they’re a compliance officer with a fancier title.",
    cta: "What does AI ethics actually look like inside *your* firm?",
    note: "",
  },
  {
    id: "sc3",
    headline: "Salesforce’s ‘40% headcount cut from AI’ walkback — what comms leaders should do",
    source: "Axios", savedAt: "5 days ago", words: 184, queueSlot: null,
    stance: "standard", expiresIn: 9,
    hook: "Salesforce walked back the ‘40% headcount cut from AI’ line this week. The lesson is bigger than the walkback.",
    body: "When Marc Benioff said in February that AI would let Salesforce cut 40% of headcount, every comms leader I know got the same email from their CEO: “can we do this?”\n\nThis week’s walkback — quietly, in a footnote on the earnings call — reframes the whole conversation. The actual reduction was closer to 8%, mostly through attrition, not AI. The 40% number was an aspiration that never materialized.\n\nWhat happened in between: a year of churn, anxiety, and quiet departures of senior people who couldn’t tell whether the strategy was real.\n\nFor comms leaders, the lesson is sharp. AI productivity claims that can’t be backed up with specific, dated, named outcomes do three kinds of damage at once:\n\n1. They erode internal trust faster than any external story.\n2. They put your CEO in a position where the walkback *is* the headline.\n3. They make every future AI claim from your company harder to land.",
    cta: "Where is your team setting AI expectations you’ll regret in a year?",
    note: "Maybe split into two posts — the discipline part stands alone",
  },
];

export const PULSE_QUEUE: QueueSlot[] = [
  { id: "q1", slot: "Mon 9:00 AM",  title: "FTC inquiry → liability frame for AI launches",        status: "scheduled" },
  { id: "q2", slot: "Tue 9:00 AM",  title: "PR firms hiring AI ethicists (contrarian take)",       status: "scheduled" },
  { id: "q3", slot: "Wed 9:00 AM",  title: "—",                                                    status: "open" },
  { id: "q4", slot: "Thu 9:00 AM",  title: "Anthropic Skills framework — comms application",       status: "scheduled" },
  { id: "q5", slot: "Fri 9:00 AM",  title: "—",                                                    status: "open" },
];

export const STUCK_DEALS = {
  count: 3,
  totalValue: "47K",
  oldest: "Tegna · 47 days untouched",
};

export const PIPELINE_DEALS: DealItem[] = [
  { client: "Tegna",            stage: "Proposal",      value: "$45,000", next: "Send revised SOW",        last: "47d", owner: "CG", stuck: true },
  { client: "Pernod Ricard",    stage: "Discovery",     value: "$28,000", next: "Schedule kick-off",       last: "12d", owner: "CG", stuck: false },
  { client: "Atlanta Tech Vlg", stage: "Negotiation",   value: "$36,000", next: "Counter on retainer",     last: "3d",  owner: "CG", stuck: false },
  { client: "WPP / Hill+Knwlt", stage: "Qualification", value: "$22,000", next: "Recruiter call Wed",      last: "1d",  owner: "CG", stuck: false },
  { client: "Spelman College",  stage: "Proposal",      value: "$18,000", next: "Send budget options",     last: "31d", owner: "CG", stuck: true },
  { client: "Edelman",          stage: "Discovery",     value: "$35,000", next: "Intro to Maria’s team",   last: "5d",  owner: "CG", stuck: false },
];

export const PIPELINE_LOSSES: LossItem[] = [
  { client: "Coca-Cola Co.",   amount: "$50,000", date: "Mar 22", reason: "Internal team won the work" },
  { client: "GA Power",        amount: "$24,000", date: "Mar 11", reason: "Budget pulled into Q3" },
  { client: "Nike (Beaverton)",amount: "$80,000", date: "Feb 28", reason: "RFP awarded to incumbent" },
];

// ─── PROJECTS ────────────────────────────────────────────────────────────────

export const PROJECTS_METRICS: MetricItem[] = [
  { label: "Active",       value: "4", sub: "1 at risk",          subDot: "risk",    trend: { dir: "flat", text: "no change" } },
  { label: "On Hold",      value: "2", sub: "awaiting client",     subDot: "stale",   trend: { dir: "flat", text: "vs last wk" } },
  { label: "Closed Q2",    value: "6", sub: "+ 1 retainer flip",   subDot: "healthy", trend: { dir: "up",   text: "+2" } },
  { label: "Avg Time-to-Ship", value: "23", unit: "d", sub: "kickoff → delivery", subDot: "healthy", trend: { dir: "up",   text: "−5 days" } },
];

export const PROJECT_CARDS: ProjectCard[] = [
  { name: "Coursera Wk 6–10",        client: "Coursera",      deadline: "Apr 24",  daysLeft: 0,   percent: 75, openTasks: 3, blockers: 1, last: "2h ago",  health: "risk",    stage: "in-flight" },
  { name: "AI Leadership Retreat",   client: "TIC Foundation",deadline: "May 05",  daysLeft: 11,  percent: 60, openTasks: 8, blockers: 0, last: "yesterday", health: "healthy", stage: "in-flight" },
  { name: "Fenton Retainer · Apr",   client: "Fenton",        deadline: "Apr 30",  daysLeft: 6,   percent: 40, openTasks: 5, blockers: 0, last: "3d ago",  health: "healthy", stage: "in-flight" },
  { name: "Tegna AI-in-PR Workshop", client: "Tegna",         deadline: "Jun 12",  daysLeft: 49,  percent: 15, openTasks: 4, blockers: 2, last: "5d ago",  health: "risk",    stage: "in-flight" },
  { name: "Lead Nurture Pipeline",   client: "Internal",      deadline: "rolling", daysLeft: null,percent: 80, openTasks: 2, blockers: 0, last: "today",   health: "healthy", stage: "in-flight" },
  { name: "Emory Workshop",          client: "Emory University",deadline: "Jul 18",daysLeft: 85,  percent: 10, openTasks: 6, blockers: 0, last: "1w ago",  health: "stale",   stage: "on-hold" },
  { name: "Social Media Calendar",   client: "Internal",      deadline: "—",      daysLeft: null,percent: 5,  openTasks: 1, blockers: 1, last: "2023",    health: "stale",   stage: "on-hold" },
];

// ─── QUICKIES PAGE ────────────────────────────────────────────────────────────

export const QUICKIES_METRICS: MetricItem[] = [
  { label: "Open Quickies",  value: "8",  sub: "3 due today",                        subDot: "risk",    trend: { dir: "down", text: "−2 vs y’day" } },
  { label: "Value Debt",     value: "3",  sub: "of 5 active clients · no value drop in 30d", subDot: "blocked", trend: { dir: "up",  text: "+1 since Mon" } },
  { label: "Done This Week", value: "12", sub: "ahead of weekly avg (9)",            subDot: "healthy", trend: { dir: "up",   text: "+33%" } },
];

export const QUICKIES_FULL: QuickieItem[] = [
  { who: "Maria",   ctx: "comms lead @ Tegna",          action: "Send the AI-in-PR article from TIC.",         channel: "email",    trigger: "she asked last week",  tint: "yellow", rel: "active",  touch: "value",   temp: "warm",    pinned: true,  done: false },
  { who: "Tom B.",  ctx: "former CMO, Edelman",         action: "Ping — haven’t talked in 3 months.",          channel: "linkedin", trigger: "3 mo since last touch", tint: "blue", rel: "past",    touch: "checkin", temp: "cooling", pinned: false, done: false },
  { who: "Jordan",  ctx: "intro from Priya",            action: "Reply to LinkedIn DM about retreat speaker.", channel: "linkedin", trigger: "DM from Tue",          tint: "pink", rel: "network", touch: "ask",     temp: "warm",    pinned: false, done: false },
  { who: "Dr. K.",  ctx: "Emory program lead",          action: "Confirm Q3 workshop dates before she boards Fri.", channel: "email", trigger: "her flight Fri",   tint: "mint", rel: "partner", touch: "ask",     temp: "warm",    pinned: true,  done: false },
  { who: "Riley",   ctx: "podcast booker",              action: "Quick text — confirm Tuesday taping is still on.", channel: "text",  trigger: "taping in 4 days",  tint: "peach",rel: "network", touch: "checkin", temp: "warm",    pinned: false, done: true  },
  { who: "Kennedy", ctx: "Wagner + Hill Taylor",        action: "Send April retainer recap one-pager.",         channel: "email",    trigger: "month-end",            tint: "yellow", rel: "active",  touch: "value",   temp: "warm",    pinned: false, done: false },
  { who: "Priya",   ctx: "co-founder @ Tasveer",        action: "Birthday text — turning 40.",                  channel: "text",     trigger: "tomorrow",             tint: "pink",   rel: "mentor",  touch: "checkin", temp: "warm",    pinned: false, done: false },
  { who: "Marcus",  ctx: "VC at Lerer Hippeau",         action: "Coffee follow-up after AI Salon.",             channel: "email",    trigger: "met 2 wks ago",        tint: "blue",   rel: "network", touch: "checkin", temp: "cold",    pinned: false, done: false },
];

export const QUICKIES_DONE_RECENT = [
  { who: "Lisa",    action: "Sent Q1 retro deck",            when: "Apr 23" },
  { who: "Eddie",   action: "Replied to LinkedIn intro",     when: "Apr 22" },
  { who: "Dr. K.",  action: "Confirmed contract paper",       when: "Apr 21" },
  { who: "Sasha",   action: "Birthday text",                  when: "Apr 19" },
];

export const QUICKIES_SUGGESTED = [
  { who: "Steve M.", ctx: "former GM, Atlanta Hawks", reason: "127 days since last email" },
  { who: "Dana V.",  ctx: "ad ops, Hearst",            reason: "104 days since last email" },
  { who: "Ben R.",   ctx: "ex-Google PM, mentor",      reason: "98 days since last email" },
];

// ─── NOTES ───────────────────────────────────────────────────────────────────

export const NOTES: NoteItem[] = [
  { id: "n1", title: "Retreat speaker shortlist",
    preview: "Three names from Priya — all fit the ‘practitioner, not pundit’ filter we set in March…",
    edited: "2h ago",
    body: `Three names from **Priya** — all fit the *practitioner, not pundit* filter we set in March:\n\n- Dr. K. (Emory, ethics)\n- Marcus (Lerer Hippeau, capital)\n- Tom B. (former CMO, distribution)\n\nNeed to confirm Tom’s availability before May 1. Marcus is the riskiest — high signal, low reliability.`,
    links: [{ type: "project", label: "AI Leadership Retreat" }, { type: "contact", label: "Priya" }],
    pinned: true,
  },
  { id: "n2", title: "Maria · Tegna debrief",
    preview: "Their team is allergic to ‘AI consultant’ framing. Lead with case studies, not capabilities…",
    edited: "yesterday",
    body: `Their team is allergic to "AI consultant" framing. Lead with case studies, not capabilities.\n\nMaria specifically asked for the TIC piece — she wants to share it internally before the next exec sync.\n\nNext step: send the article + a 1-pager on the workshop format.`,
    links: [{ type: "contact", label: "Maria" }, { type: "project", label: "Tegna AI-in-PR Workshop" }],
    pinned: false,
  },
  { id: "n3", title: "Coursera Wk 6 outline",
    preview: "Three lessons. Each one paired with a real-world prompt-as-policy example…",
    edited: "Apr 22",
    body: `Three lessons. Each one paired with a real-world prompt-as-policy example.\n\n1. Why prompts are policy\n2. The audit trail problem\n3. Designing for graceful failure\n\nRecord lesson 5 first — highest stakes, fresh head.`,
    links: [{ type: "project", label: "Coursera Wk 6–10" }, { type: "event", label: "Recording session" }],
    pinned: false,
  },
  { id: "n4", title: "Pricing thoughts (Q2)",
    preview: "Stop quoting day rates. Quote outcomes. Day rates anchor the conversation in cost…",
    edited: "Apr 19",
    body: `Stop quoting day rates. Quote outcomes. Day rates anchor the conversation in cost.\n\nNew template: $X to deliver Y measurable thing within Z weeks.`,
    links: [],
    pinned: false,
  },
  { id: "n5", title: "Fenton April recap notes",
    preview: "What worked: weekly memo cadence. What didn’t: Slack threads going stale by Wed…",
    edited: "Apr 18",
    body: `What worked: weekly memo cadence.\nWhat didn’t: Slack threads going stale by Wednesday.\n\nProposing async standups on Mon/Thu starting May.`,
    links: [{ type: "project", label: "Fenton Retainer · Apr" }, { type: "contact", label: "Kennedy" }],
    pinned: false,
  },
  { id: "n6", title: "Talk idea — ‘The calm operator’",
    preview: "Anti-hustle ops dashboard talk. Working title. Outline the three feelings: settled, clear, earned…",
    edited: "Apr 15",
    body: `Anti-hustle ops dashboard talk. Working title.\n\nOutline the three feelings: settled, clear, earned.\n\nMaybe pitch this for SXSW 2027.`,
    links: [],
    pinned: false,
  },
];

// ─── SETTINGS ────────────────────────────────────────────────────────────────

export const CONNECTORS: ConnectorItem[] = [
  { name: "HubSpot",  status: "healthy", lastSync: "8 min ago",  for: "Pipeline · source of truth" },
  { name: "Outlook",  status: "risk",    lastSync: "3 hr ago",   for: "Calendar — token expiring" },
  { name: "Slack",    status: "healthy", lastSync: "2 min ago",  for: "Notifications" },
  { name: "LinkedIn", status: "blocked", lastSync: "Apr 19",     for: "Quickies — reconnect needed" },
  { name: "Zapier",   status: "healthy", lastSync: "1 hr ago",   for: "Inbound triggers · Buffer" },
];

export const TEAM_MEMBERS: TeamMember[] = [
  { name: "Chris Gee",       email: "chris@command.cg",     role: "Operator",      avatar: "CG", you: true,  defaultView: "Today (full)" },
  { name: "Sharisse Walker", email: "sharisse@command.cg", role: "Collaborator",  avatar: "SW", you: false, defaultView: "Today (collaborator)" },
  { name: "Pat (assistant)", email: "pat@command.cg",       role: "Viewer",        avatar: "PA", you: false, defaultView: "Calendar only" },
];

// ─── SHARISSE COLLAB DATA ────────────────────────────────────────────────────

export const SHARISSE_HOOK = "Chris has Coursera due today and three deals stuck. Two things you can do that move the needle without asking him.";

export const SHARISSE_PRIORITY = {
  kicker: "HOW CAN I HELP TODAY?",
  title: "Coursera platform upload + grading config — both unblock Chris’s afternoon recording window.",
  hint: "Promote any Quickie below to send it to Chris’s queue with a tap.",
  progressLabel: "2 ASSISTS QUEUED",
  percent: 0,
};

export const SHARISSE_METRICS: MetricItem[] = [
  { label: "Tasks Assigned to Me",   value: "5",  sub: "2 due today",                  subDot: "risk",    trend: { dir: "up",   text: "+1 since Mon" } },
  { label: "Waiting on Chris",        value: "3",  sub: "oldest 4 days",               subDot: "risk",    trend: { dir: "flat", text: "no change" } },
  { label: "Done This Week",          value: "9",  sub: "weekly avg 7",                subDot: "healthy", trend: { dir: "up",   text: "+29%" } },
  { label: "TIC Newsletter",          value: "On time", sub: "ships Friday 9 AM",     subDot: "healthy", trend: { dir: "flat", text: "weekly" } },
];

export const SHARISSE_WAITING: StatusItem[] = [
  { name: "Approve Tegna SOW revisions",    sub: "Sent Apr 20 · 4 days waiting",                status: "blocked", pill: "blocking",      icon: "alert" },
  { name: "Sign off on retreat speaker list", sub: "Sent Apr 22 · 2 days waiting",              status: "risk",    pill: "needs reply",   icon: "mail" },
  { name: "Confirm Fenton retainer scope",  sub: "Sent Apr 23 · 1 day waiting",                 status: "risk",    pill: "needs reply",   icon: "alert" },
];

export const SHARISSE_QUICKIES_SUGGESTED = [
  { who: "Maria",   ctx: "Tegna",      action: "She replied — wants the article + a workshop 1-pager.", reason: "spotted in inbox 7:14 AM",  channel: "email" },
  { who: "Dr. K.",  ctx: "Emory",      action: "Her assistant pinged about Q3 dates — gentle nudge.",   reason: "calendar conflict surfaced", channel: "email" },
  { who: "Marcus",  ctx: "Lerer Hippeau", action: "Posted on LinkedIn re: AI Salon — Chris should comment.", reason: "LinkedIn activity",        channel: "linkedin" },
];
