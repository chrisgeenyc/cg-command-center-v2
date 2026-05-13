'use client';
import { useState } from 'react';
import Icon from '@/components/Icon';
import { QUICKIES, TASKS, SHARISSE_QUICKIES_SUGGESTED, QuickieItem } from '@/lib/data';

const channelIcon = (ch: string) => ({
  email: "mail", linkedin: "linkedin", text: "text", call: "phone",
}[ch] || "mail");

// Build the deep-link / external URL for a Quickie's channel action.
// Clicking the card body fires this. Live until v2 (Buffer/HubSpot wiring).
const channelHref = (q: QuickieItem) => {
  const subject = encodeURIComponent(`Quick note — ${q.action}`);
  const body = encodeURIComponent(`Hi ${q.who.split(/[·,]/)[0].trim()},\n\n`);
  switch (q.channel) {
    case "email":    return `mailto:?subject=${subject}&body=${body}`;
    case "linkedin": return `https://www.linkedin.com/messaging/`;
    case "text":     return `sms:`;
    case "call":     return `tel:`;
    default:         return null;
  }
};

const REL_LABEL: Record<string, string> = { active: "active", past: "past", partner: "partner", network: "network", mentor: "mentor" };
const TOUCH_LABEL: Record<string, string> = { value: "value drop", checkin: "check-in", ask: "ask" };
const TEMP_LABEL: Record<string, string> = { warm: "warm", cooling: "cooling", cold: "cold" };

function QuickieChips({ q, compact = false }: { q: QuickieItem; compact?: boolean }) {
  return (
    <div className={`q-chips ${compact ? "compact" : ""}`}>
      {q.rel   && <span className={`q-chip rel rel-${q.rel}`}>{REL_LABEL[q.rel]}</span>}
      {q.touch && <span className={`q-chip touch touch-${q.touch}`}>{TOUCH_LABEL[q.touch]}</span>}
      {q.temp  && <span className={`q-chip temp temp-${q.temp}`}><span className="q-chip-dot" />{TEMP_LABEL[q.temp]}</span>}
    </div>
  );
}

function Quickie({ q, onToggle, tints }: { q: QuickieItem; onToggle: () => void; tints: boolean }) {
  const href = channelHref(q);
  const openChannel = () => {
    if (!href) return;
    // mailto / tel / sms protocols don't need a new tab; web URLs do.
    if (href.startsWith("http")) window.open(href, "_blank", "noopener");
    else window.location.href = href;
  };
  return (
    <div
      className={`quickie ${tints ? `tinted-${q.tint}` : ""} ${q.done ? "done" : ""}`}
      onClick={openChannel}
      role={href ? "link" : undefined}
      tabIndex={href ? 0 : undefined}
      onKeyDown={(e) => { if (href && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openChannel(); } }}
      style={{ cursor: href ? "pointer" : "default" }}
    >
      <button
        className={`check ${q.done ? "checked" : ""}`}
        onClick={(e) => { e.stopPropagation(); onToggle(); }}
        aria-label="Mark done"
      >
        <Icon name="check" size={11} />
      </button>
      <div>
        <div className="quickie-who">
          {q.who} <span className="ctx">· {q.ctx}</span>
        </div>
        <div className="quickie-action">{q.action}</div>
        <QuickieChips q={q} compact />
        <div className="quickie-meta">
          <span>{q.trigger}</span>
        </div>
      </div>
      <div className="quickie-channel" title={`Open ${q.channel}`}>
        <Icon name={channelIcon(q.channel)} size={12} />
      </div>
    </div>
  );
}

function QuickiesHalf({ tints }: { tints: boolean }) {
  const [list, setList] = useState(QUICKIES);
  const toggle = (i: number) => setList(L => L.map((q, j) => j === i ? { ...q, done: !q.done } : q));
  const doneCount = list.filter(q => q.done).length;
  return (
    <div className="rail-half top">
      <div className="rail-head">
        <div className="rail-title">
          Digital Quickies <span className="count">· {list.length - doneCount} open</span>
        </div>
        <button className="rail-add" title="Add Quickie (⌘J)"><Icon name="plus" size={14} /></button>
      </div>
      <div className="rail-list">
        {list.map((q, i) => <Quickie key={i} q={q} tints={tints} onToggle={() => toggle(i)} />)}
      </div>
      <div className="rail-foot">
        <strong>Done today · {doneCount}</strong> · see all (8) →
      </div>
    </div>
  );
}

