// Notes — "What was I thinking?"
const { Icon } = window;

const FILTERS = [
  { id: "today",     label: "Today",      count: 1 },
  { id: "week",      label: "This week",  count: 3 },
  { id: "pinned",    label: "Pinned",     count: 1 },
  { id: "all",       label: "All notes",  count: 6 },
];

const PROJECT_FILTERS = [
  { id: "p-retreat",  label: "AI Leadership Retreat", count: 1 },
  { id: "p-coursera", label: "Coursera Wk 6–10",      count: 1 },
  { id: "p-tegna",    label: "Tegna AI-in-PR",        count: 1 },
  { id: "p-fenton",   label: "Fenton Retainer",       count: 1 },
];

function renderMarkdown(body) {
  // tiny markdown — bold, italic, lists, paragraphs. Avoids dangerouslySetInnerHTML on raw user input.
  const blocks = body.split(/\n\n+/);
  return blocks.map((block, i) => {
    if (block.match(/^[-*]\s/m)) {
      const items = block.split(/\n/).filter(l => l.trim()).map(l => l.replace(/^[-*]\s+/, ""));
      return <ul key={i}>{items.map((t, j) => <li key={j}>{inline(t)}</li>)}</ul>;
    }
    if (block.match(/^\d+\.\s/m)) {
      const items = block.split(/\n/).filter(l => l.trim()).map(l => l.replace(/^\d+\.\s+/, ""));
      return <ol key={i} style={{ paddingLeft: 22 }}>{items.map((t, j) => <li key={j} style={{ marginBottom: 6 }}>{inline(t)}</li>)}</ol>;
    }
    return <p key={i}>{inline(block)}</p>;
  });
}
function inline(text) {
  // **bold** *italic*
  const parts = [];
  let rest = text;
  let key = 0;
  const re = /\*\*([^*]+)\*\*|\*([^*]+)\*/;
  while (rest.length) {
    const m = rest.match(re);
    if (!m) { parts.push(<React.Fragment key={key++}>{rest}</React.Fragment>); break; }
    if (m.index > 0) parts.push(<React.Fragment key={key++}>{rest.slice(0, m.index)}</React.Fragment>);
    if (m[1]) parts.push(<strong key={key++}>{m[1]}</strong>);
    else      parts.push(<em key={key++}>{m[2]}</em>);
    rest = rest.slice(m.index + m[0].length);
  }
  return parts;
}

function NoteRow({ note, active, onClick }) {
  return (
    <div className={`note-row ${active ? "active" : ""}`} onClick={onClick}>
      <div className="note-title">
        {note.pinned && <Icon name="pin" size={11} className="note-pin" />}
        {note.title}
      </div>
      <div className="note-preview">{note.preview}</div>
      <div className="note-meta">
        <span>{note.edited}</span>
        {note.links.length === 0 && <span style={{ color: "var(--blocked-fg)" }}>· untagged</span>}
        {note.links.slice(0, 2).map((l, i) => (
          <span key={i} className={`link-chip ${l.type}`}>{l.label}</span>
        ))}
      </div>
    </div>
  );
}

function NotesPage({ isMobile }) {
  const { NOTES } = window.CG_DATA;
  const [activeId, setActiveId] = React.useState(NOTES[0].id);
  const [filter, setFilter] = React.useState("week");
  const note = NOTES.find(n => n.id === activeId) || NOTES[0];
  const untaggedCount = NOTES.filter(n => n.links.length === 0).length;

  return (
    <main className="main main-full" data-screen-label="Notes">
      <header className="page-head">
        <div>
          <h1 className="greeting">Notes.</h1>
          <p className="greeting-sub">Linked thoughts. A note unlinked to anything is a smell, not an error.</p>
        </div>
        <div className="date-stamp">
          <strong>6 notes · 1 untagged</strong>
          <span className="muted">⌘N FROM ANYWHERE · ⌘F TO SEARCH</span>
        </div>
      </header>

      <div className="notes-shell">
        {/* LEFT — list + filters + quick capture */}
        <aside className="notes-list">
          <div className="notes-quickcap">
            <Icon name="plus" size={14} />
            <input placeholder="Capture a note… (Enter to save)" />
          </div>
          <div className="notes-filters">
            {FILTERS.map(f => (
              <div key={f.id}
                   className={`notes-filter ${filter === f.id ? "active" : ""}`}
                   onClick={() => setFilter(f.id)}>
                <span>{f.label}</span>
                <span className="nf-count">{f.count}</span>
              </div>
            ))}
            <div className="notes-filter untagged"
                 onClick={() => setFilter("untagged")}>
              <span><Icon name="alert" size={11} /> Untagged</span>
              <span className="nf-count">{untaggedCount}</span>
            </div>
            <div style={{ height: 1, background: "var(--hairline)", margin: "8px 8px" }} />
            <div style={{ fontSize: 10.5, letterSpacing: "0.15em", textTransform: "uppercase",
                          color: "var(--ink-4)", padding: "4px 10px", fontWeight: 500 }}>
              By project
            </div>
            {PROJECT_FILTERS.map(f => (
              <div key={f.id} className="notes-filter">
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <span className="link-chip project" style={{ width: 8, height: 8, borderRadius: "50%", padding: 0 }}></span>
                  {f.label}
                </span>
                <span className="nf-count">{f.count}</span>
              </div>
            ))}
          </div>
          <div className="notes-rows">
            {NOTES.map(n => (
              <NoteRow key={n.id} note={n}
                       active={n.id === activeId}
                       onClick={() => setActiveId(n.id)} />
            ))}
          </div>
        </aside>

        {/* RIGHT — editor */}
        <section className="notes-editor">
          <div className="notes-editor-head">
            <div className="notes-editor-title">{note.title}</div>
            <div className="notes-editor-tools">
              <button className="icon-btn" title="Pin"><Icon name="pin" size={14} /></button>
              <button className="icon-btn" title="More"><Icon name="more" size={14} /></button>
            </div>
          </div>
          <div className="notes-link-bar">
            <span style={{ marginRight: 4 }}>Linked to</span>
            {note.links.length > 0 ? note.links.map((l, i) => (
              <span key={i} className={`link-chip ${l.type}`}>
                <Icon name={l.type === "project" ? "grid" : l.type === "contact" ? "user" : "calendar"} size={10} />
                {l.label}
              </span>
            )) : (
              <span style={{ color: "var(--blocked-fg)", fontSize: 11.5 }}>nothing yet — link a project or contact to anchor this note</span>
            )}
            <button className="add-link">+ link</button>
            <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: 11 }}>edited {note.edited}</span>
          </div>
          <div className="notes-body">
            {renderMarkdown(note.body)}
          </div>
        </section>
      </div>
    </main>
  );
}

window.NotesPage = NotesPage;
