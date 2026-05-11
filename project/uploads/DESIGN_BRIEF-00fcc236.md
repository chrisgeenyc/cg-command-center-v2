# Design Brief — CG Command Center

**For:** Claude Design
**From:** Chris Gee
**Reference inspiration:** LeadLogic dashboard (attached separately)
**Current state:** Functional Next.js + Tailwind app at `/cg-command-center`. Layout works; visuals need a level-up.

---

## The product in one line

A personal morning command center — at-a-glance answers to *"what fires today, what's at risk, what closed, what's next."* No dashboard fatigue. No demo-data energy. Real signal, scannable in 30 seconds.

## Personas — two users, two daily questions

The dashboard serves two people from the same data layer:

- **Operator (Chris).** Founder. Daily question: *"What fires today? What's at risk? What closed? What's next?"* Sees everything — Pipeline, Pulse, all Quickies, all projects, revenue, the works. The default home is the full Today page specified throughout this brief.
- **Collaborator (Sharisse).** VA / chief of staff. Daily question: *"What fires today? What's at risk? **How can I help?**"* The "how can I help" is the sharp differentiator. Hers is a service-oriented dashboard, not a strategic one.

Same app. Same auth. Different default home. Different defaults for what's visible. Designer should think of these as **two persona-tuned variants of Today**, not two separate apps.

**What's shared (both see):**
- Tasks assigned to or shared with them
- Pulse cues flagged for collaboration
- Calendar events they're both on
- Projects they both touch
- Newsletter (TIC) pipeline state

**What's Operator-only by default:**
- Pipeline page (revenue, deal values, strategic surface) — Chris's strategic clarity is preserved
- Quickies (relationship work is personal)
- Most Settings (Sharisse sees only her own profile + display preferences)

**The handoff currency: tasks.** Chris doesn't share his Pipeline page with Sharisse — he creates *tasks* off it. A stuck deal becomes a task: "send Maria the deck." That task is assigned to Sharisse and shows up in her view with enough context to act, without exposing the dollar values or stage data behind it. *Strategy stays Chris's; action propagates.*

---

## The voice of the design

**Calm operator, not enterprise SaaS.** This is a single-user tool that has to feel like it was made for one person — not licensed by 500. Confident, warm, slightly editorial. The kind of dashboard that makes its owner sit up straighter.

Three feelings to engineer:
1. **Settled** — the sidebar gives the eye a home base.
2. **Clear** — numbers are big, status is obvious, nothing fights for attention.
3. **Earned** — the gradient hero spot rewards completion or signals the day's single most important call-to-action.

---

## What the LeadLogic reference does well (port these)

- **Dark sidebar + airy canvas.** The contrast turns the sidebar into a quiet "operating system" while the workspace breathes. Sidebar should be a deep charcoal/near-black with subtle radial gradient, not flat black.
- **Lime-green active chip** against the dark sidebar. High-impact accent, used sparingly — only on the active nav item and 1–2 CTAs. Never decorative.
- **Lavender / cool-tinted background** on the canvas (not pure white, not gray-50). Creates a softer, less clinical workspace.
- **Oversized metric numbers** with micro trend deltas (↑ 0.4% vs last month). Numbers carry the weight; labels and trends step back.
- **Right-rail task panel** with per-item progress bars, color-coded urgency.
- **Gradient hero card** in violet for the single highest-priority CTA of the day. Reserve this slot — it loses meaning if every card uses it.
- **User identity tile** bottom-left of the sidebar. Cheap to build, anchors the whole layout.

## What to leave behind from LeadLogic

- The eCommerce / customer / sales taxonomy. Wrong nouns for this tool.
- Donut + area charts as default. Only add charts where they earn their pixels (pipeline trend, task velocity). Skip decorative chartjunk.
- The "Premium Plane" upsell card. We're not selling anything — that slot becomes the day's single priority.

---

## Information architecture

### Sidebar (dark)
- Logo / wordmark (top)
- Sections:
  - **NAVIGATION**
    - Today (default home)
    - Pipeline
    - Projects
    - Quickies
    - Pulse *(working name — see Pulse module below)*
  - **SETTINGS**
    - Notes
    - Settings
- User tile (bottom): avatar, "Chris Gee · Operator"

**No project-specific nav items.** Coursera, Retreat, etc. are project instances and live inside the Projects page. Nav stays evergreen — adding a row to the sidebar should be a once-a-year event, not a once-a-quarter one.

### Canvas (lavender)
Top utility row: search · refresh · theme toggle · export

Then the dashboard, in priority order:

