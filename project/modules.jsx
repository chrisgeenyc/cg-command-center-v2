// Main canvas modules: utility row, header, priority hero, metric strip, lists, two-col
const { Icon } = window;

const UtilityRow = ({ onTheme, theme }) => (
  <div className="utility-row">
    <div className="search">
      <Icon name="search" size={15} />
      <input placeholder="Search projects, contacts, notes…" />
      <span className="kbd">⌘K</span>
    </div>
    <button className="icon-btn" title="Refresh"><Icon name="refresh" size={16} /></button>
    <button className="icon-btn" title="Notifications"><Icon name="bell" size={16} /></button>
    <button className="icon-btn" title="Theme" onClick={onTheme}>
      <Icon name={theme === "dark" ? "sun" : "moon"} size={16} />
    </button>
    <button className="export-btn"><Icon name="export" size={15} /> Export</button>
  </div>
);

const Header = () => {
  const { TODAY_LABEL, HOOK } = window.CG_DATA;
  return (
    <header className="header">
      <div>
        <h1 className="greeting">Good morning, <em>Chris.</em></h1>
        <p className="greeting-sub">{HOOK}</p>
      </div>
      <div className="date-stamp">
        <strong>{TODAY_LABEL}, 2026</strong>
        <span className="muted">06:42 AM ET · MORNING REFRESH</span>
      </div>
    </header>
  );
};

const PriorityCard = ({ style }) => {
  const { PRIORITY } = window.CG_DATA;
  return (
    <section className={`priority ${style}`} data-screen-label="Priority Hero">
      <div className="priority-progress">
        <span className="progress-pill">{PRIORITY.progressLabel}</span>
        <div className="priority-bar"><span style={{ width: `${PRIORITY.percent}%` }} /></div>
      </div>
      <span className="priority-kicker"><span className="pulse" />{PRIORITY.kicker}</span>
      <h2 className="priority-title">{PRIORITY.title}</h2>
      <div className="priority-meta">
        <span><b>Due</b> · today, end of day</span>
        <span><b>Owner</b> · Chris (solo)</span>
        <span><b>Escalation</b> · @sharisse if slipping</span>
      </div>
      <div className="priority-actions">
        <button className="btn-primary"><Icon name="video" size={15} /> Start lesson 5 recording</button>
        <button className="btn-ghost">Open Coursera workspace <Icon name="arrow-right" size={14} /></button>
      </div>
    </section>
  );
};

const Sparkline = () => (
  <svg className="spark" width="68" height="22" viewBox="0 0 68 22" fill="none">
    <path d="M1 18 L10 14 L18 16 L26 10 L34 12 L42 7 L50 9 L58 4 L66 2"
          stroke="#2EA86A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M1 18 L10 14 L18 16 L26 10 L34 12 L42 7 L50 9 L58 4 L66 2 L66 22 L1 22 Z"
          fill="rgba(46,168,106,0.10)" />
  </svg>
);

const Metric = ({ m }) => (
  <div className="metric">
    <div className="metric-label">{m.label}</div>
    <div className="metric-value">
      {m.prefix && <span style={{ color: "var(--ink-3)", fontWeight: 500, fontSize: 26 }}>{m.prefix}</span>}
      {m.value}
      {m.unit && <span className="unit">{m.unit}</span>}
      <span className={`metric-trend ${m.trend.dir}`}>
        {m.trend.dir === "up" ? "↑" : m.trend.dir === "down" ? "↓" : "→"} {m.trend.text}
      </span>
    </div>
    <div className="metric-sub">
      <span className="dot" style={{ background: m.subDot === "risk" ? "var(--dot-risk)" : m.subDot === "healthy" ? "var(--dot-healthy)" : "var(--dot-stale)" }} />
      {m.sub}
    </div>
    {m.spark && <Sparkline />}
  </div>
);

const Metrics = () => (
  <div className="metrics">
    {window.CG_DATA.METRICS.map((m, i) => <Metric key={i} m={m} />)}
  </div>
);

const StatusList = ({ title, items, sectionDot, count, action }) => (
  <section className="section">
    <div className="section-head">
      <span className="section-dot" style={{ background: sectionDot }} />
      <h3 className="section-title">{title}</h3>
      <span className="section-count">{count}</span>
      <a className="section-action" href="#">{action} <Icon name="arrow-right" size={12} /></a>
    </div>
    <div className="list-card">
      {items.map((p, i) => (
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

const Calendar = () => (
  <div className="panel">
    <div className="panel-title">
      <Icon name="calendar" size={14} /> Today's Calendar
      <span className="section-count" style={{ marginLeft: "auto" }}>4 blocks</span>
    </div>
    {window.CG_DATA.CALENDAR.map((c, i) => (
      <div className="cal-item" key={i}>
        <div className="cal-time">{c.time}</div>
        <div>
          <div className="cal-title">{c.title}</div>
          <div className="cal-sub">{c.sub}</div>
        </div>
        <span className={`pill ${
          c.tag === "deadline" ? "risk" :
          c.tag === "client" ? "healthy" :
          c.tag === "focus" ? "stale" : "stale"
        }`}>
          <span className="pill-dot" />{c.tag}
        </span>
      </div>
    ))}
  </div>
);

const Wins = () => (
  <div className="panel">
    <div className="panel-title">
      <span className="section-dot" style={{ background: "var(--dot-healthy)" }} />
      Pipeline — Recent Wins
      <span className="section-count" style={{ marginLeft: "auto" }}>$36K MTD</span>
    </div>
    {window.CG_DATA.WINS.map((w, i) => (
      <div className="win-item" key={i}>
        <div>
          <div className="win-name">{w.name}</div>
          <div className="win-sub">{w.sub}</div>
        </div>
        <div className="win-amount">{w.amount}{w.recur && <span className="recur">{w.recur}</span>}</div>
      </div>
    ))}
  </div>
);

window.UtilityRow = UtilityRow;
window.Header = Header;
window.PriorityCard = PriorityCard;
window.Metrics = Metrics;
window.StatusList = StatusList;
window.Calendar = Calendar;
window.Wins = Wins;
