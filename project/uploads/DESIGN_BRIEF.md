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
- **Right-rail task panel** with per-item progress bars, color-coded urgency (red for due today, soft for later). This is the daily punch-list.
- **Gradient hero card** in violet for the single highest-priority CTA of the day. Reserve this slot — it loses meaning if every card uses it.
- **User identity tile** bottom-left of the sidebar. Cheap to build, anchors the whole layout.

## What to leave behind from LeadLogic

- The eCommerce / customer / sales taxonomy. Wrong nouns for this tool.
- Donut + area charts as default. Only add charts where they earn their pixels (pipeline trend over time, task velocity). Skip decorative chartjunk.
- The "Premium Plane" upsell card. We're not selling anything — that slot becomes the day's single priority.

---

## Information architecture

### Sidebar (dark)
- Logo / wordmark (top)
- Sections:
  - **NAVIGATION**
    - Today (default)
    - Pipeline
    - Projects
    - Coursera
    - Retreat (contextual — surfaces when within 14 days of a retreat)
  - **SETTINGS**
    - Notes
    - Settings
- User tile (bottom): avatar, "Chris Gee · Operator"

### Canvas (lavender)
Top utility row: search · refresh · theme toggle · export

Then the dashboard, in priority order:

1. **Header** — "Good morning, Chris" + date + a one-line hook (the editorial line that frames the day, refreshed by the morning brief)
2. **Today's Priority** — the gradient hero card, single CTA, single sentence
3. **Metric strip** — 4 oversized cards: Active Projects · Open Tasks · Pipeline Won · This Week's Deadlines (each with trend delta vs. yesterday)
4. **Active Project Status** — list, status pills, last-updated timestamp
5. **Blocked / Slipping** — list, severity pills (red/amber/gray)
6. **Two-column row** — Today's Calendar (left) · Pipeline Recent Wins (right)

### Right rail — Digital Quickies (this is the killer module)
**The concept:** Chris used to write tiny relationship-touch reminders on Post-Its. "Send Maria the AI ethics piece." "Ping Tom — haven't talked in 3 months." "Reply to Jordan's LinkedIn DM." The Post-It worked because it was visible, small, and finishable in 90 seconds.

This module is the digital Post-It wall. It's not tasks — tasks belong to projects. Quickies belong to **relationships**. They're how Chris stays in front of clients, leads, and partners without a CRM-flavored chore.

**What a single Quickie shows:**
- WHO: contact name + one-line context ("Maria, comms lead @ Tegna")
- WHAT: the action in plain English ("send the AI-in-PR article from TIC")
- CHANNEL: email · LinkedIn · text · call (icon, not just text)
- TRIGGER: tiny timestamp or reason ("3 mo since last touch" / "she asked for it last week")
- ACTION: one-click complete that ALSO fires the channel (`mailto:` opens drafted email; LinkedIn opens DM in new tab)

**Visual treatment:**
- Stack of small cards in the right rail, faint background color variation to echo the Post-It feel (soft yellow/pink/blue tints — pastel, not saturated). One ramp would feel sterile; multiple ramps without saturation feel handmade.
- Tappable check-circle on the left of each card → marks done with a satisfying micro-interaction (subtle confetti or just a strikethrough + slide-out)
- Order: most overdue / time-sensitive at top
- Limit visible to 5–7. "+3 more" link if more exist. Don't let it become a backlog.

**Affordances:**
- Big "+ Add Quickie" button at the top of the rail. Two-field add: contact + one-line action. That's it. Channel + trigger are optional/inferable.
- ⌘J shortcut: opens add-Quickie modal from anywhere
- Bottom of rail: "Done today (4)" — tiny win counter, collapsed by default. The dopamine of seeing the day's completions matters.

**Future intelligence (for v2, flag in brief):**
- Auto-suggest Quickies from connected sources: people Chris hasn't emailed in 90+ days who used to be regular contacts; LinkedIn comments unanswered for >7 days; CRM contacts with no activity since a key trigger event.
- Inline AI-drafted message on click ("write the email" button) using context Claude already has.

