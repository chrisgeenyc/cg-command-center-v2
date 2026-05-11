// Settings — "How is this configured?"
const { Icon } = window;

const SECTIONS = [
  { id: "profile",    label: "Profile" },
  { id: "team",       label: "Team" },
  { id: "display",    label: "Display" },
  { id: "briefing",   label: "Morning briefing" },
  { id: "goals",      label: "Goals" },
  { id: "connectors", label: "Connectors" },
  { id: "data",       label: "Data" },
  { id: "about",      label: "About" },
  { id: "danger",     label: "Danger zone" },
];

function Field({ label, help, children }) {
  return (
    <div className="field">
      <div>
        <div className="field-label">{label}</div>
        {help && <div className="field-help">{help}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
}

function Toggle({ on, onClick }) {
  return <div className={`toggle ${on ? "on" : ""}`} onClick={onClick} role="switch" aria-checked={on} />;
}

function Profile() {
  return (
    <section className="settings-section" id="profile">
      <h3>Profile</h3>
      <p className="section-help">Your account. Team collaboration lives one section down.</p>
      <Field label="Name"><input className="field-input" defaultValue="Chris Gee" /></Field>
      <Field label="Role"><input className="field-input" defaultValue="Operator · Brooklyn, NY" /></Field>
      <Field label="Email"><input className="field-input" defaultValue="chris@command.cg" type="email" /></Field>
      <Field label="Avatar" help="Square PNG, 512px or larger.">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div className="user-avatar" style={{ width: 44, height: 44, fontSize: 14 }}>CG</div>
          <button className="connector-action">Replace</button>
        </div>
      </Field>
    </section>
  );
}

function Team() {
  const { TEAM_MEMBERS } = window.CG_DATA;
  return (
    <section className="settings-section" id="team">
      <h3>Team</h3>
      <p className="section-help">
        Command.cg is single-operator at the core, but you can invite a Collaborator who sees a service-mode
        view of Today — tasks assigned to them, what they're waiting on you for, and a "suggest a Quickie"
        affordance. They never see your inbox, deal values, or relationship notes.
      </p>
      <div className="team-table">
        <div className="team-row team-head">
          <div>Person</div>
          <div>Role</div>
          <div>Default view</div>
          <div></div>
        </div>
        {TEAM_MEMBERS.map((m, i) => (
          <div key={i} className="team-row">
            <div className="team-person">
              <div className="user-avatar" data-persona={m.role === "Operator" ? "operator" : "collab"}
                   style={{ width: 32, height: 32, fontSize: 11 }}>{m.avatar}</div>
              <div>
                <div className="team-name">{m.name} {m.you && <span className="team-you">you</span>}</div>
                <div className="team-email">{m.email}</div>
              </div>
            </div>
            <div><span className={`role-pill role-${m.role.toLowerCase()}`}>{m.role}</span></div>
            <div className="team-view">{m.defaultView}</div>
            <div style={{ textAlign: "right" }}>
              {m.you
                ? <span style={{ fontSize: 11, color: "var(--ink-4)", fontFamily: "var(--font-mono)" }}>OWNER</span>
                : <button className="connector-action">Manage</button>}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 14 }}>
        <button className="connector-action primary"><Icon name="plus" size={13} /> Invite collaborator</button>
        <span style={{ fontSize: 11.5, color: "var(--ink-3)" }}>
          Collaborators see Today (their tasks, their pulse), Projects, and Notes. Pipeline + Quickies stay private.
        </span>
      </div>

      <Field label="What collaborators can see" help="Toggle visibility of specific Today modules in the collaborator view.">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            ["Tasks assigned to them", true],
            ["Waiting-on-you list",     true],
            ["Calendar (today's blocks)", true],
            ["Suggested Quickies (one-way promote)", true],
            ["Project status (read-only)", true],
            ["Pipeline / deal values", false],
            ["Pulse signals", false],
            ["Quickies queue", false],
          ].map(([k, v]) => (
            <label key={k} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
              <Toggle on={v} />
              <span style={{ fontSize: 13, color: "var(--ink-2)" }}>{k}</span>
            </label>
          ))}
        </div>
      </Field>
    </section>
  );
}

function Display() {
  const [theme, setTheme] = React.useState("light");
  const [density, setDensity] = React.useState("comfortable");
  return (
    <section className="settings-section" id="display">
      <h3>Display</h3>
      <p className="section-help">How the dashboard renders. Lavender canvas in light, near-black in dark.</p>
      <Field label="Theme">
        <div className="checks">
          {["light", "dark", "auto"].map(o => (
            <button key={o}
                    className={`chip ${theme === o ? "active" : ""}`}
                    onClick={() => setTheme(o)}>{o}</button>
          ))}
        </div>
      </Field>
      <Field label="Density" help="Comfortable (default) keeps generous whitespace. Compact tightens row heights ~20%.">
        <div className="checks">
          {["comfortable", "compact"].map(o => (
            <button key={o}
                    className={`chip ${density === o ? "active" : ""}`}
                    onClick={() => setDensity(o)}>{o}</button>
          ))}
        </div>
      </Field>
      <Field label="Time zone"><input className="field-input" defaultValue="America/New_York (ET)" /></Field>
    </section>
  );
}

function Briefing() {
  const [opts, setOpts] = React.useState({
    Pipeline: true, Projects: true, Quickies: true, Calendar: true, Weekend: false,
  });
  return (
    <section className="settings-section" id="briefing">
      <h3>Morning briefing</h3>
      <p className="section-help">The hook line you read with coffee — refreshed automatically every morning.</p>
      <Field label="Refresh time" help="Defaults to 7:00 AM in your local time zone.">
        <input className="field-input" defaultValue="07:00 AM" />
      </Field>
      <Field label="Include in briefing">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {Object.entries(opts).map(([k, v]) => (
            <label key={k} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
              <Toggle on={v} onClick={() => setOpts({ ...opts, [k]: !v })} />
              <span style={{ fontSize: 13, color: "var(--ink-2)" }}>{k}</span>
            </label>
          ))}
        </div>
      </Field>
    </section>
  );
}

function Goals() {
  return (
    <section className="settings-section" id="goals">
      <h3>Goals</h3>
      <p className="section-help">Numerical anchors that drive the Pipeline sparkline and the Quickies backlog alert.</p>
      <Field label="Quarterly revenue goal" help="Drives the Pipeline 'X% to goal' indicator.">
        <input className="field-input" defaultValue="$150,000" />
      </Field>
      <Field label="Quickies backlog threshold" help="Alert when open Quickies exceeds N.">
        <input className="field-input" defaultValue="12" type="number" style={{ maxWidth: 120 }} />
      </Field>
      <Field label="Silent contact threshold" help="Days untouched before suggesting a Quickie.">
        <input className="field-input" defaultValue="90" type="number" style={{ maxWidth: 120 }} />
      </Field>
    </section>
  );
}

const CONNECTOR_LETTER = { HubSpot: "Hs", Asana: "As", Outlook: "Ot", Slack: "Sl", LinkedIn: "Li", Zapier: "Zp" };

function Connectors() {
  const { CONNECTORS } = window.CG_DATA;
  return (
    <section className="settings-section" id="connectors">
      <h3>Connectors</h3>
      <p className="section-help">MCP integrations that feed Pipeline, Projects, and Quickies. AUTH_USER / AUTH_PASS live in Vercel — not in-app.</p>
      {CONNECTORS.map((c, i) => (
        <div key={i} className="connector-row">
          <div className="connector-icon">{CONNECTOR_LETTER[c.name] || c.name.slice(0, 2)}</div>
          <div>
            <div className="connector-name">{c.name}</div>
            <div className="connector-for">{c.for} · last sync {c.lastSync}</div>
          </div>
          <span className={`connector-status ${c.status}`}>
            <span className="dot" />
            {c.status === "healthy" ? "healthy" : c.status === "risk" ? "stale" : "error"}
          </span>
          {c.status === "blocked"
            ? <button className="connector-action primary">Reconnect</button>
            : <button className="connector-action">Manage</button>}
        </div>
      ))}
    </section>
  );
}

function DataSec() {
  return (
    <section className="settings-section" id="data">
      <h3>Data</h3>
      <p className="section-help">Export the dashboard state as JSON. Reset returns to seeded defaults from <code style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>lib/data.ts</code>.</p>
      <Field label="Export"><button className="connector-action primary">Download command-cg-state.json</button></Field>
      <Field label="Reset"><button className="connector-action">Reset to defaults</button></Field>
    </section>
  );
}

function About() {
  return (
    <section className="settings-section" id="about">
      <h3>About</h3>
      <p className="section-help">Build info and the changelog.</p>
      <Field label="Version"><div style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}>v0.4.2 — calm-operator</div></Field>
      <Field label="Last deploy"><div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--ink-3)" }}>Apr 23, 2026 · 11:42 PM ET</div></Field>
      <Field label="Auth env"><div style={{ fontSize: 12.5, color: "var(--ink-3)" }}>AUTH_USER / AUTH_PASS managed in <a href="#" style={{ color: "var(--violet-1)" }}>Vercel project settings ↗</a></div></Field>
    </section>
  );
}