1. **Header** — "Good morning, Chris" + date + a one-line hook (the editorial line that frames the day, refreshed by the morning brief)
2. **Today's Priority** — the gradient hero card, single CTA, single sentence
3. **Metric strip** — 4 oversized cards: Active Projects · Open Tasks · Pipeline Won · This Week's Deadlines (each with trend delta vs. yesterday)
4. **Active Project Status** — list, status pills, last-updated timestamp
5. **Blocked / Slipping** — list, severity pills (red/amber/gray)
6. **Two-column row** — Today's Calendar (left) · Pipeline Recent Wins (right)

### Right rail — split layout (top half Quickies, bottom half Tasks)
The rail is divided 50/50 between two modules. Both are always visible; neither is collapsed.

**Top half — Digital Quickies** (full spec below)
- Show the top 3–4 Quickies + "see all (8)" link to the full Quickies page
- + button at the top of this half
- Done-today counter at the bottom of this half (just above the divider)

**Divider** — soft 0.5px line. Optional micro-label between halves: "TASKS" in caps to anchor the eye.

**Bottom half — Today's Task Focus**
- Top 3–4 tasks from Active Projects, scoped to "due today" or "in-progress today"
- Each task: name, project tag, thin progress bar, urgency pill
- "View all (12)" link at the bottom

**Why split, not stack?** Quickies are relationship work. Tasks are project work. Both deserve constant visibility but in dedicated lanes — mixing them defeats the Post-It mental model.

**Mobile:** Both modules promote to horizontal-scroll card rows. Quickies row first (under priority hero), Tasks row second (between metrics and project status). The split-rail pattern doesn't translate to narrow viewports.

---

## Digital Quickies — the killer module

**The concept:** Chris used to write tiny *relationship-touch* reminders on Post-Its. "Send Maria the AI ethics piece." "Ping Tom — haven't talked in 3 months." "Reply to Jordan's LinkedIn DM." The Post-It worked because it was visible, small, and finishable in 90 seconds.

This module is the digital Post-It wall — but its philosophy is sharper than "tasks for relationships." **Quickies is a relationship pipeline, not a sales pipeline.** It's not driven by deal stage. It's driven by *time + context + warmth.* The goal isn't to convert; it's to stay top-of-mind with the people whose orbit Chris wants to remain in — past clients, current clients, partners, network. Repeat work and referrals come from this surface, not the Pipeline page.

### Relationship Type — every contact is tagged

Five tiers. Tag is set when the contact is added; it shapes suggested cadence, tone, and the Touch Type the system recommends.

- **Active client** — current paying engagement. Goal: deepen via value outside scope of work.
- **Past client** — was paying, currently isn't. Goal: stay warm, signal availability, earn the next engagement or a referral.
- **Partner** — collaborator, vendor, fellow operator. Goal: reciprocal warmth and idea exchange.
- **Network** — broader professional relationships. Goal: don't go cold.
- **Mentor / Champion** — people who shaped Chris's career or actively advocate for him. Goal: thoughtful, periodic gratitude + updates.

### Touch Type — every Quickie has a flavor

Three types. Picked when the Quickie is created. *The act of choosing forces intentionality* — "just a Quickie" defaults to generic "hi" energy; the type sets the right tone.

