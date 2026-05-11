// Projects — "What's in flight, what's stuck?"
const { Icon, PageHeader, MetricStrip } = window;

const HEALTH_LABELS = {
  healthy: { label: "Healthy", className: "healthy" },
  risk:    { label: "At risk", className: "risk" },
  stuck:   { label: "Stuck",   className: "blocked" },
  stale:   { label: "Stale",   className: "stale" },
};

function ProjectCard({ p, onOpen }) {
  const h = HEALTH_LABELS[p.health];
  const urgent = p.daysLeft != null && p.daysLeft === 0;
  const warn = p.daysLeft != null && p.daysLeft > 0 && p.daysLeft < 7;
  const barClass = p.health === "risk" ? "risk" : p.health === "stale" ? "stale" : "";
  return (
    <article className="proj-card" onClick={() => onOpen && onOpen(p)}>
      <div className="proj-head">
        <div>
          <div className="proj-name">{p.name}</div>
          <div className="proj-client">{p.client}</div>
        </div>
        <span className={`pill ${h.className}`}>{h.label}</span>
      </div>
      <div className={`proj-deadline ${urgent ? "urgent" : warn ? "warn" : ""}`}>
        <Icon name="calendar" size={13} />
        {p.deadline === "—" || p.deadline === "rolling"
          ? <span>{p.deadline}</span>
          : <span>Due {p.deadline}{p.daysLeft != null && ` · ${p.daysLeft === 0 ? "today" : `${p.daysLeft}d left`}`}</span>}
      </div>
      <div className={`proj-bar ${barClass}`}><span style={{ width: `${p.percent}%` }} /></div>
      <div className="proj-foot">
        <span><strong>{p.percent}%</strong> done</span>
        <span className="sep">·</span>
        <span><strong>{p.openTasks}</strong> tasks</span>
        {p.blockers > 0 && <><span className="sep">·</span><span style={{ color: "var(--blocked-fg)" }}><strong>{p.blockers}</strong> blocker{p.blockers > 1 ? "s" : ""}</span></>}
        <span className="sep">·</span>
        <span>{p.last}</span>
      </div>
    </article>
  );
}

