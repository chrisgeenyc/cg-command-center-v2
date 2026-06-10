'use client';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Icon from '@/components/Icon';
import { PageHeader, MetricStrip } from '@/components/modules';
import { PROJECTS_METRICS, PROJECT_CARDS, ProjectCard as ProjectCardType } from '@/lib/data';

interface AsanaProject {
  gid: string;
  name: string;
  notes?: string;
  due_date?: string;
  permalink_url?: string;
  current_status_update?: { text?: string };
}

interface AsanaTask {
  gid: string;
  name: string;
  completed: boolean;
  due_on?: string;
}

interface AsanaSnapshot {
  projects: AsanaProject[];
  tasks: Record<string, AsanaTask[]>;
  synced_at?: string;
}

interface UnifiedTask {
  id: string;
  title: string;
  source: 'asana' | 'hubspot';
  project: string | null;
  due: string | null;
  priority: string | null;
  quadrant: 'do' | 'schedule' | 'delegate' | 'later';
}

function mapAsanaToCards(snapshot: AsanaSnapshot): ProjectCardType[] {
  return snapshot.projects.map((p) => {
    const tasks: AsanaTask[] = snapshot.tasks?.[p.gid] ?? [];
    const openTasks = tasks.filter((t) => !t.completed).length;
    const totalTasks = tasks.length;
    const percent = totalTasks > 0 ? Math.round(((totalTasks - openTasks) / totalTasks) * 100) : 0;

    let daysLeft: number | null = null;
    let deadline = '—';
    if (p.due_date) {
      deadline = p.due_date;
      const diff = Math.ceil((new Date(p.due_date).getTime() - Date.now()) / 86400000);
      daysLeft = diff >= 0 ? diff : 0;
    }

    const health = daysLeft === 0 ? 'risk' : daysLeft != null && daysLeft < 7 ? 'risk' : 'healthy';

    return {
      name: p.name,
      client: p.notes?.split('\n')[0]?.slice(0, 40) ?? 'Asana',
      deadline,
      daysLeft,
      percent,
      openTasks,
      blockers: 0,
      last: 'synced from Asana',
      health,
      stage: 'in-flight',
    };
  });
}

const HEALTH_LABELS: Record<string, { label: string; className: string }> = {
  healthy: { label: "Healthy", className: "healthy" },
  risk:    { label: "At risk", className: "risk" },
  stuck:   { label: "Stuck",   className: "blocked" },
  stale:   { label: "Stale",   className: "stale" },
};

function ProjectCard({ p, onOpen }: { p: ProjectCardType; onOpen: (p: ProjectCardType) => void }) {
  const h = HEALTH_LABELS[p.health] || HEALTH_LABELS.stale;
  const urgent = p.daysLeft != null && p.daysLeft === 0;
  const warn = p.daysLeft != null && p.daysLeft > 0 && p.daysLeft < 7;
  const barClass = p.health === "risk" ? "risk" : p.health === "stale" ? "stale" : "";
  return (
    <article className="proj-card" onClick={() => onOpen(p)}>
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
        {p.blockers > 0 && (
          <><span className="sep">·</span>
          <span style={{ color: "var(--blocked-fg)" }}><strong>{p.blockers}</strong> blocker{p.blockers > 1 ? "s" : ""}</span></>
        )}
        <span className="sep">·</span>
        <span>{p.last}</span>
      </div>
    </article>
  );
}

function ProjectDetail({ p, onClose }: { p: ProjectCardType; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!mounted) return null;

  const h = HEALTH_LABELS[p.health] || HEALTH_LABELS.stale;
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

  return createPortal(
    <>
      <div className="pdetail-veil" onClick={onClose} />
      <aside className="pdetail" role="dialog" aria-label={p.name}>
        <header className="pdetail-head">
          <div>
            <div className="pdetail-eyebrow">Project · {p.client}</div>
            <h2 className="pdetail-name">{p.name}</h2>
            <div className="pdetail-client">
              Last activity {p.last} · {p.deadline === "—" || p.deadline === "rolling"
                ? p.deadline
                : `due ${p.deadline}${p.daysLeft != null ? ` · ${p.daysLeft === 0 ? "today" : `${p.daysLeft}d left`}` : ""}`}
            </div>
            <div className="pdetail-pills">
              <span className={`pill ${h.className}`}>{h.label}</span>
              <span className="pill" style={{ background: "var(--canvas)", color: "var(--ink-3)" }}>{p.stage}</span>
              {p.blockers > 0 && (
                <span className="pill" style={{ background: "var(--blocked-bg)", color: "var(--blocked-fg)" }}>
                  {p.blockers} blocker{p.blockers > 1 ? "s" : ""}
                </span>
              )}
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
              Per brief: <em>&quot;design the slot, contents post-v1.&quot;</em>
            </div>
          </div>
        </div>
      </aside>
    </>,
    document.body
  );
}

