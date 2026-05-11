# Design Brief — CG Command Center

**For:** Claude Design
**From:** Chris Gee
**Reference inspiration:** LeadLogic dashboard (attached separately)
**Current state:** Functional Next.js + Tailwind app at `/cg-command-center`. Layout works; visuals need a level-up.

---

## The product in one line

A personal morning command center Chris reviews with coffee — at-a-glance answers to *"what fires today, what's at risk, what closed, what's next."* No dashboard fatigue. No demo-data energy. Real signal, scannable in 30 seconds.

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

**The concept:** Chris used to write tiny relationship-touch reminders on Post-Its. "Send Maria the AI ethics piece." "Ping Tom — haven't talked in 3 months." "Reply to Jordan's LinkedIn DM." The Post-It worked because it was visible, small, and finishable in 90 seconds.

This module is the digital Post-It wall. It's not tasks — tasks belong to projects. Quickies belong to **relationships**. They're how Chris stays in front of clients, leads, and partners without a CRM-flavored chore.

**What a single Quickie shows:**
- WHO: contact name + one-line context ("Maria, comms lead @ Tegna")
- WHAT: the action in plain English ("send the AI-in-PR article from TIC")
- CHANNEL: email · LinkedIn · text · call (icon, not just text)
- TRIGGER: tiny timestamp or reason ("3 mo since last touch" / "she asked for it last week")
- ACTION: one-click complete that ALSO fires the channel (`mailto:` opens drafted email; LinkedIn opens DM in new tab)

**Visual treatment:**
- Stack of small cards in the right rail, faint background color variation to echo the Post-It feel (soft yellow/pink/blue tints — pastel, not saturated).
- Tappable check-circle on the left of each card → marks done with a satisfying micro-interaction.
- Order: most overdue / time-sensitive at top.
- Limit visible to 5–7. "+more" link if more exist. Don't let it become a backlog.

**Affordances:**
- Big "+ Add Quickie" button at the top of the rail. Two-field add: contact + one-line action.
- ⌘J shortcut: opens add-Quickie modal from anywhere.
- Bottom of rail: "Done today (4)" — tiny win counter.

**Future intelligence (v2, flagged not built):**
- Auto-suggest Quickies from connected sources: 90+ day silent contacts, unanswered LinkedIn DMs, post-meeting follow-ups.
- Inline AI-drafted message on click using context Claude already has.

---

## Page-by-page IA

Every page answers one question. If a designer or developer can't recite that question, the page is doing too much.

### Today — *"What needs my attention this morning?"*
The default home. Specified above (priority hero · metrics · projects · blocked · calendar · wins · split rail). This is the page Chris reviews with coffee.

### Pipeline — *"Where's the money?"*
Pulls from HubSpot. Single-operator revenue view, not a sales-team CRM clone.

**Layout:**
- **Header strip (4 metrics):** Open pipeline value · Won this quarter · Win rate (%) · Avg cycle time (days). Each with quarter-over-quarter trend delta.
- **Stuck deals callout** — red-tinted card at top: "N deals untouched 30+ days." Click to filter the list. *This is the highest-leverage thing on the page; pipelines die from inattention, not lost deals.*
- **Active deals table:** client · stage · value · next action · last touched · owner. Sortable by value or last-touched. Inline action: "log touch" updates last-touched timestamp.
- **Recent wins (last 90 days)** — small list with amount + close date.
- **Recent losses (last 90 days)** — same shape, with a one-line "what happened" field. Losses live here for learning, not for shame; treat them visually muted, not red.
- **Quarterly progress** — sparkline: $ booked vs $ goal. Goal is set in Settings.
- **+ Add deal** affordance, top-right.

**Empty state:** if HubSpot isn't connected, show a card prompting connection with a one-click hand-off.

### Projects — *"What's in flight, what's stuck?"*
Pulls from Asana. The home for rotating client work — Coursera, Retreat, retainers, one-off engagements.

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

### Quickies — *"Who am I owing a touch?"*
The full page is a triage view of the Quickies that didn't fit in the right rail.

**Layout:**
- **Header strip (3 metrics):** Open Quickies · Done this week · Contacts gone silent (90+ days)
- **Filter chips:** All · Due today · This week · By channel (email · LinkedIn · text · call) · By contact
- **Pinned column** — Quickies marked starred float to the top regardless of trigger date.
- **Suggested Quickies** (v2 placeholder card): "5 contacts you haven't touched in 90+ days" — designer should design the slot now even if the auto-suggestion engine is post-v1.
- **Done archive** — collapsed, expandable: "47 done in the last 30 days." Dopamine receipt.

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

**Sections:**
- **Profile** — name, email, avatar
- **Display** — theme (light · dark · auto), density (compact · comfortable), time zone
- **Morning briefing** — refresh time (default 7:00 AM), what to include checkboxes (Pipeline · Projects · Quickies · Calendar), weekend on/off
- **Goals** — quarterly revenue goal (drives the Pipeline sparkline), open-Quickies threshold (alerts when backlog exceeds N)
- **Connectors** — list of connected MCPs (Asana, HubSpot, Outlook, Slack, etc.) with status indicator (green dot = healthy, amber = stale, red = error), last sync timestamp, "reconnect" affordance
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

- Charts (other than maybe one sparkline on the Pipeline metric)
- Animations beyond the hover-lift micro-interaction *(exception: Digital Quickies completion micro-interaction — that's load-bearing for the dopamine loop)*
- Multi-user / sharing / commenting
- Real-time data (still static via `lib/data.ts`)
- Auto-suggested Quickies from connectors (v2)
- Project detail views (slot designed, contents post-v1)
- Project templates (v2)

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
