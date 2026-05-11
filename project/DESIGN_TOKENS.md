# DESIGN_TOKENS.md — CG Command Center

The system is built around four ideas: **a dark sidebar that hosts navigation chrome, a tinted lavender canvas that hosts work, a single lime accent reserved for "now/active," and a single violet gradient reserved for the day's hero priority.** Status, type, and spacing all hang off that frame.

---

## 1. Type

| Role | Family | Weight | Notes |
| --- | --- | --- | --- |
| Display (greeting, priority sentence) | **Instrument Serif** | 400, italic optional | Editorial warmth — keeps the page from reading as enterprise SaaS |
| UI sans (everything else) | **Geist** | 400 / 500 / 600 | Vercel-native; tabular numerals on by default |
| Numerals, kbd, timestamps, taglines | **Geist Mono** | 400 / 500 | Used sparingly, mostly in metadata strips |

Type rules:

- All numbers use `font-variant-numeric: tabular-nums`. Non-negotiable for a dashboard.
- Metric numbers: 44px / 600 / `letter-spacing: -0.025em`. Mobile drops to 32px.
- Greeting: 44px Instrument Serif, italic on the name (the one piece of personality).
- Priority sentence: 30px Instrument Serif. The single longest, slowest line on the page.
- Section titles: 13px / 600. Eyebrows on metrics: 10.5px uppercase, 0.15em tracking.
- Body: 13–14px / 400. Tertiary metadata: 11.5–12.5px / 400, color `--ink-3`.

## 2. Color

### Light

| Token | Hex | Use |
| --- | --- | --- |
| `--canvas` | `#EFEDF7` | App background. Slightly desaturated lavender — softer than Tailwind purple-50 |
| `--surface` | `#FFFFFF` | Card surface |
| `--ink` | `#0F111A` | Primary text |
| `--ink-3` | `#6B6E7E` | Labels, metadata |
| `--sidebar` | `#0E1116` | Sidebar base, with radial gradient toward `#1A1D26` at top |
| `--accent` | `#C7F03B` | Lime — sidebar active state, primary CTA, only |
| `--violet-1 → --violet-deep` | `#7C5CFF → #4530B0` | Priority hero gradient. Used **once** per page |

### Dark

The lavender canvas inverts to `#0B0C12` (true near-black with a hint of blue). Surfaces lift to `#161823`. Violet desaturates and becomes the canvas accent. Lime holds — it's the only color that survives the inversion unchanged because it's already near-yellow in lightness.

### Status (used in pills + dots)

| Status | Light bg / fg | Dot |
| --- | --- | --- |
| Healthy | `#DEF2E2 / #1F6A3D` | `#2EA86A` |
| At risk | `#FBEBC8 / #7A5512` | `#E0A52E` |
| Blocked | `#F8DAD8 / #8A1F1A` | `#D14B43` |
| Stale | `#E6E6EC / #4A4D5A` | `#9A9CAA` |

These deviate from the brief's "emerald / amber / rose / gray" Tailwind defaults — the bg/fg pairs are tuned so the pill sits quietly on white *and* on the lavender canvas. Pills carry a 5px dot and 11.5px label so they read as labels, not stickers.

### Post-It tints (Quickies)

5 quiet washes — yellow, pink, blue, mint, peach — at ~5% saturation. Applied as full-card backgrounds, not borders. In dark mode they collapse to ~7% white tints because saturated pastels look chalky on dark.

```
--pit-yellow: #FBF4D6
--pit-pink:   #F8E1E5
--pit-blue:   #DEE9F4
--pit-mint:   #DDEEDF
--pit-peach:  #F8E5D2
```

Toggleable via Tweaks → Quickies → Post-It tints. With tints off the cards collapse to plain `--surface` and the rail reads as a uniform stack.

## 3. Spacing

8-point base, with a 4px micro-step for in-row gaps.

| Token | Value | Where it lives |
| --- | --- | --- |
| `--s-1` | 4 | Pill icon-to-text |
| `--s-2` | 8 | Tight gaps (button icon to label) |
| `--s-3` | 12 | Row gutters |
| `--s-4` | 16 | Card padding default |
| `--s-5` | 20 | Rail outer padding |
| `--s-6` | 24 | Section bottom margins |
| `--s-7` | 32 | Hero card padding |

