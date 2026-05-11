# Kickoff prompt — paste this to start the Claude Design conversation

---

Hi — I'm Chris Gee. I'm handing off a personal dashboard project for design work.

**The product:** *CG Command Center* — a single-user morning dashboard I review with coffee. At-a-glance answers to "what fires today, what's at risk, what closed, what's next." Built in Next.js 14 + Tailwind, deployed on Vercel. Static data for v1, lives at the file `lib/data.ts`.

**Current state:** Functional but visually unfinished. The layout works. The visual treatment needs to come up several levels.

**The brief lives in:** `DESIGN_BRIEF.md` — please read it first, end to end. It's deliberately opinionated and covers voice, IA, modules, color/type primitives, mobile, scope, and what's deliberately out of scope.

**The wireframe lives in:** `design/wireframe.html` — open it in a browser. It's layout-only. Final visuals should not look like this; it's just where things go.

**The visual reference:** I'm attaching a screenshot of LeadLogic's dashboard. That's the *style energy* I want — dark sidebar, lavender canvas, lime-green active accent, oversized metrics, gradient hero. Port the moves; do not copy literally.

**What I want back:**
1. A redesigned set of components (`components/Dashboard.tsx` and below) that swap into the current scaffold without breaking the data contract in `lib/data.ts`
2. A `DESIGN_TOKENS.md` documenting the system you build
3. Light + dark mode, desktop + mobile
4. A short walk-through of choices, especially deviations from the brief

**What's already decided** (please don't relitigate): the stack, the password middleware, the five sidebar nav items, the 50/50 split right rail (Quickies on top, tasks on bottom).

**What's open for your judgment:** exact colors, type choice, icon set, hover states, whether the priority card uses a gradient or solid violet, how the Post-It tints translate.

**My voice notes inside the brief explain how I want this to feel.** The line that should anchor your work: *calm operator, not enterprise SaaS.* If you're choosing between more information and more clarity, choose clarity.

Ready when you are. Start by reading `DESIGN_BRIEF.md` and walking me through your interpretation before you cut any pixels.
