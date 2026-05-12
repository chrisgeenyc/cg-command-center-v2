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

export const TODAY_LABEL = "Tuesday, May 12";

export const HOOK = "Wheels up to DC by 3 PM. Two client sessions stacked before the Acela, then dinner with Tesa to kick off the retreat week. Whatever's not packed by lunch isn't coming.";

export const PRIORITY = {
  kicker: "TODAY'S SINGLE PRIORITY",
  title: "Travel day to the LSG Retreat in DC. Acela 2163 leaves Penn at 3:00 — morning is client time, 1:30 block is your last seal on the bag, the deck, and the opening line.",
  hint: "If it isn't in the carry-on by 2:45, it isn't coming to DC.",
  progressLabel: "T-1 DAY",
  percent: 90,
};

export const METRICS: MetricItem[] = [
  { label: "Active Projects",  value: "4",   sub: "2 at risk · retreat T-1 + Coursera Fri", subDot: "risk", trend: { dir: "flat", text: "no change" } },
  { label: "Open Tasks",       value: "4",   sub: "today's travel-day stack", subDot: "healthy", trend: { dir: "flat", text: "no change" } },
  { label: "Pipeline Won",     value: "36",  unit: "K",  prefix: "$",         sub: "+ Fenton $10K/mo retainer", subDot: "healthy", trend: { dir: "up", text: "+12%" }, spark: true },
  { label: "This Week's Deadlines", value: "2", sub: "Retreat Wed-Thu · Coursera Fri",  subDot: "risk",    trend: { dir: "flat", text: "front-loaded wk" } },
];

export const PROJECTS: StatusItem[] = [
  { name: "CG Command Center",        sub: "Live · v2 dashboard auto-refresh wired today",        status: "healthy", pill: "Shipped",  icon: "terminal" },
  { name: "Team LSG · AI Retreat",    sub: "Wed-Thu May 13-14 · DC · travel day · on stage tomorrow", status: "risk",    pill: "T-1 day", icon: "video" },
  { name: "Coursera Wk 6–10",         sub: "Drafts done · video recording + upload remain",       status: "risk",    pill: "Due Fri",  icon: "video" },
  { name: "Fenton retainer",          sub: "Active · weekly check-ins via Shakirah",              status: "healthy", pill: "Healthy",  icon: "mail" },
];

export const BLOCKED: StatusItem[] = [
  { name: "Audit HubSpot contacts — clean unworked leads", sub: "Due Apr 10 · unassigned · 820+ contacts to triage", status: "blocked", pill: "32d overdue", icon: "alert" },
  { name: "Coursera Wk 6–10: Create content & assets",     sub: "Due Fri May 15 · drafts done, videos + upload remain", status: "risk",    pill: "3d to deadline", icon: "video" },
  { name: "“I used to think…” (Social Media Calendar)",    sub: "Due 2023-07-11 · appears abandoned",               status: "stale",   pill: "Stale — archive?", icon: "archive" },
];

export const CALENDAR: CalendarItem[] = [
  { time: "9:00–10:00",   title: "Morning Block",                            sub: "Focus · pre-flight prep",            tag: "focus" },
  { time: "10:30–11:00",  title: "Torie Johnson — 30-min Connect",           sub: "Baylor · intro Zoom",                tag: "client" },
  { time: "12:00–1:30",   title: "AI Agents for PR Pros — Session 2",        sub: "Comms Collectiv cohort · Zoom",      tag: "client" },
  { time: "1:30–3:00",    title: "Block",                                    sub: "Final pack · deck pass · door check",tag: "focus" },
  { time: "3:00–6:02",    title: "Acela 2163 — Penn Stn → DC",                sub: "Train to Eaton Hotel · res 1F44EE",  tag: "deadline" },
  { time: "7:15–9:15",    title: "Tesa Lau — Happy Hour",                    sub: "Rosslyn Towers · retreat warm-up",   tag: "client" },
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
  { label: "Stories Today",       value: "5", sub: "fresh @ 6:42 AM",          subDot: "healthy", trend: { dir: "flat", text: "daily refresh" } },
  { label: "Posts Shipped (Wk)",  value: "3", sub: "of 5 target",              subDot: "risk",    trend: { dir: "up",   text: "+1 vs last wk" } },
  { label: "Posts Shipped (Mo)",  value: "11",sub: "April",                    subDot: "healthy", trend: { dir: "up",   text: "+27% MoM" } },
  { label: "Avg Engagement",      value: "—", sub: "v2 metric — coming soon",  subDot: "stale",   trend: { dir: "flat", text: "tracking soon" } },
];