Sidebar width: **248px**. Right rail width: **360px**. Main canvas pads 28px horizontal on desktop, 16px on mobile. Hero card lives at the full canvas width — never inset.

## 4. Radii

| Token | Value | Use |
| --- | --- | --- |
| `--r-xs` | 6 | Kbd, tiny chips |
| `--r-sm` | 8 | Buttons, search |
| `--r-md` | 12 | Cards, panels |
| `--r-lg` | 16 | (reserved) |
| `--r-xl` | 22 | Hero priority card only |

The hero card carries a larger radius on purpose — a visual cue that it's the special slot, not just another card.

## 5. Shadows

Two shadows + one hero-only halo.

```
--shadow-1: 0 1px 2px rgba(15,17,26,.04), 0 1px 1px rgba(15,17,26,.03);
--shadow-2: 0 6px 20px -10px rgba(15,17,26,.18), 0 2px 6px -3px rgba(15,17,26,.08);
--shadow-hero: 0 30px 60px -25px rgba(76,49,173,.45), 0 12px 28px -14px rgba(76,49,173,.25);
```

Most surfaces ship with no shadow — they sit on a 1px hairline ring instead (`rgba(15,17,26,0.07)`). Shadow only appears on hover (`shadow-1 → shadow-2` with a 1px translateY). The hero card carries a violet-tinted halo so the gradient bleeds into the canvas instead of stopping at a hard edge.

## 6. Hover & motion

- Cards: 1px `translateY(-1px)` + shadow lift, 180ms ease.
- Buttons: same lift, plus tinted halo on the primary lime CTA.
- Pulse: a 2.2s halo ring on the priority kicker dot — the page's only ambient animation. Signals "live."
- Quickie complete: opacity fade to 0.55 + strikethrough on the action sentence. The brief asked for confetti; I read "calm operator" as "no confetti." Open to revisiting if you want more dopamine.

## 7. Mobile rules

- Breakpoint by Tweak (no media query yet — desktop-first preview, mobile via toggle). Easy to lift into Tailwind breakpoints later.
- Sidebar collapses to a top bar with a hamburger + brand mark + theme toggle.
- Right rail disappears. Quickies promote to a horizontal-scroll card row directly under the priority hero. Tasks promote to a second card row between metrics and project status.
- Metric strip: 4-up → 2x2.
- Two-column row (calendar + wins) stacks.
- Greeting drops to 32px.

## 8. Deviations from the brief

| Brief said | I shipped | Why |
| --- | --- | --- |
| Inter or Geist Sans | Geist + Instrument Serif (display) | Inter alone reads as too clean for "calm operator." A serif on the greeting and the priority sentence is the personality. |
| `#F2F0FA` lavender canvas | `#EFEDF7` (cooler / less saturated) | Tested side-by-side; the spec value pulled too pink against the dark sidebar. Mine reads more like cool paper. |
| Status pills using Tailwind emerald/amber/rose/gray | Custom bg/fg pairs | Tailwind defaults are tuned for white pages. These are tuned to also sit calmly on the lavender canvas. |
| Post-It tints as bg color | Same — but **toggleable** via Tweaks | One click to see the rail without the tints; useful for evaluating the paper-metaphor question without forking files. |
| Confetti completion micro-interaction | Strikethrough + fade | "Calm operator" override. Toggle in v2 if you want the dopamine back. |

## 9. v2 patterns (added since the first cut)

The first ship was a single-operator dashboard. Five things grew on top of it. They share a discipline: **add a new dimension only when its absence forces the user to hold the dimension in their head.**

### 9a. Persona — Operator vs Collaborator

The product stays single-operator at the *core* — Pipeline, Quickies, deal values, relationship notes never leave Chris. But Sharisse needs a service-mode view of Today so the assistant relationship doesn't run through Slack pings. Two personas, one URL:

- **Operator** (default). Sees everything documented above.
- **Collaborator** (`data-persona="collab"`). Sees Today, Projects (read-only), Pulse, Notes, Settings. Pipeline + Quickies hidden from sidebar entirely, not just role-gated.

Visual signal: collaborator avatar uses a **warm peach gradient** (`#FFB897 → #E07B4A`) where the operator avatar is violet — instantly distinguishable in screenshots and at a glance. The brand wordmark gets a small `guest` tag.

