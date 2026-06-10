'use client';
import { useState, useEffect } from 'react';
import Icon from '@/components/Icon';
import { UtilityRow, Header, PriorityCard, Metrics, StatusList, Calendar, Wins } from '@/components/modules';
import { RightRail, CollabRail, MobileQuickieRow, MobileTaskRow } from '@/components/RightRail';
import { TodayPulseModule } from '@/components/PulsePage';
import {
  PROJECTS, BLOCKED,
  SHARISSE_HOOK, SHARISSE_PRIORITY, SHARISSE_METRICS, SHARISSE_WAITING,
  StatusItem, MetricItem
} from '@/lib/data';
import { TweakValues } from '@/components/TweaksPanel';

function CollabHeader() {
  return (
    <header className="header">
      <div>
        <h1 className="greeting">Good morning, <em>Sharisse.</em></h1>
        <p className="greeting-sub">{SHARISSE_HOOK}</p>
      </div>
      <div className="date-stamp">
        <strong>Friday, Apr 24, 2026</strong>
        <span className="muted">06:58 AM ET · COLLABORATOR VIEW</span>
      </div>
    </header>
  );
}

function CollabPriority({ style }: { style: string }) {
  return (
    <section className={`priority collab-priority ${style}`}>
      <div className="priority-progress">
        <span className="progress-pill">{SHARISSE_PRIORITY.progressLabel}</span>
      </div>
      <span className="priority-kicker"><span className="pulse" />{SHARISSE_PRIORITY.kicker}</span>
      <h2 className="priority-title">{SHARISSE_PRIORITY.title}</h2>
      <div className="priority-meta">
        <span><b>Hand-off currency</b> · tasks (strategy stays his)</span>
        <span><b>Daily check-in</b> · 2:00 PM</span>
      </div>
      <div className="priority-actions">
        <button className="btn-primary"><Icon name="zap" size={15} /> Take Coursera platform upload</button>
        <button className="btn-ghost">Take grading config <Icon name="arrow-right" size={14} /></button>
      </div>
    </section>
  );
}

function CollabMetrics() {
  return (
    <div className="metrics">
      {SHARISSE_METRICS.map((m, i) => (
        <div className="metric" key={i}>
          <div className="metric-label">{m.label}</div>
          <div className="metric-value">
            {m.value}
            {m.unit && <span className="unit">{m.unit}</span>}
            <span className={`metric-trend ${m.trend.dir}`}>
              {m.trend.dir === "up" ? "↑" : m.trend.dir === "down" ? "↓" : "→"} {m.trend.text}
            </span>
          </div>
          <div className="metric-sub">
            <span className="dot" style={{
              background: m.subDot === "risk"    ? "var(--dot-risk)" :
                          m.subDot === "healthy" ? "var(--dot-healthy)" : "var(--dot-stale)"
            }} />
            {m.sub}
          </div>
        </div>
      ))}
    </div>
  );
}

