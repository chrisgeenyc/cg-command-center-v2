'use client';
import { useState, useEffect } from 'react';
import Icon from '@/components/Icon';
import { PULSE_CARDS, PULSE_METRICS, PULSE_SAVED_CUES, PULSE_QUEUE, PULSE_ARCHIVE_COUNT, PulseCard, SavedCue, QueueSlot } from '@/lib/data';

interface BufferUpdate {
  id: string;
  text?: string;
  scheduled_at?: string;
  status?: string;
}

interface BufferSnapshot {
  queue: BufferUpdate[];
  sent: BufferUpdate[];
  profiles: unknown[];
  synced_at?: string;
}

interface BriefingStory {
  id: string;
  brief_type: string;
  section: string;
  headline: string;
  url: string;
  publication: string;
  published_date: string;
  summary: string;
}

interface BriefingsData {
  'ai-comms': BriefingStory[];
  'ai-jobs': BriefingStory[];
}

function mapBufferQueue(snapshot: BufferSnapshot): QueueSlot[] {
  const slots: QueueSlot[] = [];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  snapshot.queue.slice(0, 5).forEach((u, i) => {
    const date = u.scheduled_at ? new Date(u.scheduled_at) : null;
    const slot = date
      ? `${days[date.getDay()]} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
      : `Slot ${i + 1}`;
    const title = u.text ? (u.text.length > 60 ? u.text.slice(0, 57) + '…' : u.text) : '—';
    slots.push({ id: u.id ?? String(i), slot, title, status: 'scheduled' });
  });
  // Pad to 5 open slots
  while (slots.length < 5) {
    slots.push({ id: `open-${slots.length}`, slot: '—', title: '—', status: 'open' });
  }
  return slots;
}

const stanceClass = (s: string) => s === "contrarian" ? "stance-contrarian" : "stance-standard";
const stanceLabel = (s: string) => s === "contrarian" ? "Contrarian take" : "Standard take";

const draftPreview = (d: string) => {
  const firstLine = d.split("\n").find(l => l.trim().length > 0) || "";
  return firstLine.length > 130 ? firstLine.slice(0, 127) + "…" : firstLine;
};

const wordCount = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;

const ago = (iso: string) => {
  const ms = Date.now() - new Date(iso).getTime();
  const h = Math.round(ms / 36e5);
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
};

function PulseCardFull({ card, defaultExpanded = false }: { card: PulseCard; defaultExpanded?: boolean }) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [copied, setCopied] = useState(false);
  const [stance, setStance] = useState(card.stance);
  const [saved, setSaved] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [sent, setSent] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Editable draft — initialized from the static card content, mutated locally.
  // Persistence lands with the Supabase wiring sprint.
  const [draft, setDraft] = useState(card.draft);
  const edited = draft !== card.draft;

  const copyDraft = () => {
    navigator.clipboard?.writeText(draft).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  const flip = () => setStance(s => s === "contrarian" ? "standard" : "contrarian");

  // Save as cue → open Buffer's compose URL pre-filled with the (possibly edited)
  // draft + source link. Uses Buffer's classic /add endpoint, which still routes
  // to the right compose flow whether the user is on Buffer Publish or buffer.com.
  const save = () => {
    const text = encodeURIComponent(draft);
    const url = encodeURIComponent(card.sourceUrl);
    const bufferUrl = `https://buffer.com/add?text=${text}&url=${url}`;
    window.open(bufferUrl, "_blank", "noopener,noreferrer");
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  // Regenerate, Send to contact, Dismiss — visual feedback now,
  // real backends arrive with the Supabase/Buffer wiring sprint.
  const regenerate = () => {
    setRegenerating(true);
    setTimeout(() => setRegenerating(false), 1400);
  };
  const sendToContact = () => {
    setSent(true);
    setTimeout(() => setSent(false), 1800);
  };
  const dismiss = () => {
    setDismissed(true);
  };

  if (dismissed) {
    return (
      <article className="pulse-card pulse-dismissed">
        <span className="pulse-source">Dismissed · {card.headline.slice(0, 60)}…</span>
        <button className="btn-quiet" onClick={() => setDismissed(false)}>Undo</button>
      </article>
    );
  }

  return (
    <article className={`pulse-card ${stanceClass(stance)}`}>
      <div className="pulse-edge" />
      <div className="pulse-head">
        <div className="pulse-meta">
          <span className="pulse-source">{card.source}</span>
          <span className="pulse-sep">·</span>
          <span>{ago(card.publishedAt)}</span>
        </div>
        <span className={`pulse-stance ${stanceClass(stance)}`}>
          <span className="stance-dot" />{stanceLabel(stance)}
        </span>
      </div>

      <h3 className="pulse-headline">{card.headline}</h3>
      <p className="pulse-summary">{card.summary}</p>
      <div className="pulse-why">
        <span className="why-tag">Why it matters</span>
        <span>{card.whyItMatters}</span>
      </div>

      <button className="pulse-draft-toggle" onClick={() => setExpanded(e => !e)}>
        <span className="draft-label">
          DRAFT · {wordCount(draft)} words{edited ? " · edited" : ""}
        </span>
        <span className="draft-preview">{draftPreview(draft)}</span>
        <Icon name={expanded ? "x" : "arrow-right"} size={13} className="draft-chev" />
      </button>

      {expanded && (
        <div className="pulse-draft-body pulse-draft-edit">
          <textarea
            className="pulse-draft-textarea"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            spellCheck
            aria-label="Edit the LinkedIn draft"
          />
          <div className="pulse-draft-hint">
            {edited
              ? "Edited locally. ‘Save as cue’ opens Buffer with your changes."
              : "Edit any line. ‘Save as cue’ opens Buffer pre-filled with the result."}
          </div>
        </div>
      )}

      <div className="pulse-actions">
        <button className="btn-primary pulse-post" onClick={save}>
          <Icon name={saved ? "check" : "plus"} size={14} /> {saved ? "Saved as cue" : "Save as cue"}
        </button>
        <button className="btn-quiet" onClick={copyDraft}>
          <Icon name={copied ? "check" : "copy"} size={14} /> {copied ? "Copied" : "Copy"}
        </button>
        <button className="btn-quiet" onClick={regenerate} disabled={regenerating}>
          <Icon name="refresh" size={14} /> {regenerating ? "Regenerating…" : "Regenerate"}
        </button>
        <button className="btn-quiet flip" onClick={flip}><Icon name="shuffle" size={14} /> Flip stance</button>
        <button className="btn-quiet" onClick={sendToContact}>
          <Icon name={sent ? "check" : "user"} size={14} /> {sent ? "Quickie queued" : "Send to contact"}
        </button>
        <a className="btn-quiet ghost" href={card.sourceUrl} target="_blank" rel="noreferrer">
          Read source <Icon name="arrow-right" size={12} />
        </a>
        <button className="btn-quiet pulse-dismiss" onClick={dismiss} aria-label="Dismiss"><Icon name="x" size={14} /></button>
      </div>
    </article>
  );
}

function PulseQueueStrip({ queue }: { queue: QueueSlot[] }) {
  const filled = queue.filter(s => s.status === 'scheduled').length;
  return (
    <div className="pulse-queue">
      <div className="pulse-queue-head">
        <span className="pulse-queue-title">This week&apos;s Buffer queue</span>
        <span className="pulse-queue-sub">{filled} of {queue.length} slots filled · LinkedIn personal · 9:00 AM ET</span>
        <span style={{ marginLeft: "auto", fontSize: 11.5, color: "var(--ink-3)" }}>
          <Icon name="settings" size={11} /> manage in Settings
        </span>
      </div>
      <div className="pulse-queue-grid">
        {queue.map(s => (
          <div key={s.id} className={`pulse-queue-cell ${s.status}`}>
            <div className="pulse-queue-slot">{s.slot}</div>
            <div className="pulse-queue-title-line">{s.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SavedCueCard({ cue }: { cue: SavedCue }) {
  const [expanded, setExpanded] = useState(false);
  const [tab, setTab] = useState("draft");
  const [stance, setStance] = useState(cue.stance);
  const [hook, setHook] = useState(cue.hook);
  const [body, setBody] = useState(cue.body);
  const [cta, setCta] = useState(cue.cta);
  const [note, setNote] = useState(cue.note);
  const [status, setStatus] = useState(cue.queueSlot ? "queued" : "draft");
  const [confirmPost, setConfirmPost] = useState(false);

  const wc = wordCount(`${hook}\n${body}\n${cta}`);
  const expiringSoon = cue.expiresIn <= 10;
  const previewParas = `${hook}\n\n${body}\n\n${cta}`.split(/\n\n+/).filter(Boolean);

  const queue = () => setStatus("queued");
  const postNow = () => { setConfirmPost(false); setStatus("posted"); };

  return (
    <div className={`cue-card ${expanded ? "expanded" : ""}`}>
      <button className="cue-summary" onClick={() => setExpanded(e => !e)}>
        <span className={`cue-stance-pill ${stance}`}>{stance === "contrarian" ? "Contrarian" : "Standard"}</span>
        <div className="cue-summary-body">
          <div className="cue-summary-headline">{cue.headline}</div>
          <div className="cue-summary-meta">
            <span>{cue.source}</span>
            <span className="dot-sep">·</span>
            <span>saved {cue.savedAt}</span>
            <span className="dot-sep">·</span>
            <span>{wc} words</span>
            {status === "queued" && <><span className="dot-sep">·</span><span className="queued">queued · {cue.queueSlot || "next slot"}</span></>}
            {status !== "queued" && status !== "posted" && (
              <><span className="dot-sep">·</span><span className={`expires ${expiringSoon ? "urgent" : ""}`}>auto-archive in {cue.expiresIn}d</span></>
            )}
            {status === "posted" && <><span className="dot-sep">·</span><span className="queued">✓ posted</span></>}
          </div>
        </div>
        <span className="cue-word-count">{wc}w</span>
        <span className="cue-expand-icon">{expanded ? "−" : "+"}</span>
      </button>

      {expanded && (
        <div className="cue-editor">
          <div className="cue-editor-tabs">
            {["draft", "preview", "history"].map(t => (
              <button key={t} className={`cue-tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
                {t === "draft" ? "Edit" : t === "preview" ? "Preview" : "History"}
                {t === "history" && <span className="tab-count">3</span>}
              </button>
            ))}
            <span style={{ marginLeft: "auto", fontSize: 11.5, color: "var(--ink-3)", display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span className={`cue-stance-pill ${stance}`} style={{ cursor: "pointer" }}
                    onClick={() => setStance(s => s === "contrarian" ? "standard" : "contrarian")}>
                {stance}
              </span>
            </span>
          </div>

          {tab === "draft" && (
            <div className="cue-editor-body">
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div className="cue-edit-field">
                  <label className="cue-edit-label">Hook · first line</label>
                  <input className="cue-input" value={hook} onChange={e => setHook(e.target.value)} />
                </div>
                <div className="cue-edit-field">
                  <label className="cue-edit-label">Body · markdown</label>
                  <textarea className="cue-textarea body" value={body} onChange={e => setBody(e.target.value)} />
                </div>
                <div className="cue-edit-field">
                  <label className="cue-edit-label">Closing question / CTA</label>
                  <input className="cue-input" value={cta} onChange={e => setCta(e.target.value)} />
                </div>
                <div className="cue-edit-field">
                  <label className="cue-edit-label">Editor&apos;s note (private)</label>
                  <textarea className="cue-textarea note" placeholder="What you want to remember to fix before posting…" value={note} onChange={e => setNote(e.target.value)} />
                </div>
              </div>
              <div className="cue-edit-field">
                <label className="cue-edit-label">Live preview · LinkedIn render</label>
                <div className="cue-preview">
                  <div className="cue-preview-head">
                    <span className="li-mark">in</span>
                    <span>Chris Gee · Founder, TIC · 1m</span>
                  </div>
                  <div className="cue-preview-hook">{hook}</div>
                  {body.split(/\n\n+/).filter(Boolean).map((p, i) => <p key={i}>{p}</p>)}
                  <div className="cue-preview-cta">{cta}</div>
                </div>
              </div>
            </div>
          )}

          {tab === "preview" && (
            <div className="cue-preview" style={{ maxWidth: 540, margin: "0 auto" }}>
              <div className="cue-preview-head">
                <span className="li-mark">in</span>
                <span>Chris Gee · Founder, TIC · 1m</span>
              </div>
              <div className="cue-preview-hook">{hook}</div>
              {previewParas.slice(1, -1).map((p, i) => <p key={i}>{p}</p>)}
              <div className="cue-preview-cta">{cta}</div>
            </div>
          )}

          {tab === "history" && (
            <div style={{ padding: "8px 0", fontSize: 12.5, color: "var(--ink-3)" }}>
              <div style={{ padding: "8px 0", borderBottom: "1px dashed var(--hairline)" }}>
                <strong style={{ color: "var(--ink-2)", fontWeight: 500 }}>v3 · current</strong> · {cue.savedAt} · sharpened the open
              </div>
              <div style={{ padding: "8px 0", borderBottom: "1px dashed var(--hairline)" }}>
                <strong style={{ color: "var(--ink-2)", fontWeight: 500 }}>v2</strong> · 3 days ago · trimmed 40 words · <a href="#" style={{ color: "var(--violet-1)" }}>revert</a>
              </div>
              <div style={{ padding: "8px 0" }}>
                <strong style={{ color: "var(--ink-2)", fontWeight: 500 }}>v1 · auto-generated</strong> · {cue.savedAt} · <a href="#" style={{ color: "var(--violet-1)" }}>revert</a>
              </div>
            </div>
          )}

          <div className="cue-editor-actions">
            <button className="cue-action"><Icon name="refresh" size={12} /> Regenerate</button>
            <button className="cue-action" onClick={() => setStance(s => s === "contrarian" ? "standard" : "contrarian")}><Icon name="shuffle" size={12} /> Flip stance</button>
            <button className="cue-action"><Icon name="user" size={12} /> Send to contact</button>
            <span className="filler" />
            <span className="cue-word-count">{wc} words · LinkedIn cap 3000</span>
            <button className="cue-action danger"><Icon name="x" size={12} /> Delete</button>
            <button className="cue-action queue" onClick={queue}>
              <Icon name="calendar" size={12} /> {status === "queued" ? "Re-queue" : "Queue · Buffer"}
            </button>
            <button className="cue-action post-now" onClick={() => setConfirmPost(true)}>
              <Icon name="zap" size={12} /> Post now
            </button>
          </div>
        </div>
      )}

      {confirmPost && (
        <div className="cue-modal-veil" onClick={() => setConfirmPost(false)}>
          <div className="cue-modal" onClick={e => e.stopPropagation()}>
            <h4>Post immediately to LinkedIn?</h4>
            <p>This sends the draft to <strong>Buffer · Add to Queue</strong> with the instant-publish flag. There&apos;s no undo once it&apos;s live.</p>
            <div className="cue-modal-actions">
              <button className="cue-action" onClick={() => setConfirmPost(false)}>Keep editing</button>
              <button className="cue-action queue" onClick={queue}>Queue instead</button>
              <button className="cue-action post-now" onClick={postNow}>Post now</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BriefingCard({ story }: { story: BriefingStory }) {
  const sectionLabel =
    story.section === 'displacement' ? 'Job Displacement' :
    story.section === 'legislation' ? 'Legislation' :
    story.section === 'organizing' ? 'Labor Organizing' : null;

  return (
    <article className="pulse-card">
      <div className="pulse-edge" />
      <div className="pulse-head">
        <div className="pulse-meta">
          <span className="pulse-source">{story.publication}</span>
          {story.published_date && <><span className="pulse-sep">·</span><span>{story.published_date}</span></>}
        </div>
        {sectionLabel && (
          <span style={{ fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 20, background: 'var(--surface-2, #f5f5f5)', color: 'var(--ink-2)' }}>
            {sectionLabel}
          </span>
        )}
      </div>
      <h3 className="pulse-headline">
        <a href={story.url} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
          {story.headline}
        </a>
      </h3>
      <p className="pulse-summary">{story.summary}</p>
    </article>
  );
}

export function TodayPulseModule({ navigate }: { navigate?: (id: string) => void }) {
  const card = PULSE_CARDS.find(c => c.stance === "contrarian") || PULSE_CARDS[0];
  return (
    <section className="section pulse-today">
      <div className="section-head">
        <span className="section-dot" style={{ background: "var(--violet-1)" }} />
        <h3 className="section-title">Today&apos;s Pulse</h3>
        <span className="section-count">1 of 5 stories</span>
        <a className="section-action" href="#" onClick={e => { e.preventDefault(); navigate?.("pulse"); }}>
          See all in Pulse <Icon name="arrow-right" size={12} />
        </a>
      </div>
      <PulseCardFull card={card} defaultExpanded={false} />
    </section>
  );
}

export default function PulsePage() {
  const [filter, setFilter] = useState("all");
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [liveBuffer, setLiveBuffer] = useState<BufferSnapshot | null>(null);
  const [liveStories, setLiveStories] = useState<BriefingsData>({ 'ai-comms': [], 'ai-jobs': [] });

  useEffect(() => {
    fetch('/api/buffer')
      .then(r => r.json())
      .then((d: BufferSnapshot) => { if (d.queue?.length || d.sent?.length) setLiveBuffer(d); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch('/api/briefings')
      .then(r => r.json())
      .then((d: BriefingsData) => { if (d['ai-comms'] || d['ai-jobs']) setLiveStories(d); })
      .catch(() => {});
  }, []);

  const queue = liveBuffer ? mapBufferQueue(liveBuffer) : PULSE_QUEUE;

  const allStories = [...liveStories['ai-comms'], ...liveStories['ai-jobs']];

  const filters = [
    { id: "all", label: "Today's stories", count: allStories.length },
    { id: "ai-comms", label: "AI + Comms", count: liveStories['ai-comms'].length },
    { id: "ai-jobs", label: "AI + Jobs", count: liveStories['ai-jobs'].length },
    { id: "saved", label: "Saved cues", count: PULSE_SAVED_CUES.length },
    { id: "posted", label: "Posted today", count: 0 },
  ];

  return (
    <main className="main">
      <header className="page-head">
        <div>
          <p className="page-eyebrow">Pulse · Voice machine</p>
          <h1 className="page-title">What&apos;s happening, and <em>what&apos;s your take?</em></h1>
          <p className="page-sub">5 fresh stories at the intersection of AI + Comms — each with a draft in your voice. Refreshed at 6:42 AM. Save the keepers as cues, manicure them, then queue or post when ready.</p>
        </div>
        <div className="page-head-actions">
          <button className="export-btn"><Icon name="refresh" size={15} /> Refresh now</button>
        </div>
      </header>

      <div className="metrics">
        {PULSE_METRICS.map((m, i) => (
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
                background: m.subDot === "risk" ? "var(--dot-risk)" :
                            m.subDot === "healthy" ? "var(--dot-healthy)" : "var(--dot-stale)"
              }} />
              {m.sub}
            </div>
          </div>
        ))}
      </div>

      <PulseQueueStrip queue={queue} />

      <div className="filter-bar">
        {filters.map(f => (
          <button key={f.id} className={`chip ${filter === f.id ? "active" : ""}`}
                  onClick={() => setFilter(f.id)}>
            {f.label} <span className="chip-count">{f.count}</span>
          </button>
        ))}
      </div>

      {filter === "saved" ? (
        <section className="cues-section">
          <div className="section-head">
            <span className="section-dot" style={{ background: "var(--violet-1)" }} />
            <h3 className="section-title">Saved cues</h3>
            <span className="section-count">{PULSE_SAVED_CUES.length} parked · click to manicure</span>
          </div>
          <div className="cues-list">
            {PULSE_SAVED_CUES.map(c => <SavedCueCard key={c.id} cue={c} />)}
          </div>
        </section>
      ) : filter === "posted" ? (
        <div style={{ background: "var(--surface)", border: "1px solid var(--hairline)", borderRadius: "var(--r-md)", padding: 28, textAlign: "center", color: "var(--ink-3)", fontSize: 13.5 }}>
          Nothing posted today yet. The week&apos;s ahead of plan — 3 of 5 slots filled.
        </div>
      ) : (
        <div className="pulse-stack">
          {(() => {
            const stories = filter === "ai-comms" ? liveStories['ai-comms']
              : filter === "ai-jobs" ? liveStories['ai-jobs']
              : allStories;
            return stories.length > 0
              ? stories.map(s => <BriefingCard key={s.id} story={s} />)
              : <div style={{ padding: 28, textAlign: 'center', color: 'var(--ink-3)', fontSize: 13.5 }}>No stories yet — run the morning sync to fetch today&apos;s briefing.</div>;
          })()}
        </div>
      )}

      <div className="pulse-archive">
        <button className="archive-toggle" onClick={() => setArchiveOpen(o => !o)}>
          <Icon name={archiveOpen ? "x" : "archive"} size={14} />
          <span>Archive — <strong>{PULSE_ARCHIVE_COUNT}</strong> posts shipped from Pulse in the last 30 days</span>
          <span className="archive-chev">{archiveOpen ? "—" : "+"}</span>
        </button>
        {archiveOpen && (
          <div className="archive-grid">
            <div className="archive-cell"><div className="archive-day">Apr 23</div><div className="archive-title">Edelman trust barometer take</div></div>
            <div className="archive-cell"><div className="archive-day">Apr 22</div><div className="archive-title">AI Overviews &amp; owned media</div></div>
            <div className="archive-cell"><div className="archive-day">Apr 21</div><div className="archive-title">Why &quot;AI ethicist&quot; is the new title</div></div>
            <div className="archive-cell"><div className="archive-day">Apr 19</div><div className="archive-title">FTC&apos;s first agentic-AI letter</div></div>
            <div className="archive-cell muted"><div className="archive-day">+ 43</div><div className="archive-title">more</div></div>
          </div>
        )}
      </div>
    </main>
  );
}