function TasksHalf() {
  return (
    <div className="rail-half bottom">
      <div className="rail-head">
        <div className="rail-title">
          Today&apos;s Focus <span className="count">· {TASKS.length} of 12</span>
        </div>
        <a className="section-action" href="#" style={{ marginLeft: "auto", fontSize: 11 }}>view all →</a>
      </div>
      <div className="rail-list" style={{ overflowY: "auto" }}>
        {TASKS.map((t, i) => (
          <div className="task" key={i}>
            <div>
              <div className="task-name">{t.name}</div>
              <div className="task-tag"><span className="tag-dot" />{t.project}</div>
            </div>
            <span className={`pill ${t.urgent ? "risk" : "stale"}`}>
              <span className="pill-dot" />{t.urgent ? "due today" : "this week"}
            </span>
            <div className={`task-progress ${t.urgent ? "urgent" : ""}`}>
              <span style={{ width: `${t.percent}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RightRail({ tints }: { tints: boolean }) {
  return (
    <aside className="rail">
      <QuickiesHalf tints={tints} />
      <div className="rail-divider" />
      <TasksHalf />
    </aside>
  );
}

export function CollabRail() {
  const [promoted, setPromoted] = useState<Record<number, boolean>>({});
  return (
    <aside className="rail collab-rail">
      <div className="rail-half" style={{ flex: 1 }}>
        <div className="rail-head">
          <div className="rail-title">
            Suggested for Chris <span className="count">· {SHARISSE_QUICKIES_SUGGESTED.length} spotted</span>
          </div>
        </div>
        <div className="suggestion-help">
          Moments you noticed that he should follow up on. Promote sends them to his Quickies queue — you don&apos;t see his replies.
        </div>
        <div className="rail-list" style={{ gap: 10 }}>
          {SHARISSE_QUICKIES_SUGGESTED.map((s, i) => (
            <div key={i} className={`collab-suggestion ${promoted[i] ? "promoted" : ""}`}>
              <div className="quickie-who">{s.who} <span className="ctx">· {s.ctx}</span></div>
              <div className="quickie-action">{s.action}</div>
              <div className="suggestion-reason">spotted: {s.reason}</div>
              <div className="suggestion-actions">
                <button className="suggestion-promote"
                        onClick={() => setPromoted({ ...promoted, [i]: !promoted[i] })}>
                  <Icon name={promoted[i] ? "check" : "arrow-right"} size={12} />
                  {promoted[i] ? "Sent to Chris" : "Promote to Chris"}
                </button>
                <button className="suggestion-dismiss">dismiss</button>
              </div>
            </div>
          ))}
        </div>
        <div className="rail-foot" style={{ marginTop: "auto" }}>
          <strong>Promoted today · {Object.values(promoted).filter(Boolean).length}</strong> · he&apos;ll see them on his next refresh
        </div>
      </div>
    </aside>
  );
}

export function MobileQuickieRow({ tints }: { tints: boolean }) {
  const [list, setList] = useState(QUICKIES);
  const toggle = (i: number) => setList(L => L.map((q, j) => j === i ? { ...q, done: !q.done } : q));
  return (
    <div className="mobile-rail">
      <div className="rail-head" style={{ padding: "0 4px" }}>
        <div className="rail-title">Digital Quickies <span className="count">· {list.filter(q => !q.done).length} open</span></div>
        <button className="rail-add" title="Add Quickie"><Icon name="plus" size={14} /></button>
      </div>
      <div className="rail-list">
        {list.map((q, i) => <Quickie key={i} q={q} tints={tints} onToggle={() => toggle(i)} />)}
      </div>
    </div>
  );
}

export function MobileTaskRow() {
  return (
    <div className="mobile-rail">
      <div className="rail-head" style={{ padding: "0 4px" }}>
        <div className="rail-title">Today&apos;s Focus <span className="count">· 4 of 12</span></div>
      </div>
      <div className="rail-list" style={{ flexDirection: "row", overflowX: "auto", padding: "4px 16px 8px", margin: "0 -16px" }}>
        {TASKS.map((t, i) => (
          <div key={i} style={{ flex: "0 0 75%", scrollSnapAlign: "start" }}>
            <div className="quickie" style={{ gridTemplateColumns: "1fr" }}>
              <div>
                <div className="quickie-who">{t.name}</div>
                <div className="quickie-meta"><span>{t.project} · {t.percent}%</span></div>
                <div className="task-progress" style={{ marginTop: 8 }}><span style={{ width: `${t.percent}%` }} /></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