**On mobile:**
- Quickies are the ONLY right-rail content that earns a spot above the fold. Promote them to a horizontal-scroll card row directly under the priority hero — between hero and the metric strip. They're walking-the-dog-friendly: each one is a swipe + tap.

### Right rail — split layout (top half Quickies, bottom half Tasks)
The rail is divided 50/50 between two modules. Both are always visible; neither is collapsed.

**Top half — Digital Quickies** (spec above)
- Show the top 3–4 Quickies + "see all (8)" link to the full Quickies page
- + button at the top of this half
- Done-today counter at the bottom of this half (just above the divider)

**Divider** — soft 0.5px line, slight margin above and below. Optional micro-label between the two halves: "TASKS" in caps to anchor the eye.

**Bottom half — Today's Task Focus**
- Top 3–4 tasks from Active Projects, scoped to "due today" or "in-progress today"
- Each task: name, project tag (small), thin progress bar, urgency pill
- "View all (12)" link at the bottom to the full task list
- This is NOT a backlog — keep it limited to today's focus, max 4 visible

**Why split, not stack?** Quickies are relationship work. Tasks are project work. Both deserve constant visibility but in dedicated lanes — mixing them defeats the Post-It mental model and makes Quickies feel like just-another-todo.

**Mobile:** Both modules promote to horizontal-scroll card rows. Quickies row first (under priority hero), Tasks row second (between metrics and project status). The split-rail pattern doesn't translate to narrow viewports.

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
- **Display weight:** 600 for metric numbers (semibold, not bold — bold reads aggressive)
- **Body:** 400, with 500 reserved for project/task names
- **Sidebar nav:** 500, all-caps for section labels with letter-spacing
- **Numbers:** allow up to ~36px on metric cards on desktop; scale down on mobile

---

## Interaction notes

- **Hover states** matter — every card should subtly lift (1px translate-y, soft shadow gain) on hover. Communicates this is a tool, not a poster.
- **Refresh button** on the metric strip — even though data is currently static, the affordance signals "this updates."
- **Click into a project** opens a focused view (future state — design the slot, don't build all the views yet).
- **Keyboard:** ⌘K opens search/jump (LeadLogic pattern, ported).
- **Dark mode:** ship a v1 light theme first, but design the dark variant in parallel — Chris does evening reviews, and the lavender canvas should invert to a near-black with desaturated violet accents.

---

## Mobile

This dashboard gets opened on the phone every morning. Don't punt the mobile design.

- Sidebar collapses to a hamburger
- Metric strip becomes a 2x2 grid
- Two-column row stacks
- Right-rail task panel: skip on mobile, tasks promote into the main flow

The "morning coffee" use case is often *"I'm walking the dog and want to see what fires today."* Optimize for that.

---

## What "done" looks like for v1

- The page on desktop and mobile, light theme, with the LeadLogic-inspired sidebar
- A documented design tokens file (colors, type, spacing, radii) so future expansion stays consistent
- One Figma frame (or component sketch) per future page slot: Pipeline, Projects, Coursera, Retreat

## What's explicitly out of scope for v1

- Charts (other than maybe one sparkline on the pipeline metric)
- Animations beyond the hover-lift micro-interaction *(exception: Digital Quickies completion micro-interaction — that's load-bearing for the dopamine loop)*
- Multi-user / sharing / commenting
- Real-time data (still static via `lib/data.ts`)
- Auto-suggested Quickies from connectors (v2)

---

## How to deliver

1. A pull request against the `cg-command-center` GitHub repo with the redesigned components
2. A `DESIGN_TOKENS.md` documenting the system
3. A short Loom (or written walk-through) explaining the choices, especially anywhere you deviated from this brief

---

## Notes from Chris

- I prefer **conversational, thought-provoking, scannable** over corporate clean. The dashboard should have a tiny bit of personality (hook line, gradient hero card, lime accent) — not a sea of beige.
- Real-world analogy: **think Pelicano-style ops dashboard if it had design taste**. A control room, not a billing portal.
- I want to feel like a **calm operator** when I open this — not an inbox-zero crusader.
- If you're choosing between "more information" and "more clarity," choose clarity. Always.
