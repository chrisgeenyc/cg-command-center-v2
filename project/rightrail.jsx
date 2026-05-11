// Right rail — Quickies (top, with rel/touch/temp dimensions) + Tasks (bottom), 50/50 split
const { Icon } = window;

const channelIcon = (ch) => ({
  email: "mail", linkedin: "linkedin", text: "text", call: "phone",
}[ch] || "mail");

// Relationship type → tonal color cue (very subtle dot only)
const REL_LABEL = { active: "active", past: "past", partner: "partner", network: "network", mentor: "mentor" };
const TOUCH_LABEL = { value: "value drop", checkin: "check-in", ask: "ask" };
const TEMP_LABEL = { warm: "warm", cooling: "cooling", cold: "cold" };

const QuickieChips = ({ q, compact = false }) => (
  <div className={`q-chips ${compact ? "compact" : ""}`}>
    {q.rel   && <span className={`q-chip rel rel-${q.rel}`}>{REL_LABEL[q.rel]}</span>}
    {q.touch && <span className={`q-chip touch touch-${q.touch}`}>{TOUCH_LABEL[q.touch]}</span>}
    {q.temp  && <span className={`q-chip temp temp-${q.temp}`}><span className="q-chip-dot" />{TEMP_LABEL[q.temp]}</span>}
  </div>
);

window.QuickieChips = QuickieChips;

const Quickie = ({ q, onToggle, tints }) => (
  <div className={`quickie ${tints ? `tinted-${q.tint}` : ""} ${q.done ? "done" : ""}`}>
    <button className={`check ${q.done ? "checked" : ""}`} onClick={onToggle} aria-label="Mark done">
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
    <div className="quickie-channel" title={q.channel}>
      <Icon name={channelIcon(q.channel)} size={12} />
    </div>
  </div>
);

const QuickiesHalf = ({ tints }) => {
  const [list, setList] = React.useState(window.CG_DATA.QUICKIES);
  const toggle = (i) => setList(L => L.map((q, j) => j === i ? { ...q, done: !q.done } : q));
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
};

const Task = ({ t }) => (
  <div className="task">
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
);

const TasksHalf = () => {
  const tasks = window.CG_DATA.TASKS;
  return (
    <div className="rail-half bottom">
      <div className="rail-head">
        <div className="rail-title">
          Today's Focus <span className="count">· {tasks.length} of 12</span>
        </div>
        <a className="section-action" href="#" style={{ marginLeft: "auto", fontSize: 11 }}>view all →</a>
      </div>
      <div className="rail-list" style={{ overflowY: "auto" }}>
        {tasks.map((t, i) => <Task key={i} t={t} />)}
      </div>
    </div>
  );
};

const RightRail = ({ tints }) => (
  <aside className="rail" data-screen-label="Right Rail">
    <QuickiesHalf tints={tints} />
    <div className="rail-divider" />
    <TasksHalf />
  </aside>
);

// Sharisse's right rail — single panel: "Quickies suggested for Chris"
// She can spot relationship moments and one-click promote them to his queue.
// She never sees the relationship data itself — only the action she's offering.
const CollabRail = () => {
  const { SHARISSE_QUICKIES_SUGGESTED } = window.CG_DATA;
  const [promoted, setPromoted] = React.useState({});
  return (
    <aside className="rail collab-rail" data-screen-label="Collaborator Rail">
      <div className="rail-half" style={{ flex: 1 }}>
        <div className="rail-head">
          <div className="rail-title">
            Suggested for Chris <span className="count">· {SHARISSE_QUICKIES_SUGGESTED.length} spotted</span>
          </div>
        </div>
        <div className="suggestion-help">
          Moments you noticed that he should follow up on. Promote sends them to his Quickies queue — you don't see his replies.
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
          <strong>Promoted today · {Object.values(promoted).filter(Boolean).length}</strong> · he'll see them on his next refresh
        </div>
      </div>
    </aside>
  );
};

const MobileQuickieRow = ({ tints }) => {
  const [list, setList] = React.useState(window.CG_DATA.QUICKIES);
  const toggle = (i) => setList(L => L.map((q, j) => j === i ? { ...q, done: !q.done } : q));
  return (
    <div className="mobile-rail">
      <div className="rail-head" style={{ padding: "0 4px" }}>
        <div className="rail-title">Digital Quickies <span className="count">· {list.filter(q=>!q.done).length} open</span></div>
        <button className="rail-add" title="Add Quickie"><Icon name="plus" size={14} /></button>
      </div>
      <div className="rail-list">
        {list.map((q, i) => <Quickie key={i} q={q} tints={tints} onToggle={() => toggle(i)} />)}
      </div>
    </div>
  );
};

const MobileTaskRow = () => (
  <div className="mobile-rail">
    <div className="rail-head" style={{ padding: "0 4px" }}>
      <div className="rail-title">Today's Focus <span className="count">· 4 of 12</span></div>
    </div>
    <div className="rail-list" style={{ flexDirection: "row", overflowX: "auto", padding: "4px 16px 8px", margin: "0 -16px" }}>
      {window.CG_DATA.TASKS.map((t, i) => (
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

window.RightRail = RightRail;
window.CollabRail = CollabRail;
window.MobileQuickieRow = MobileQuickieRow;
window.MobileTaskRow = MobileTaskRow;