function Danger() {
  return (
    <section className="settings-section danger-zone" id="danger" style={{ borderColor: "rgba(209,75,67,.25)" }}>
      <h3 style={{ color: "var(--blocked-fg)" }}>Danger zone</h3>
      <p className="section-help">Permanent or near-permanent. Most have undo via toast — but some don't.</p>
      <Field label="Archive done Quickies" help="Moves all 'done' Quickies older than 30 days to long-term archive.">
        <button className="danger-action">Archive 47 Quickies</button>
      </Field>
      <Field label="Sign out" help="Clears local session. Re-auth via Vercel SSO on next visit.">
        <button className="danger-action">Sign out</button>
      </Field>
    </section>
  );
}

function SettingsPage({ isMobile }) {
  const [active, setActive] = React.useState("profile");
  return (
    <main className="main main-full" data-screen-label="Settings">
      <header className="page-head">
        <div>
          <h1 className="greeting">Settings.</h1>
          <p className="greeting-sub">How this is configured. Single-operator scope — no team toggles, no permissions tree.</p>
        </div>
        <div className="date-stamp">
          <strong>v0.4.2 · calm-operator</strong>
          <span className="muted">DEPLOYED APR 23 · 11:42 PM</span>
        </div>
      </header>

      <div className="settings-shell">
        <nav className="settings-nav">
          {SECTIONS.map(s => (
            <button key={s.id}
                    className={`settings-nav-item ${active === s.id ? "active" : ""}`}
                    onClick={() => {
                      setActive(s.id);
                      const el = document.getElementById(s.id);
                      if (el) el.scrollIntoView ? null : null; // avoid scrollIntoView per house rules
                    }}>
              {s.label}
            </button>
          ))}
        </nav>
        <div>
          <Profile />
          <Team />
          <Display />
          <Briefing />
          <Goals />
          <Connectors />
          <DataSec />
          <About />
          <Danger />
        </div>
      </div>
    </main>
  );
}

window.SettingsPage = SettingsPage;