The collaborator's right rail is **not** the operator's right rail with permissions stripped. It's a different surface — "Quickies suggested for Chris." Sharisse spots relationship moments, one-click promotes them to his queue. She never sees his replies, his queue size, or the Quickies he completed. One-way data flow, by design.

Toggle via Tweaks → Persona. In production this is set by `auth.role`, never a user-facing toggle.

### 9b. Quickies dimensions — rel / touch / temp

Quickies started as a flat list ("call Steve, email Dana"). It became unscannable around 8 items. Three orthogonal dimensions, each surfaced as a 9.5px chip on the card:

| Dim | Values | Encoded as |
| --- | --- | --- |
| `rel` (relationship) | active / past / partner / network / mentor | Outline chip, neutral |
| `touch` (intent) | value / checkin / ask | Filled chip, neutral |
| `temp` (heat) | warm / cooling / cold | Filled chip + colored dot — the only chip that carries color |

The chips are deliberately **monochrome except for temperature.** Color is the limiting reagent; spending it on the dimension that says "this relationship is dying" is the right trade. Rel and touch are categorical metadata — you read them, you don't react to them.

This row appears on the right-rail Quickie card *and* on the full Quickies page card, identically. Same data shape, same visual treatment. Don't fork the component.

### 9c. Pulse — a fourth content type

Pipeline = money. Projects = deliverables. Quickies = relationships. **Pulse = signal.** Press mentions, podcast invites, conference asks, advisor pings — things that are neither a deal nor a task but you still need to see. Pulse cards have their own page and a 3-card module on Today.

Pulse cards carry a `kind` (mention / invite / signal / ask) and a `weight` (opportunity / fyi / noise). Weight drives whether it shows in Today's preview module; kind drives the leading icon. No status pills here — Pulse items don't have lifecycle, they have decisions ("save / archive / draft a reply").

### 9d. Pipeline — Lead Nurture vs Active Deals (and charts)

Two HubSpot-shaped concepts that look similar from far away:

- **Active Deals** — proposals out, contracts circling. Has a value, a stage, a next move. Lives in the deal table.
- **Lead Nurture** — Lead/MQL lifecycle. People warming up. Has an estimated value and a temperature, but no proposal yet. Lives in its own table below deals.

Keeping them on the same page (under a single "Pipeline" nav item) but in **separate sections** is the trade. They share one mental model — "money in flight" — but they don't share lifecycle stages or owner expectations. Mixing them was the worst version of this page; collapsing them into a single Lead Nurture page was the second worst (Chris stops reading it). Two sections, clearly labeled, beat both.

Pipeline also gained two charts: a 12-month stacked revenue bar (retainer / workshop / advisory) and a Q-end forecast by service type. Both use the existing palette — accent lime + violet + ink + a single peach for the 4th slice — no new colors. Bars max-height to the column, not absolute pixels, so the chart stays legible at any column width.

### 9e. Team in Settings

Settings → Team is where the persona system lives in the product UI. It lists Chris (Owner) and Sharisse (Collaborator) and exposes a per-module visibility matrix — what the collaborator sees in Today. Default is the conservative version: tasks, waiting-on-you, calendar, suggested Quickies. Pipeline + Quickies + Pulse default off. Toggling a module on doesn't migrate her view automatically; it shows up on her next refresh.

### 9f. Brand mark — logo + headshot

Brand mark in the sidebar moved from a generated lime "c" tile to **a real logo image** in `logo.png` (transparent PNG, white-on-dark). The `.brand-mark.has-logo` modifier strips the gradient/shadow so the logo sits clean. User tile avatar moved from "CG" initials to **a real headshot** (`headshot.png`) for the operator persona; collaborator persona keeps initials on the warm gradient. This is the difference between a mock and a tool — once your face is in the chrome, the dashboard stops feeling like demo data.

---

## 10. What's intentionally not in the system yet

- Real-time charts (Pipeline charts are static aggregates, computed once per sync — not streaming).
- Any second accent color. The page has lime + violet + peach (collab) + status colors; nothing else has earned a slot.
- A third persona. "Client-facing read-only" was discussed and cut — the right answer is a generated PDF, not a third view.
- Notification/inbox surface. Pulse is the closest thing; we'll let it grow before splitting.