- **Value drop** — share something useful (Chris's newsletter, video, a relevant article, an intro). Most common type.
- **Check-in** — "thinking of you," no agenda.
- **Ask** — request an intro, advice, or feedback.

### Temperature — relationship state at a glance

Each contact's relationship has a state. Three values, no numeric score (numeric scores feel tacky and CRM-flavored):

- **Warm** — recent meaningful interaction (within the cadence appropriate for their tier)
- **Cooling** — drifting; touch overdue
- **Cold** — real silence; relationship needs reinvestment

Visual: small thermometer-shaped pill or single-color dot on each Quickie card and on the contact list. Triage aid, not a guilt trip — cold contacts are *opportunities*, not failures.

### What a single Quickie shows

- **Who** — contact name + one-line context + Relationship Type tag ("Maria · comms lead @ Tegna · *active client*")
- **Touch Type** — small pill (Value drop · Check-in · Ask)
- **What** — the action in plain English ("send the AI-in-PR article from TIC")
- **Channel** — email · LinkedIn · text · call (icon, not just text)
- **Trigger** — tiny timestamp or reason ("3 mo since last touch" / "she asked last week")
- **Temperature dot** — warm/cooling/cold indicator
- **Action** — one-click complete that ALSO fires the channel (`mailto:` opens drafted email; LinkedIn opens DM in new tab)

### Visual treatment

- Stack of small cards in the right rail, faint background color variation to echo the Post-It feel (soft yellow/pink/blue tints — pastel, not saturated).
- Tappable check-circle on the left of each card → marks done with a satisfying micro-interaction.
- Order: most overdue / coldest at top.
- Limit visible to 5–7 in the rail. "+more" link if more exist. Backlog lives on the full Quickies page.

### Affordances

- Big "+ Add Quickie" button at the top of the rail. Three-field add: contact + Touch Type + one-line action. (Channel + Relationship Type inherit from the contact record.)
- ⌘J shortcut: opens add-Quickie modal from anywhere.
- Bottom of rail: "Done today (4)" — tiny win counter.

### Future intelligence (v2, flagged not built)

- **Auto-suggested Quickies from triggers:**
  - Past client + 90+ days silent → suggest a check-in
  - Active client + 30+ days no value-add (only billable touches) → suggest a value drop
  - Partner mentioned in TIC newsletter or a LinkedIn post → suggest "send them this"
  - Recent meeting with no follow-up → suggest a recap Quickie
  - LinkedIn-surfaced personal milestone (job change, anniversary) → suggest a touch
- **Inline AI-drafted message on click** using context Claude already has about the contact and the Touch Type.

---

## Page-by-page IA

Every page answers one question. If a designer or developer can't recite that question, the page is doing too much.

### Today — *"What needs my attention this morning?"*
The default home. Two persona variants of the same layout — both share the *priority hero → metrics → focused work → calendar* spine, but each variant's content is tuned to its persona's daily question.

**Operator variant (Chris):** the page specified throughout this brief — priority hero · 4 metrics (Active Projects · Open Tasks · Pipeline Won · This Week's Deadlines) · Active Project Status · Blocked/Slipping · Calendar/Wins two-column · split rail (Quickies on top, Tasks on bottom).

**Collaborator variant (Sharisse):** same structural skeleton, different content:
- **Priority hero** — *"How can I help today?"* card surfacing the single most-leveraged thing Chris needs from her (e.g. "Newsletter draft due Saturday — needs final pass"). Operator-set or auto-derived from the highest-priority unblocked task.
- **Metrics (4):** Tasks assigned to me · Waiting on Chris · Done this week · TIC newsletter status (days until send)
- **Today's tasks** — what's assigned to her, due today, with project tags
- **Waiting on Chris** — things she can't move forward until he responds (this is the analog to his "Blocked/Slipping" — except the blocker is *him*, surfaced gently)
- **Pulse cues to review** — drafts Chris saved that he wants her eyes on (post-v1 collab feature; design the slot)
- **Calendar** — her view of overlap with Chris + her own appointments
- **Right rail (single panel, not split):** "Quickies suggested for Chris" — Chris's relationship work isn't shared, but Sharisse can spot moments and *suggest* them ("3 mo since the Tegna check-in — flag it?"). One-click accepted suggestions become real Quickies in his queue. This is how she helps him stay on top of relationships without seeing the relationship data itself.

The Collaborator variant is sketched here — full detail and final IA come post-v1, after Chris has a few weeks in the dashboard alone. Designer should reserve the slot, design one frame for it, and not over-spec.

### Pipeline — *"Where's the money?"*
Pulls **directly from HubSpot** for active deals, lifecycle-staged leads, closed-won/lost history, and activity timestamps. No Asana intermediary — the Command Center *replaces* Asana for daily operating use; HubSpot is the source of truth for revenue-side data. Single-operator revenue view, not a sales-team CRM clone.

**Visual reference:** Chris shared a *Founder's Vision* dashboard mockup that captures the right spatial energy for this page — generous white metric cards in a top grid, a charts row underneath, and a focused list section at the bottom. Designer should adopt that broad structure (metric grid → charts → focused list) but with the modules below, not the mockup's nav taxonomy.

**Layout:**

**1. Metric grid (top).** Six cards, two rows of three on desktop, 2x3 on tablet, stacked on mobile. Each card: label (small caps), big value, one-line caption with trend delta or context.
- Pipeline value (open)
- Won this quarter
- Win rate (%)
- Avg cycle time (days)
- 90-day forecast (probability-weighted)
- Active deals count

**2. Charts row.** Two cards, side-by-side on desktop, stacked on mobile. Functional, not decorative.
- **Monthly revenue by channel** — line chart, three lines: Consulting · Speaking · Digital. Last 12 months.
- **Projected revenue by service type** — small horizontal bar chart of weighted-pipeline value broken out by service line (advisory, retainer, workshop, course, etc.).

**3. Stuck deals callout.** Red-tinted card. *"N deals untouched 30+ days."* Click to filter active deals. *Highest-leverage thing on this page — pipelines die from inattention, not lost deals.*

**4. Active deals table.** client · stage · value · next action · last touched · owner. Sortable by value or last-touched. Inline action: "log touch" updates last-touched timestamp. "+ Add deal" affordance top-right of this section.

**5. Leads to Nurture (replaces what the reference mockup shows as "Digital Funnel Conversion Path").** This is the bottom-of-page focal section.

- **What it is:** upstream of active deals — people who could become deals but aren't committed yet. New inbound (referral, website, conference, content reply), warm intros, slow burns. Pulled directly from **HubSpot contacts in the *Lead* or *MQL* lifecycle stage** (the leads HubSpot already knows about, surfaced where Chris will actually work them). The Command Center is the home for working this list; HubSpot is the source of truth.

- **Sort:** newest first. Fresh inbound rises to the top so it doesn't go cold while older leads keep their place. *(A secondary toggle lets Chris re-sort by oldest, by value estimate, or by next-action-due.)*

- **Each row shows:**
  - Name + source ("Maria Chen · referred by Sharisse, May 8")
  - Status pill: New · Engaged · Warm · Cooling · Cold
  - Estimated value (if known) + service line tag
  - Last touched timestamp
  - Next action (one-line plain English, editable inline)
  - Quick-action buttons:
    - **Touch** — opens a Quickie pre-filled with the lead's name and the next action
    - **Graduate** — promotes to active deal (creates a HubSpot deal record + removes from nurture list)
    - **Cool off** — archives; optionally creates a Quickie for periodic warmth

- **Empty state:** if no leads in nurture, show a soft prompt: *"No leads yet. Add one or wait for inbound — your TIC newsletter and LinkedIn presence are doing the work."*

- **+ Add lead** affordance at the section header. Two-field add: name + source. Status defaults to *New*; everything else fillable later.

**6. Recent wins (last 90 days).** Small list with amount + close date + service line.

**7. Recent losses (last 90 days).** Same shape, with a one-line "what happened" field. Losses live here for learning, not for shame; treat them visually muted, not red.

**Empty state:** if HubSpot isn't connected, show a card prompting connection with a one-click hand-off. Both active deals AND Lead Nurture depend on HubSpot — without it, the Pipeline page is empty.

**Note on Lead Nurture vs Quickies — please don't conflate them:**
- **Leads** are people who could become *deals.* Goal: convert. They live in Pipeline.
- **Quickies** are people *already* in Chris's orbit (past clients, partners, mentors, network). Goal: stay warm regardless of conversion. They live in Quickies.
- The two surfaces talk to each other in two places only: a lead can graduate *out* of Lead Nurture into either an active deal (Pipeline) OR a relationship Quickie (if cooled off but worth keeping warm), and a Quickie's "send to a contact" action can pull from either pool.

### Projects — *"What's in flight, what's stuck?"*
**Native to the Command Center.** Projects and their tasks live in the dashboard's own data layer, not in Asana — the Command Center is replacing Asana for this kind of work. For v1, project data is static in `lib/data.ts` (designer builds against the static shape; persistence comes in v2). The home for rotating client work — Coursera, Retreat, retainers, one-off engagements.

**Layout:**
- **Header strip (4 metrics):** Active · On hold · Closed this quarter · Avg time-to-ship.
- **Filter chips** (sticky): All · Active · At risk · On hold · Done. Plus a group-by toggle: by client / by status / by deadline.
- **Project card grid** — 2 or 3 columns depending on viewport. Each card shows:
  - Project name + client tag
  - Deadline + days remaining (red if overdue, amber if <7 days)
  - % complete (small progress bar)
  - Open task count + blocker count
  - Last activity timestamp
  - Health pill: healthy · at risk · stuck · stale
  - Click → project detail view (designer should slot this; full implementation is post-v1)
- **+ New project** affordance. v1: opens a basic form. v2: project templates (Retreat template, Coursera template).

**Why no per-project sidebar entry:** project-specific nav items go stale fast. The Projects page IS the index. Pinning a project to the top of the page is a v2 affordance if Chris finds himself opening one project repeatedly.

### Pulse — *"What's happening in my world, and what should I say about it?"*
The voice machine. Chris's job is partly to have a take — daily on LinkedIn, weekly in TIC (The Intersection of Comms newsletter). This module collapses "find the story" and "draft the post" into one surface.

**The unit:** a *Pulse card* — one news story at the intersection of AI + Communications/PR, plus a draft LinkedIn post in Chris's voice. Five cards refreshed daily.

**One Pulse card contains:**
- **Story header:** headline · source publication · timestamp · 1-line "why it matters" tag
- **Summary:** 2–3 sentence editorial summary (not a copy-paste of the article — distilled)
- **Source link:** opens article in new tab
- **Stance label:** small pill, top-right of the card. One of:
  - `standard` — the obvious take, advances the conventional wisdom
  - `contrarian` — pushes back on the conventional wisdom, takes the opposite angle
  - `(roughly 1 in 4 cards drawn each day is contrarian — see logic below)*`
- **Draft LinkedIn post:** Chris's voice, generated from the story + stance. ~150–250 words. Ready to ship.
- **Action row:**
  - **Save as cue** *(primary, default)* — moves the draft into the Pulse page's **Saved Cues** section (in-dashboard, editable). The draft is *not* published, *not* queued, and *not* sent to Buffer yet. It just gets parked where Chris can return and manicure it. *(Chris's term: "cue" — a prompt to act, borrowed from production/stage language. Buffer calls these "Ideas" internally, but Pulse uses the more action-oriented term.)*
  - **Regenerate** — re-runs the draft with the same story + stance
  - **Flip stance** — re-runs with the opposite stance (standard ⇄ contrarian)
  - **Send to a contact** — picks a contact, creates a Quickie pre-filled with "thought of you when I read this — [story link + Chris's take]." This is the **Pulse↔Quickies loop**: content engine and relationship engine talking to each other. Your LinkedIn post becomes the artifact you share with five specific humans, not just broadcast.
  - **Copy** — copies draft to clipboard (escape hatch)
  - **Dismiss** — removes from today's set; the slot fills with the next-best story

### The cue → manicure → ship workflow

This is the heart of how Pulse actually gets used. *Generation is cheap; voice is precious.* Every draft Pulse generates is a starting point, not a final product. Chris's edits are what make it his.

1. **Daily refresh** generates 5 Pulse cards.
2. **Save the keepers** — Chris hits Save as cue on the cards he wants to ship. Saved cues persist; dismissed ones disappear.
3. **Manicure** — on the Pulse page, the **Saved Cues** section is fully editable. Click any cue to enter edit mode: rewrite, trim, sharpen, change the hook. Each cue keeps a history of edits so Chris can revert if a tweak went sideways.
4. **Ship when ready** — once a cue feels right, Chris hits one of two actions on it:
   - **Queue** — sends to Buffer's queue (via `Buffer · Add to Queue`) for scheduled publishing
   - **Post now** — sends immediately (same action, flagged for instant publish; confirmation modal because irreversible)

### Saved Cues section (on the Pulse page)

Lives directly under the day's 5 fresh cards. Always visible. Doesn't auto-refresh with the daily pull — these are persistent until shipped or deleted.

- Each saved cue shows: original story headline, current draft preview (first 2 lines), stance pill, last-edited timestamp
- Click → expands into the editor (markdown editing, live preview, regenerate, flip stance, queue, post now, delete)
- Counter at the section header: *"Saved cues (4)"*
- Auto-archive after 14 days unpublished — a gentle "use it or lose it" pressure that prevents draft graveyards

### Buffer integration architecture (locked)

Pulse routes through Chris's connected Zapier MCP, which exposes three Buffer actions:
- `Buffer · Add to Queue` — queue or immediate-post to any connected Buffer channel (called when Chris promotes a saved cue with Queue or Post now)
- `Buffer · Create Idea` — saves to Buffer's Ideas inbox (optional secondary sync; if enabled in Settings, *Save as cue* writes both locally and to Buffer Ideas as a backup)
- `Buffer · Pause Queue` — pauses the queue (vacation / heads-down mode; surfaced as a Settings toggle, not a Pulse-card button)

The dashboard calls these via MCP. No webhook URL to manage. No LinkedIn deep-link gymnastics. The "Post now" button on a Saved Cue is real one-click publishing.

**Contrarian mix-in logic:**
- Each daily refresh tags 1 in 4 cards as `contrarian` (so usually 1 of 5, sometimes 2).
- The selection is random *but biased toward stories where there is a clear conventional consensus* — those are the highest-leverage contrarian takes.
- The contrarian draft uses the same voice as standard but starts with disagreement: "Everyone says X. They're wrong because Y."
- A "Flip stance" button on every card lets Chris see both takes for any story regardless of the random label.

**Two surfaces — module + page:**

**1. Today page module ("today's pulse"):**
- A single hero Pulse card on the Today canvas, between metrics and Active Project Status.
- Shows the *one* story the system thinks Chris should weigh in on first today.
- Compact: headline, summary, draft (collapsible), one-line action row.
- "See all 5 in Pulse →" link to the full page.

**2. Pulse page (full):**
- Header strip: Stories today (5) · Posts shipped this week · Posts shipped this month · Avg engagement (v2 metric)
- "Refresh now" button — manual override on top of the daily auto-pull
- Filter chips: All · Standard · Contrarian · Saved drafts · Posted
- Card stack — the 5 stories + drafts for today, vertical scroll, expandable cards
- "Saved drafts" section below the day's set — drafts Chris started editing but didn't post; they don't expire with the daily refresh
- Archive: "47 posts shipped from Pulse in the last 30 days" — collapsed dopamine receipt

**Connecting to existing capability:**
- The TIC newsletter skill (`anthropic-skills:tic-newsletter`) already does the AI+Comms news pull. Pulse can lean on that pipeline daily instead of weekly.
- The li-posts skill (`anthropic-skills:li-posts`) already writes in Chris's voice. Pulse pipes the news summary + stance into li-posts to generate drafts.
- Designer doesn't need to wire these — but the data shape in `lib/data.ts` should be designed to *receive* them when v2 hooks them up.

**Static v1 data shape (what designer should build against):**
```
type PulseCard = {
  id: string
  headline: string
  source: string
  publishedAt: ISODate
  whyItMatters: string         // 1-line tag
  summary: string              // 2-3 sentences
  sourceUrl: string
  stance: "standard" | "contrarian"
  draft: string                // markdown, ~150-250 words
  status: "fresh" | "saved" | "posted" | "dismissed"
}
```

**What Pulse is NOT:**
- A full content calendar (that's a separate tool if Chris ever wants one)
- An engagement analytics dashboard (v2 may surface basic numbers; not the focus)
- A general news reader (it's narrow on purpose: AI + Comms, with a draft attached)

**Future intelligence (v2):**
- Scheduling: "post this at 9 AM tomorrow" via a write integration
- A/B variants: generate two drafts per story (different angles), let Chris pick
- "Why this story?" hover-tooltip explaining why it surfaced today (recency, relevance score, contrarian potential)
- Engagement loop: posts shipped from Pulse get tracked; their engagement feeds back into "voice that worked" so future drafts mimic top performers
- Carousel/thread variants for stories that warrant more than 250 words

### Quickies — *"Who am I owing a touch?"*
The full page is a triage view of the Quickies that didn't fit in the right rail, plus the relationship-health overview.

**Layout:**
- **Header strip (4 metrics):**
  - Open Quickies
  - Done this week
  - **Value debt** — *"3 of 5 active clients haven't received a value-drop in 30 days"* (the most powerful number on this page — calls out the gap between billing and giving)
  - Contacts gone cold (90+ days silent)
- **Filter chips:** All · Due today · This week · By Touch Type (Value drop · Check-in · Ask) · By Relationship Type (Active · Past · Partner · Network · Mentor) · By temperature (Warm · Cooling · Cold) · By channel · By contact
- **Pinned column** — Quickies marked starred float to the top regardless of trigger date.
- **Suggested Quickies** (v2 placeholder card): "5 contacts you haven't touched in 90+ days" — designer should design the slot now even if the auto-suggestion engine is post-v1.
- **Done archive** — collapsed, expandable: "47 done in the last 30 days." Dopamine receipt.

**Relationship overview (sub-section on the page):** small grid showing each Relationship Type with counts in each temperature bucket. *Active clients: 5 warm · 1 cooling · 0 cold.* Tells Chris at a glance where the cold spots are.

### Notes — *"What was I thinking?"*
A lightweight contextual scratchpad for thoughts that *connect to the rest of the dashboard*. Not Apple Notes. Not Notion. Not a document manager. The dashboard's value comes from connecting *people, projects, and time* — Notes earns its place by feeding into that web, not standing apart from it.

**Mental model:** every note is *about* something already in the dashboard. A note about the Teal retreat lives next to the Teal retreat project. A note about a conversation with Maria appears when Maria's Quickie surfaces. A note unlinked to anything is a smell, not an error — the UI gently surfaces it.

**Layout — two columns:**
- **Left (30%):** filter strip + note list. Each row: first line (auto-title), 1-line preview, last-edited timestamp, link chips (1–3 icons indicating what it's linked to).
- **Right (70%):** viewer/editor. Markdown rendering. Top of the editor pane shows the link chips as editable buttons (click to add/remove a project, contact, or event link).

**Quick-capture bar — always visible at the top of the page:**
- Single text input. Hit Enter to save.
- After save: note appears in the list, focus moves to the link-chip selector for one-tap tagging.
- ⌘N (or `/note` in any other page's command palette) creates a new note from anywhere in the app.

**Filters (left strip):**
- Today
- This week
- Pinned
- By project (sub-list of active projects)
- By contact (sub-list of recent contacts)
- Untagged ← *surface this prominently. Untagged notes are the productivity hint without nagging.*
- Archive (auto-archives after 30 days unless pinned)

**Bidirectional linking:**
- A note linked to the *Teal retreat* project shows up as a small chip on that project's detail card and on the Project page entry.
- A note linked to a *contact* (e.g., Maria) shows up as a chip on that contact's Quickie card.
- A note linked to a *calendar event* shows up under the event in Today's calendar widget — useful for pre-meeting prep that wants to be there at 1:55 PM, not buried.

**Editor:**
- Markdown. Live preview optional toggle (default = simple inline rendering).
- Slash commands: `/project`, `/contact`, `/event`, `/today` to insert links inline as well as adding them as chips.
- Pin button.
- Delete (with undo toast — never a permanent destructive action without recovery).

**Search:** keyboard-first (⌘K opens global search across notes + everything else; ⌘F when on the Notes page scopes to notes only).

**What Notes is NOT (designer, please resist):**
- A folder hierarchy
- Nested tags
- Rich-text styling toolbars
- Attachments / file storage
- Wikilinks / [[backlink]] syntax (the link chips do the same job with less ceremony)
- Real-time collaboration

**Future intelligence (v2, flag the slot):**
- AI auto-link suggestions: when a note mentions a project name or contact name, surface a "link this to X?" chip suggestion.
- Auto-summarize: a project's linked notes can be one-click summarized into "what's the latest on this project?" briefing.

### Settings — *"How is this configured?"*
Standard settings, but specifically scoped to a single-operator dashboard.

**Sections (Operator view):**
- **Profile** — name, email, avatar
- **Team** — invite collaborators (Sharisse, future hires) by email; magic-link invitation. For each member: role (Operator · Collaborator · Viewer), what they can see by default, last active timestamp, remove access.
- **Display** — theme (light · dark · auto), density (compact · comfortable), time zone
- **Morning briefing** — refresh time (default 7:00 AM), what to include checkboxes (Pipeline · Projects · Quickies · Calendar), weekend on/off
- **Goals** — quarterly revenue goal (drives the Pipeline sparkline), open-Quickies threshold (alerts when backlog exceeds N)
- **Connectors** — list of connected MCPs the Command Center actively uses: HubSpot (Pipeline + Lead Nurture + Quickies contacts), Outlook (calendar + email triage), Zapier→Buffer (Pulse posting), Slack (optional notifications). Each shows status indicator (green dot = healthy, amber = stale, red = error), last sync timestamp, "reconnect" affordance. *Note: Asana is intentionally NOT in the connector list — the Command Center replaces it for project work.*

**Sections (Collaborator view):**
- **Profile** — name, email, avatar (own only)
- **Display** — theme, density, time zone (own only)
- **Notifications** — when to ping me about new task assignments, blockers, etc.

Collaborators don't see Team management, Goals, Connectors, or Pulse/Buffer settings.
- **Pulse / Buffer** — dedicated sub-section for content automation:
  - Buffer channel selector (which channel(s) Pulse posts route to when promoted — LinkedIn personal, LinkedIn page, etc.)
  - Mirror saved cues to Buffer Ideas inbox (toggle): if on, every *Save as cue* also writes to Buffer's Ideas inbox via `Buffer · Create Idea` as a backup
  - Saved cue auto-archive window (default 14 days)
  - Pause queue toggle (calls `Buffer · Pause Queue` — vacation / heads-down mode)
  - Confirmation modal preference: always for Post now · never · only for contrarian posts
- **Data** — export full dashboard state as JSON, reset to defaults
- **About** — version, last deploy timestamp, link to changelog
- **Danger zone** — sign out, archive all done Quickies, etc.

**Out of scope for Settings v1:** managing AUTH_USER / AUTH_PASS — those are env vars in Vercel and shouldn't be exposed in-app. Link out to Vercel project settings instead.

---

## Color system

Build it from these primitives. Pick exact hex values that feel right; don't ship Tailwind defaults.

- **Sidebar:** deep charcoal (#0E1116-ish), subtle radial gradient toward warmer black at top
- **Canvas:** soft lavender (#F2F0FA-ish), not Tailwind purple-50
- **Card surface:** pure white, 8px radius, 1px gray-100 ring (not heavy shadows)
- **Accent — primary action:** lime-green (#C7F03B-ish). Sidebar active state, primary CTA only.
- **Accent — hero / priority:** violet gradient (#7C5CFF → #B89BFF). Used once per page on the priority card.
- **Status pills:**
  - Healthy/Done: emerald
  - At risk: amber
  - Blocked/Overdue: rose
  - Stale: gray
- **Trend deltas:** emerald-600 for ↑, rose-500 for ↓, gray-500 for flat

---

## Typography

- **Sans:** Inter or Geist Sans (Vercel-native). Tabular figures for all numbers — non-negotiable for a dashboard.
- **Display weight:** 600 for metric numbers (semibold, not bold)
- **Body:** 400, with 500 reserved for project/task names
- **Sidebar nav:** 500, all-caps for section labels with letter-spacing
- **Numbers:** allow up to ~36px on metric cards on desktop; scale down on mobile

---

## Interaction notes

- **Hover states** matter — every card should subtly lift on hover. Communicates this is a tool, not a poster.
- **Refresh button** on the metric strip — even with static data, the affordance signals "this updates."
- **Click into a project** opens a focused view (future state — design the slot, don't build all the views yet).
- **Keyboard:** ⌘K opens search/jump (LeadLogic pattern, ported). ⌘J opens add-Quickie modal.
- **Dark mode:** ship a v1 light theme first, but design the dark variant in parallel — Chris does evening reviews, and the lavender canvas should invert to a near-black with desaturated violet accents.

---

## Mobile

This dashboard gets opened on the phone every morning. Don't punt the mobile design.

- Sidebar collapses to a hamburger
- Metric strip becomes a 2x2 grid
- Two-column row stacks
- Right-rail: split rail doesn't translate; promote both modules to horizontal-scroll card rows in main flow (Quickies first, then Tasks)

The "morning coffee" use case is often *"I'm walking the dog and want to see what fires today."* Optimize for that.

---

## What "done" looks like for v1

- All six pages designed at desktop and mobile, light theme, with the LeadLogic-inspired sidebar (Today fully built; Pipeline, Projects, Quickies, Notes, Settings designed and slotted — full data wiring is post-v1)
- A documented design tokens file (colors, type, spacing, radii) so future expansion stays consistent
- One Figma frame (or component sketch) per page

## What's explicitly out of scope for v1

- Animations beyond the hover-lift micro-interaction *(exception: Digital Quickies completion micro-interaction — that's load-bearing for the dopamine loop)*
- Multi-user / sharing / commenting
- Real-time data (still static via `lib/data.ts`)
- Auto-suggested Quickies from connectors (v2)
- Project detail views (slot designed, contents post-v1)
- Project templates (v2)

## What's now in scope (was previously out)

- **Charts** — the Pipeline page now has two functional charts (monthly revenue by channel, projected revenue by service type). Sparklines elsewhere stay optional. No decorative chartjunk on Today.

---

## Data architecture — important context

**v1 (the design pass):** all data is static, hand-curated in `lib/data.ts`. Designer builds against the typed shape there. No live API calls, no auth flows. This keeps designer focused on visuals and IA, not plumbing.

**v2 (post-design, when wiring goes live):**

- **Backend: Supabase (already provisioned).** Project name *CGC Command Center Database*, free tier, US-West (Oregon), nano compute. Confirmed as the v2 backend because the dashboard is multi-user (Chris + Sharisse, with room for more) — and Supabase brings three things Vercel KV can't:
  - **Auth** (magic-link email sign-in, no passwords to manage; replaces the v1 Basic Auth middleware)
  - **Row Level Security** — SQL-level rules enforce *"Sharisse can only see tasks assigned to her,"* at the database, not in app code
  - **Real-time subscriptions** — Chris assigns Sharisse a task and her view updates without a refresh
- **HubSpot** is the source of truth for: active deals, leads in nurture, closed-won/lost history, contacts (across all relationship types).
- **Outlook** sources calendar events and email triage state.
- **Zapier→Buffer** handles Pulse posting (queue, post-now, save-as-cue mirror).
- **Asana is deliberately NOT a source.** The Command Center replaces Asana for daily project/task work.
- **Project + task data, Quickies, Pulse cues, and Sharisse's task assignments all live in Supabase** — owned by the Command Center, not federated to external SaaS. This is what makes the dashboard a *system of record*, not a viewer.

The shift from "viewer" to "system of record" — combined with multi-user — is what makes this *Chris's operating system*, not just another dashboard. The designer doesn't build the persistence or auth layer — but the IA assumes both ownership and multi-user from day one.

---

## How to deliver

1. A pull request against the `cg-command-center` GitHub repo with the redesigned components
2. A `DESIGN_TOKENS.md` documenting the system
3. A short Loom (or written walk-through) explaining the choices, especially anywhere you deviated from this brief

---

## Notes from Chris

- I prefer **conversational, thought-provoking, scannable** over corporate clean. The dashboard should have a tiny bit of personality (hook line, gradient hero card, lime accent) — not a sea of beige.
- Real-world analogy: **think operations control room with design taste**. A control room, not a billing portal.
- I want to feel like a **calm operator** when I open this — not an inbox-zero crusader.
- If you're choosing between "more information" and "more clarity," choose clarity. Always.