const QUADRANTS: { id: UnifiedTask['quadrant']; label: string; hint: string; tone: string }[] = [
  { id: 'do',       label: 'Do first',  hint: 'urgent + important',       tone: 'do' },
  { id: 'schedule', label: 'Schedule',  hint: 'important, not urgent',    tone: 'schedule' },
  { id: 'delegate', label: 'Delegate',  hint: 'urgent, not important',    tone: 'delegate' },
  { id: 'later',    label: 'Later',     hint: 'neither — park it',        tone: 'later' },
];

function dueLabel(due: string | null): { text: string; urgent: boolean } {
  if (!due) return { text: 'no date', urgent: false };
  const t = new Date(due).getTime();
  if (Number.isNaN(t)) return { text: 'no date', urgent: false };
  const days = Math.ceil((t - Date.now()) / 86400000);
  if (days < 0) return { text: `${Math.abs(days)}d overdue`, urgent: true };
  if (days === 0) return { text: 'due today', urgent: true };
  if (days === 1) return { text: 'due tomorrow', urgent: true };
  return { text: `${days}d left`, urgent: false };
}

function EisenhowerMatrix({ tasks }: { tasks: UnifiedTask[] }) {
  return (
    <div className="eisen-grid">
      {QUADRANTS.map(q => {
        const items = tasks.filter(t => t.quadrant === q.id);
        return (
          <section key={q.id} className={`eisen-quad ${q.tone}`}>
            <header className="eisen-head">
              <span className="eisen-label">{q.label}</span>
              <span className="eisen-hint">{q.hint}</span>
              <span className="eisen-count">{items.length}</span>
            </header>
            <div className="eisen-list">
              {items.length === 0 && <div className="eisen-empty">Nothing here. Good.</div>}
              {items.map(t => {
                const d = dueLabel(t.due);
                return (
                  <div key={t.id} className="eisen-task">
                    <span className={`eisen-source ${t.source}`}>{t.source === 'asana' ? 'A' : 'H'}</span>
                    <span className="eisen-title">{t.title}</span>
                    <span className="eisen-meta">
                      {t.project && <span className="eisen-project">{t.project}</span>}
                      <span className={`eisen-due ${d.urgent ? 'urgent' : ''}`}>{d.text}</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export default function ProjectsPage() {
  const [filter, setFilter] = useState("active");
  const [view, setView] = useState<'cards' | 'matrix'>('cards');
  const [open, setOpen] = useState<ProjectCardType | null>(null);
  const [liveData, setLiveData] = useState<AsanaSnapshot | null>(null);
  const [unifiedTasks, setUnifiedTasks] = useState<UnifiedTask[]>([]);

  useEffect(() => {
    fetch('/api/asana')
      .then(r => r.json())
      .then((d: AsanaSnapshot) => { if (d.projects?.length) setLiveData(d); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch('/api/tasks')
      .then(r => r.json())
      .then((d: { tasks?: UnifiedTask[] }) => {
        if (Array.isArray(d.tasks)) setUnifiedTasks(d.tasks);
      })
      .catch(err => console.error('[Projects] tasks fetch failed:', err));
  }, []);

  const cards = liveData ? mapAsanaToCards(liveData) : PROJECT_CARDS;
  const syncedAt = liveData?.synced_at;

  const counts = {
    all:    cards.length,
    active: cards.filter(p => p.stage === "in-flight").length,
    risk:   cards.filter(p => p.health === "risk").length,
    onhold: cards.filter(p => p.stage === "on-hold").length,
    done:   0,
  };

  const filtered = cards.filter(p =>
    filter === "all"    ? true :
    filter === "active" ? p.stage === "in-flight" :
    filter === "risk"   ? p.health === "risk" :
    filter === "onhold" ? p.stage === "on-hold" :
    false
  );

  return (
    <main className="main main-full">
      <PageHeader
        title={<>Projects.</>}
        sub="What's in flight, what's stuck. Coursera ships Friday — Tegna needs a nudge."
        right={<><strong>Apr 24, 2026</strong><span className="muted">{syncedAt ? `SYNCED ${new Date(syncedAt).toLocaleTimeString()} · ASANA` : 'SYNCED 12 MIN AGO · ASANA'}</span></>}
      />
      <MetricStrip items={PROJECTS_METRICS} />

      <div className="chips">
        <button className={`chip ${view === 'cards' ? 'active' : ''}`} onClick={() => setView('cards')}>
          <Icon name="grid" size={12} /> Projects
        </button>
        <button className={`chip ${view === 'matrix' ? 'active' : ''}`} onClick={() => setView('matrix')}>
          <Icon name="zap" size={12} /> Priority matrix <span className="chip-count">{unifiedTasks.length}</span>
        </button>
        <span className="chip-divider" />
        {view === 'cards' && [
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
        <button className="chip" style={{ marginLeft: "auto" }}>
          <Icon name="plus" size={12} /> New project
        </button>
      </div>

      {view === 'matrix' ? (
        <EisenhowerMatrix tasks={unifiedTasks} />
      ) : (
        <div className="project-grid">
          {filtered.map((p, i) => <ProjectCard key={i} p={p} onOpen={setOpen} />)}
        </div>
      )}
      {open && <ProjectDetail p={open} onClose={() => setOpen(null)} />}
    </main>
  );
}
