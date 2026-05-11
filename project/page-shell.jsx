// Shared page primitives — PageHeader + flex Metric strip variants
const { Icon } = window;

function PageHeader({ title, sub, right }) {
  return (
    <header className="page-head">
      <div>
        <h1 className="greeting">{title}</h1>
        <p className="greeting-sub">{sub}</p>
      </div>
      {right && <div className="date-stamp">{right}</div>}
    </header>
  );
}

// Metric strip that takes any list (vs Today's hard-wired METRICS)
function MetricStrip({ items, columns }) {
  const style = columns ? { gridTemplateColumns: `repeat(${columns}, 1fr)` } : null;
  return (
    <div className="metrics" style={style}>
      {items.map((m, i) => (
        <div key={i} className="metric">
          <div className="metric-label">{m.label}</div>
          <div className="metric-value">
            {m.prefix && <span style={{ color: "var(--ink-3)", fontWeight: 500, fontSize: 26 }}>{m.prefix}</span>}
            {m.value}
            {m.unit && <span className="unit">{m.unit}</span>}
            {m.trend && (
              <span className={`metric-trend ${m.trend.dir}`}>
                {m.trend.dir === "up" ? "↑" : m.trend.dir === "down" ? "↓" : "→"} {m.trend.text}
              </span>
            )}
          </div>
          <div className="metric-sub">
            <span className="dot" style={{
              background:
                m.subDot === "risk"    ? "var(--dot-risk)"    :
                m.subDot === "healthy" ? "var(--dot-healthy)" :
                m.subDot === "blocked" ? "var(--dot-blocked)" : "var(--dot-stale)"
            }} />
            {m.sub}
          </div>
        </div>
      ))}
    </div>
  );
}

window.PageHeader = PageHeader;
window.MetricStrip = MetricStrip;
