'use client';
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

export default function TodayPage({ tweaks, setTweak, isMobile, navigate }: TodayPageProps) {
  const isCollab = tweaks.persona === "collab";

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
        <PriorityCard style={tweaks.priorityStyle} />

        {isMobile && <MobileQuickieRow tints={tweaks.postItTints} />}

        <Metrics />

        {isMobile && <MobileTaskRow />}

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