export const PULSE_CARDS: PulseCard[] = [
  {
    id: "p1",
    headline: "FTC opens inquiry into AI agents marketing as ‘autonomous,’ citing consumer-deception risks",
    source: "Wall Street Journal",
    publishedAt: "2026-04-24T05:30:00Z",
    sourceUrl: "https://wsj.com/",
    whyItMatters: "Reframes the agentic-AI narrative from capability to liability.",
    summary: "The FTC’s inquiry isn’t just about labels. It’s the first regulatory move to interrogate the gap between what agentic AI is *marketed* to do and what it actually delivers under real-world load. Comms teams writing AI launch copy this quarter just inherited a new compliance lens — and it’s stricter than the EU AI Act on consumer-deception grounds.",
    stance: "contrarian",
    draft: "Everyone’s reading the FTC’s agentic-AI inquiry as a slowdown signal. They’re wrong.\n\nThis is the moment communications leaders have been waiting for. Until now, every AI launch has been graded on capability — “look how autonomous our agent is.” The FTC just made *honesty* the new differentiator. The brands that will win the next 18 months aren’t the ones with the most autonomous agents; they’re the ones whose marketing copy survives a deposition.\n\nThree shifts to make this week:\n\n1. Audit your AI product copy for words your agent can’t fully back up: “autonomous,” “intelligent,” “reasoning,” “decides.” If your engineers wouldn’t sign off on the literal claim, your comms team shouldn’t ship it.\n\n2. Build a capability ladder — what the agent does, what it assists with, what a human still owns. Show it on the marketing page. The transparency *is* the trust signal.\n\n3. Get your legal partner in the room *before* the launch deck, not after. The cost of a redo is one week. The cost of an FTC consent order is your roadmap.\n\nThe companies that overcorrect into vague “AI-powered” mush will lose. The ones that get specific — about what the agent does, how, and where the human stays — will own the next category.",
    status: "fresh",
  },
  {
    id: "p2",
    headline: "Edelman Trust Barometer: trust in CEO communications drops 9 points YoY, AI cited as top driver",
    source: "Edelman",
    publishedAt: "2026-04-23T13:00:00Z",
    sourceUrl: "https://edelman.com/",
    whyItMatters: "Synthetic CEO content is eroding the trust premium leaders had over institutions.",
    summary: "Edelman’s annual barometer landed Tuesday. The headline number — a 9-point YoY drop in CEO communication trust — buries the more important finding: respondents who *suspected* AI involvement in CEO content trusted the leader 22 points less than those who didn’t. The category that brought CEO comms back from the 2008 lows is the same one undoing it.",
    stance: "standard",
    draft: "Edelman’s 2026 Trust Barometer dropped this week, and one stat should sit at the center of every comms leader’s quarterly review.\n\nTrust in CEO communications fell 9 points year-over-year. The driver isn’t politics, it isn’t economic anxiety, and it isn’t “the news cycle.” It’s a single perception: stakeholders increasingly suspect their CEO’s words aren’t actually their CEO’s words.\n\nWhen respondents *suspected* AI involvement in a CEO statement, trust dropped 22 points. Twenty-two.\n\nThe path forward isn’t to ban AI from the executive comms function — that ship sailed. The path is radical transparency about *what* AI does and *what* the principal does.",
    status: "fresh",
  },
  {
    id: "p3",
    headline: "Google rolls out AI Overviews to 40 more languages — publisher traffic study shows 34% click loss",
    source: "Search Engine Land",
    publishedAt: "2026-04-23T08:15:00Z",
    sourceUrl: "https://searchengineland.com/",
    whyItMatters: "Owned media strategy needs a rethink — fast.",
    summary: "AI Overviews are now in 40 new markets, and a fresh Sistrix study quantifies the damage to publishers: average 34% click-through loss on informational queries even when sites rank #1. This is the inflection point comms and content leaders feared was a year out. It’s now.",
    stance: "standard",
    draft: "If your 2026 content strategy is built on driving traffic to your blog, you’re optimizing for a metric that no longer maps to outcomes.\n\nGoogle’s AI Overviews expanded to 40 new markets this week.",
    status: "fresh",
  },
  {
    id: "p4",
    headline: "Inside Meta’s new comms playbook: ‘AI-native’ release notes, no human spokesperson on calls under $50M",
    source: "The Information",
    publishedAt: "2026-04-22T19:00:00Z",
    sourceUrl: "https://theinformation.com/",
    whyItMatters: "A bellwether is publicly removing humans from the loop. The pushback will be loud.",
    summary: "The Information’s leaked memo describes Meta restructuring product comms around AI-drafted release notes and removing human spokespeople from sub-$50M product calls. Whatever you think of the move, every comms leader will be asked about it on their next exec sync.",
    stance: "contrarian",
    draft: "The Meta comms memo leak this week is being read as a bellwether. “Big tech is removing humans from the loop. The rest of us will follow.”\n\nNo. We won’t. And we shouldn’t.",
    status: "fresh",
  },
  {
    id: "p5",
    headline: "Anthropic publishes ‘Skills’ framework for enterprise AI deployment — early adopters report 3x time savings on internal comms",
    source: "Anthropic",
    publishedAt: "2026-04-22T14:00:00Z",
    sourceUrl: "https://anthropic.com/",
    whyItMatters: "Practical, repeatable, deploys this week — not 2027.",
    summary: "Anthropic’s Skills framework lets enterprise teams package internal expertise into reusable AI capabilities. Three early adopters in the comms space report 3x speedups on routine deliverables.",
    stance: "standard",
    draft: "Anthropic shipped a framework this week called Skills, and if you lead a comms function, it’s the most directly applicable AI release of the quarter.",
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