function ProjectDetail({ p, onClose }) {
  React.useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);
  const h = HEALTH_LABELS[p.health];
  // Static slot data — designer placeholder per brief: contents post-v1
  const tasks = [
    { name: "Record lesson 5 — Prompts as Policy", when: "due today",   done: false },
    { name: "Upload modules 1–4 to platform",       when: "due today",   done: false },
    { name: "Grading config in LMS",                 when: "due today",   done: false },
    { name: "Draft lesson 6 outline",                when: "Apr 26",      done: true  },
    { name: "Lessons 1–4 drafts",                    when: "Apr 21",      done: true  },
  ].slice(0, p.openTasks + 2);
  const milestones = [
    { name: "Kickoff + outline approval",  when: "Mar 18", state: "done" },
    { name: "Drafts 1–4 delivered",         when: "Apr 21", state: "done" },
    { name: "Wk 6–10 ship date",            when: p.deadline, state: p.daysLeft === 0 ? "next" : p.percent >= 100 ? "done" : "next" },
    { name: "Retainer flip · Wk 11 onward", when: "May 02", state: "future" },
  ];
  const linkedNotes = ["Coursera Wk 6 outline", "Pricing thoughts (Q2)"];
  return ReactDOM.createPortal(
    <>
      <div className="pdetail-veil" onClick={onClose} />
      <aside className="pdetail" role="dialog" aria-label={p.name}>
        <header className="pdetail-head">
          <div>
            <div className="pdetail-eyebrow">Project · {p.client}</div>
            <h2 className="pdetail-name">{p.name}</h2>
            <div className="pdetail-client">Last activity {p.last} · {p.deadline === "—" || p.deadline === "rolling" ? p.deadline : `due ${p.deadline}${p.daysLeft != null ? ` · ${p.daysLeft === 0 ? "today" : `${p.daysLeft}d left`}` : ""}`}</div>
            <div className="pdetail-pills">
              <span className={`pill ${h.className}`}>{h.label}</span>
              <span className="pill" style={{ background: "var(--canvas)", color: "var(--ink-3)" }}>{p.stage}</span>
              {p.blockers > 0 && <span className="pill" style={{ background: "var(--blocked-bg)", color: "var(--blocked-fg)" }}>{p.blockers} blocker{p.blockers > 1 ? "s" : ""}</span>}
            </div>
          </div>
          <button className="close" onClick={onClose} title="Close (Esc)"><Icon name="x" size={14} /></button>
        </header>

        <div className="pdetail-body">
          <div className="pdetail-grid">
            <div className="pdetail-stat">
              <div className="label">Progress</div>
              <div className="value">{p.percent}<span style={{ fontSize: 14, color: "var(--ink-3)" }}>%</span></div>
              <div className="sub">complete</div>
            </div>
            <div className="pdetail-stat">
              <div className="label">Open tasks</div>
              <div className="value">{p.openTasks}</div>
              <div className="sub">{p.blockers > 0 ? `${p.blockers} blocked` : "none blocked"}</div>
            </div>
            <div className="pdetail-stat">
              <div className="label">Last touch</div>
              <div className="value" style={{ fontSize: 16 }}>{p.last}</div>
              <div className="sub">activity timestamp</div>
            </div>
          </div>

          <div className="pdetail-section">
            <h4>Open tasks</h4>
            <div className="pdetail-tasklist">
              {tasks.map((t, i) => (
                <div key={i} className={`pdetail-task ${t.done ? "done" : ""}`}>
                  <span className="check">{t.done && "✓"}</span>
                  <span className="name">{t.name}</span>
                  <span className="when">{t.when}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pdetail-section">
            <h4>Milestones</h4>
            {milestones.map((m, i) => (
              <div key={i} className={`pdetail-milestone ${m.state}`}>
                <span className="marker" />
                <span style={{ color: m.state === "future" ? "var(--ink-3)" : "var(--ink-2)" }}>{m.name}</span>
                <span className="when">{m.when}</span>
              </div>
            ))}
          </div>

          <div className="pdetail-section">
            <h4>Linked notes</h4>
            <div className="pdetail-linked">
              {linkedNotes.map(n => (
                <span key={n} className="link-chip note"><Icon name="note" size={10} />{n}</span>
              ))}
              <span className="link-chip" style={{ background: "transparent", color: "var(--ink-4)", border: "1px dashed var(--hairline-2)" }}>+ link a note</span>
            </div>
          </div>

          <div className="pdetail-section">
            <h4>Slot reserved · post-v1</h4>
            <div style={{ background: "var(--surface)", border: "1px dashed var(--hairline-2)", borderRadius: "var(--r-md)", padding: 14, fontSize: 12.5, color: "var(--ink-3)", lineHeight: 1.55 }}>
              Activity timeline · file attachments · linked Quickies · stakeholders · time-to-ship trend.
              Per brief: <em>"design the slot, contents post-v1."</em>
            </div>
          </div>
        </div>
      </aside>
    </>,
    document.body
  );
}

function ProjectsPage({ isMobile }) {
  const { PROJECT_CARDS, PROJECTS_METRICS } = window.CG_DATA;
  const [filter, setFilter] = React.useState("active");
  const [open, setOpen] = React.useState(null);

  const counts = {
    all:      PROJECT_CARDS.length,
    active:   PROJECT_CARDS.filter(p => p.stage === "in-flight").length,
    risk:     PROJECT_CARDS.filter(p => p.health === "risk").length,
    onhold:   PROJECT_CARDS.filter(p => p.stage === "on-hold").length,
    done:     0,
  };

  const filtered = PROJECT_CARDS.filter(p =>
    filter === "all"    ? true :
    filter === "active" ? p.stage === "in-flight" :
    filter === "risk"   ? p.health === "risk" :
    filter === "onhold" ? p.stage === "on-hold" :
    false
  );

  return (
    <main className="main main-full" data-screen-label="Projects">
      <PageHeader
        title={<>Projects.</>}
        sub="What's in flight, what's stuck. Coursera ships Friday — Tegna needs a nudge."
        right={<><strong>Apr 24, 2026</strong><span className="muted">SYNCED 12 MIN AGO · ASANA</span></>}
      />
      <MetricStrip items={PROJECTS_METRICS} />

      <div className="chips">
        {[
          { id: "all",    label: "All",     count: counts.all },
          { id: "active", label: "Active",  count: counts.active },
          { id: "risk",   label: "At risk", count: counts.risk },
          { id: "onhold", label: "On hold", count: counts.onhold },
          { id: "done",   label: "Done",    count: counts.done },
        ].map(c => (
          <button key={c.id}
                  className={`chip ${filter === c.id ? "active" : ""}`}
                  onClick={() => setFilter(c.id)}>
            {c.label} <span className="chip-count">{c.count}</span>
          </button>
        ))}
        <span className="chip-divider" />
        <span className="chip-group-by">
          <Icon name="grid" size={12} /> Group by deadline
        </span>
        <button className="chip" style={{ marginLeft: "auto" }}>
          <Icon name="plus" size={12} /> New project
        </button>
      </div>

      <div className="project-grid">
        {filtered.map((p, i) => <ProjectCard key={i} p={p} onOpen={setOpen} />)}
      </div>
      {open && <ProjectDetail p={open} onClose={() => setOpen(null)} />}
    </main>
  );
}

window.ProjectsPage = ProjectsPage;