function WaitingOnChris() {
  return (
    <section className="section">
      <div className="section-head">
        <span className="section-dot" style={{ background: "var(--dot-blocked)" }} />
        <h3 className="section-title">Waiting on Chris</h3>
        <span className="section-count">{SHARISSE_WAITING.length} items · oldest 4d</span>
        <a className="section-action" href="#">nudge in Slack <Icon name="arrow-right" size={12} /></a>
      </div>
      <div className="list-card">
        {SHARISSE_WAITING.map((p, i) => (
          <div className="row" key={i}>
            <div className="row-leader"><Icon name={p.icon} size={15} /></div>
            <div className="row-main">
              <div className="row-title">{p.name}</div>
              <div className="row-sub">{p.sub}</div>
            </div>
            <div className="row-meta">
              <span className={`pill ${p.status}`}>
                <span className="pill-dot" />{p.pill}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

interface UnifiedTask {
  id: string;
  title: string;
  source: 'asana' | 'hubspot';
  project: string | null;
  due: string | null;
  quadrant: 'do' | 'schedule' | 'delegate' | 'later';
}

function doFirstDueLabel(due: string | null): { text: string; urgent: boolean } {
  if (!due) return { text: 'no date', urgent: false };
  const days = Math.ceil((new Date(due).getTime() - Date.now()) / 86400000);
  if (Number.isNaN(days)) return { text: 'no date', urgent: false };
  if (days < 0) return { text: `${Math.abs(days)}d overdue`, urgent: true };
  if (days === 0) return { text: 'due today', urgent: true };
  if (days === 1) return { text: 'tomorrow', urgent: true };
  return { text: `${days}d left`, urgent: false };
}

function DoFirstModule({ navigate, tasks, excludeId }: { navigate: (id: string) => void; tasks: UnifiedTask[]; excludeId?: string }) {
  const doTasks = tasks.filter(t => t.quadrant === 'do' && t.id !== excludeId);

  if (doTasks.length === 0) return null;

  return (
    <section className="section">
      <div className="section-head">
        <span className="section-dot" style={{ background: "var(--dot-risk)" }} />
        <h3 className="section-title">Do first</h3>
        <span className="section-count">{doTasks.length} urgent + important</span>
        <a className="section-action" href="#" onClick={e => { e.preventDefault(); navigate("projects"); }}>
          full matrix <Icon name="arrow-right" size={12} />
        </a>
      </div>
      <div className="list-card">
        {doTasks.slice(0, 5).map(t => {
          const d = doFirstDueLabel(t.due);
          return (
            <div className="row" key={t.id}>
              <div className="row-leader"><Icon name={t.source === 'asana' ? 'grid' : 'user'} size={15} /></div>
              <div className="row-main">
                <div className="row-title">{t.title}</div>
                <div className="row-sub">{t.project ?? (t.source === 'hubspot' ? 'HubSpot' : 'Asana')}</div>
              </div>
              <div className="row-meta">
                <span className={`pill ${d.urgent ? 'risk' : 'stale'}`}>
                  <span className="pill-dot" />{d.text}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

const COLLAB_TASKS: StatusItem[] = [
  { name: "Coursera platform upload (Wk 6–10)", sub: "from Chris · due today · drafts ready", status: "risk", pill: "due today", icon: "video" },
  { name: "Grading config — same Coursera",     sub: "from Chris · due today",                  status: "risk", pill: "due today", icon: "alert" },
  { name: "TIC newsletter — Apr 26 issue",      sub: "weekly · ships Friday 9 AM",              status: "healthy", pill: "on track", icon: "mail" },
  { name: "Send retreat speaker confirmations", sub: "5 of 7 confirmed · awaiting 2",           status: "risk", pill: "this week", icon: "compass" },
  { name: "Tegna SOW prep",                     sub: "draft Chris's review by EOD",             status: "stale", pill: "in flight", icon: "alert" },
];

interface TodayPageProps {
  tweaks: TweakValues;
  setTweak: (key: string, val: unknown) => void;
  isMobile: boolean;
  navigate: (id: string) => void;
}

// Deadline proximity → progress bar fill. Overdue pins the bar.
function deadlinePercent(due: string | null): number {
  if (!due) return 40;
  const days = Math.ceil((new Date(due).getTime() - Date.now()) / 86400000);
  if (Number.isNaN(days)) return 40;
  if (days < 0) return 100;
  if (days === 0) return 85;
  if (days === 1) return 70;
  return Math.max(15, 70 - days * 8);
}

export default function TodayPage({ tweaks, setTweak, isMobile, navigate }: TodayPageProps) {
  const isCollab = tweaks.persona === "collab";
  const [matrixTasks, setMatrixTasks] = useState<UnifiedTask[]>([]);

  useEffect(() => {
    fetch('/api/tasks')
      .then(r => r.json())
      .then((d: { tasks?: UnifiedTask[] }) => {
        if (Array.isArray(d.tasks)) setMatrixTasks(d.tasks);
      })
      .catch(() => {});
  }, []);

  // Today's single priority = top of the matrix: Do first beats
  // Delegate beats Schedule; within a quadrant the API already
  // sorts soonest-due first.
  const topTask =
    matrixTasks.find(t => t.quadrant === 'do') ??
    matrixTasks.find(t => t.quadrant === 'delegate') ??
    matrixTasks.find(t => t.quadrant === 'schedule') ??
    null;

  const doCount = matrixTasks.filter(t => t.quadrant === 'do').length;

  const livePriority = topTask ? {
    title: topTask.title,
    dueText: doFirstDueLabel(topTask.due).text,
    sourceText: topTask.project ?? (topTask.source === 'hubspot' ? 'HubSpot' : 'Asana'),
    progressLabel: doCount > 0 ? `1 OF ${doCount} DO-FIRST` : 'NEXT UP',
    percent: deadlinePercent(topTask.due),
  } : null;

  if (isCollab) {
    return (
      <>
        <main className="main" data-persona="collab">
          {!isMobile && (
            <UtilityRow
              onTheme={() => setTweak("theme", tweaks.theme === "dark" ? "light" : "dark")}
              theme={tweaks.theme}
            />
          )}
          <CollabHeader />
          <CollabPriority style={tweaks.priorityStyle} />
          <CollabMetrics />
          <WaitingOnChris />
          <StatusList
            title="Tasks Assigned to Me"
            items={COLLAB_TASKS}
            sectionDot="var(--dot-risk)"
            count="5 active · 2 due today"
            action="all my tasks"
          />
          <div className="two-col">
            <Calendar />
            <div className="panel">
              <div className="panel-title">
                <span className="section-dot" style={{ background: "var(--dot-healthy)" }} />
                TIC Newsletter — Apr 26 issue
              </div>
              <div style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.55 }}>
                Draft locked Wednesday. Subscriber count <b>4,820</b> (+38 wk/wk). Three pieces in queue:
              </div>
              <ul style={{ paddingLeft: 18, marginTop: 10, fontSize: 12.5, color: "var(--ink-3)", lineHeight: 1.7 }}>
                <li>&quot;AI in PR&quot; — feature, 1,200 words (ready)</li>
                <li>Coursera retrospective — 600 words (Chris drafting)</li>
                <li>Quickie of the week — pull from Chris&apos;s wins</li>
              </ul>
              <button className="connector-action primary" style={{ marginTop: 12 }}>Open draft</button>
            </div>
          </div>
        </main>
        {!isMobile && <CollabRail />}
      </>
    );
  }

  return (
    <>
      <main className="main">
        {!isMobile && (
          <UtilityRow
            onTheme={() => setTweak("theme", tweaks.theme === "dark" ? "light" : "dark")}
            theme={tweaks.theme}
          />
        )}
        <Header />
        <PriorityCard style={tweaks.priorityStyle} live={livePriority} />

        {isMobile && <MobileQuickieRow tints={tweaks.postItTints} />}

        <Metrics />

        {isMobile && <MobileTaskRow />}

        <DoFirstModule navigate={navigate} tasks={matrixTasks} excludeId={topTask?.id} />

        <TodayPulseModule navigate={navigate} />

        <StatusList
          title="Active Project Status"
          items={PROJECTS}
          sectionDot="var(--dot-risk)"
          count="4 active"
          action="all projects"
        />
        <StatusList
          title="Blocked / Slipping"
          items={BLOCKED}
          sectionDot="var(--dot-blocked)"
          count="3 items"
          action="triage"
        />
        <div className="two-col">
          <Calendar />
          <Wins />
        </div>
      </main>
      {!isMobile && <RightRail tints={tweaks.postItTints} />}
    </>
  );
}
