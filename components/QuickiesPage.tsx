'use client';
import { useState, useEffect } from 'react';
import Icon from '@/components/Icon';
import { PageHeader, MetricStrip } from '@/components/modules';
import {
  QUICKIES_METRICS, QUICKIES_FULL, QUICKIES_DONE_RECENT, QUICKIES_SUGGESTED,
  RELATIONSHIP_OVERVIEW, QuickieItem
} from '@/lib/data';

const CHANNEL_ICON: Record<string, string> = { email: "mail", linkedin: "linkedin", text: "text", call: "phone" };
const TINT_BG: Record<string, string> = {
  yellow: "#FFDE59",
  pink:   "rgba(255, 200, 215, 0.55)",
  blue:   "rgba(195, 220, 255, 0.55)",
  mint:   "rgba(195, 240, 215, 0.55)",
  peach:  "rgba(255, 220, 195, 0.55)",
};

function QuickieRow({ q, tints, onToggle }: { q: QuickieItem; tints: boolean; onToggle: () => void }) {
  const bg = tints ? TINT_BG[q.tint] : "var(--surface)";
  return (
    <div className={`quickie ${q.done ? "done" : ""}`} style={{ background: bg, padding: "14px 16px" }}>
      <button className="quickie-check" onClick={onToggle} aria-label="Toggle done">
        {q.done && <Icon name="check" size={11} />}
      </button>
      <div className="quickie-body">
        <div className="quickie-who">
          {q.who} <span className="quickie-ctx">· {q.ctx}</span>
          {q.pinned && <Icon name="pin" size={11} className="quickie-pin" />}
        </div>
        <div className="quickie-action">{q.action}</div>
        <div className="quickie-meta">
          <Icon name={CHANNEL_ICON[q.channel] || "mail"} size={11} />
          <span>{q.channel}</span>
          <span className="dot-sep">·</span>
          <span>{q.trigger}</span>
        </div>
      </div>
    </div>
  );
}

function RelationshipOverview() {
  return (
    <section className="rel-overview">
      <div className="rel-overview-head">
        <span className="rel-overview-title">Relationship overview</span>
        <span className="rel-overview-sub">By tier × temperature · the cold spots and the value-debt at a glance</span>
      </div>
      <div className="rel-overview-grid">
        <div className="rel-cell rel-head-cell">Tier</div>
        <div className="rel-cell rel-head-cell">Warm</div>
        <div className="rel-cell rel-head-cell">Cooling</div>
        <div className="rel-cell rel-head-cell">Cold</div>
        <div className="rel-cell rel-head-cell right">Hint</div>
        {RELATIONSHIP_OVERVIEW.rows.map(r => (
          <>
            <div key={r.id + "-label"} className="rel-cell rel-row-label">
              {r.label}
              <span className="rel-row-total">· {r.total}</span>
            </div>
            <div className={`rel-cell rel-bucket ${r.warm === 0 ? "zero" : ""}`}>
              <span className="rel-bucket-num">{r.warm}</span>
              <span className="rel-bucket-label">warm</span>
            </div>
            <div className={`rel-cell rel-bucket cooling ${r.cooling === 0 ? "zero" : ""}`}>
              <span className="rel-bucket-num">{r.cooling}</span>
              <span className="rel-bucket-label">cooling</span>
            </div>
            <div className={`rel-cell rel-bucket ${r.cold === 0 ? "zero" : r.cold > 5 ? "cold-strong" : "cold"}`}>
              <span className="rel-bucket-num">{r.cold}</span>
              <span className="rel-bucket-label">cold</span>
            </div>
            <div className={`rel-cell rel-hint ${r.debt > 0 ? "debt" : ""}`}>{r.hint}</div>
          </>
        ))}
      </div>
    </section>
  );
}

interface Suggestion {
  id: string;
  who: string;
  ctx: string;
  daysSilent: number | null;
  reason: string;
}

export default function QuickiesPage({ tints = true }: { tints?: boolean }) {
  const [items, setItems] = useState<(QuickieItem & { id?: string })[]>(QUICKIES_FULL);
  const [filter, setFilter] = useState("all");
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch('/api/quickies')
      .then(r => r.json())
      .then((data: (QuickieItem & { id?: string })[]) => {
        if (Array.isArray(data) && data.length > 0) setItems(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch('/api/quickies/suggested')
      .then(r => r.json())
      .then((d: { suggestions?: Suggestion[] }) => {
        if (Array.isArray(d.suggestions)) setSuggestions(d.suggestions);
      })
      .catch(err => console.error('[Quickies] suggestions fetch failed:', err));
  }, []);

  const addSuggested = async (s: Suggestion) => {
    setAddedIds(prev => new Set(prev).add(s.id));
    try {
      const res = await fetch('/api/quickies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          who: s.who,
          ctx: s.ctx || 'HubSpot contact',
          action: `Reconnect — ${s.reason}. Send a value touch, no ask.`,
          channel: 'email',
          trigger: 'this week',
          tint: 'blue',
          temp: 'cold',
        }),
      });
      const created = await res.json();
      if (created.id) setItems(prev => [{ ...created }, ...prev]);
    } catch (err) {
      console.error('[Quickies] add suggested failed:', err);
      setAddedIds(prev => { const n = new Set(prev); n.delete(s.id); return n; });
    }
  };

  const toggle = (idx: number) => {
    const q = items[idx];
    const newDone = !q.done;
    setItems(items.map((item, i) => i === idx ? { ...item, done: newDone } : item));
    if (q.id) {
      fetch('/api/quickies', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: q.id, done: newDone }),
      }).catch(() => {});
    }
  };

  const channelCounts: Record<string, number> = {};
  items.forEach(q => { channelCounts[q.channel] = (channelCounts[q.channel] || 0) + 1; });

  const filtered = items.filter(q =>
    filter === "all"    ? !q.done :
    filter === "today"  ? !q.done && (q.trigger.includes("today") || q.trigger.includes("Fri") || q.trigger.includes("tomorrow")) :
    filter === "week"   ? !q.done :
    !q.done && q.channel === filter
  );
  const pinned = filtered.filter(q => q.pinned);
  const rest   = filtered.filter(q => !q.pinned);

  return (
    <main className="main main-full">
      <PageHeader
        title={<>Quickies.</>}
        sub="Who you're owing a touch. Don't let a relationship go quiet because the inbox got loud."
        right={<><strong>Apr 24, 2026</strong><span className="muted">8 OPEN · 12 DONE THIS WEEK</span></>}
      />
      <MetricStrip items={QUICKIES_METRICS} columns={3} />

      <RelationshipOverview />

      <div className="chips">
        {[
          { id: "all",   label: "All open",   count: items.filter(q => !q.done).length },
          { id: "today", label: "Due today",  count: 3 },
          { id: "week",  label: "This week",  count: items.filter(q => !q.done).length },
        ].map(c => (
          <button key={c.id}
                  className={`chip ${filter === c.id ? "active" : ""}`}
                  onClick={() => setFilter(c.id)}>
            {c.label} <span className="chip-count">{c.count}</span>
          </button>
        ))}
        <span className="chip-divider" />
        {["email", "linkedin", "text", "call"].map(ch => (
          <button key={ch}
                  className={`chip ${filter === ch ? "active" : ""}`}
                  onClick={() => setFilter(ch)}>
            <Icon name={CHANNEL_ICON[ch]} size={11} /> {ch} <span className="chip-count">{channelCounts[ch] || 0}</span>
          </button>
        ))}
        <button className="chip" style={{ marginLeft: "auto" }}>
          <Icon name="plus" size={12} /> Add Quickie <span className="chip-count" style={{ opacity: .7 }}>⌘J</span>
        </button>
      </div>

      <div className="quickies-cols">
        <section className="section" style={{ marginTop: 0 }}>
          {pinned.length > 0 && (
            <>
              <div className="section-head" style={{ marginTop: 0 }}>
                <span className="section-dot" style={{ background: "var(--violet-1)" }} />
                <h3 className="section-title">Pinned</h3>
                <span className="section-count">{pinned.length}</span>
              </div>
              <div className="quickies-list" style={{ marginBottom: 22 }}>
                {pinned.map((q) => (
                  <QuickieRow key={q.who + q.action} q={q} tints={tints}
                              onToggle={() => toggle(items.indexOf(q))} />
                ))}
              </div>
            </>
          )}

          <div className="section-head" style={{ marginTop: 0 }}>
            <span className="section-dot" style={{ background: "var(--dot-risk)" }} />
            <h3 className="section-title">Open</h3>
            <span className="section-count">{rest.length}</span>
            <a className="section-action" href="#">sort by trigger date <Icon name="arrow-right" size={12} /></a>
          </div>
          <div className="quickies-list">
            {rest.map((q) => (
              <QuickieRow key={q.who + q.action} q={q} tints={tints}
                          onToggle={() => toggle(items.indexOf(q))} />
            ))}
          </div>

          <div className="section-head" style={{ marginTop: 28, cursor: "pointer" }}
               onClick={() => setArchiveOpen(!archiveOpen)}>
            <span className="section-dot" style={{ background: "var(--dot-stale)" }} />
            <h3 className="section-title" style={{ color: "var(--ink-3)" }}>Done · last 30 days</h3>
            <span className="section-count">47 done · dopamine receipt</span>
            <span className="section-action">{archiveOpen ? "hide" : "expand"} <Icon name="arrow-right" size={12} /></span>
          </div>
          {archiveOpen && (
            <div className="quickies-list" style={{ opacity: 0.75 }}>
              {QUICKIES_DONE_RECENT.map((d, i) => (
                <div key={i} className="quickie done">
                  <button className="quickie-check"><Icon name="check" size={11} /></button>
                  <div className="quickie-body">
                    <div className="quickie-who">{d.who}</div>
                    <div className="quickie-action">{d.action}</div>
                    <div className="quickie-meta"><span>{d.when}</span></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <aside>
          <div className="suggested-card">
            <div className="panel-head">
              <span className="panel-title">Suggested</span>
              <span className="v2-badge">live · HubSpot</span>
            </div>
            <div className="field-help" style={{ marginTop: 8, fontSize: 12.5 }}>
              {suggestions.length > 0
                ? `${suggestions.length} contacts gone quiet 30+ days. Add as Quickies?`
                : 'No quiet contacts found — sync HubSpot to refresh.'}
            </div>
            <div className="suggested-list">
              {(suggestions.length > 0 ? suggestions : []).map((s) => (
                <div key={s.id} className="suggested-row">
                  <div>
                    <div className="suggested-name">{s.who}</div>
                    <div className="suggested-ctx">{s.ctx}</div>
                  </div>
                  <span className="suggested-reason">{s.reason}</span>
                  <button
                    className="suggested-add"
                    disabled={addedIds.has(s.id)}
                    onClick={() => addSuggested(s)}
                  >
                    {addedIds.has(s.id) ? '✓ added' : '+ add'}
                  </button>
                </div>
              ))}
              {suggestions.length === 0 && QUICKIES_SUGGESTED.map((s, i) => (
                <div key={i} className="suggested-row" style={{ opacity: .5 }}>
                  <div>
                    <div className="suggested-name">{s.who}</div>
                    <div className="suggested-ctx">{s.ctx}</div>
                  </div>
                  <span className="suggested-reason">{s.reason}</span>
                  <button className="suggested-add" disabled>+ add</button>
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 14, fontSize: 12, color: "var(--ink-3)", padding: "0 4px" }}>
            <strong style={{ color: "var(--ink-2)", fontWeight: 500 }}>Why suggested?</strong>{" "}
            Pulled from your HubSpot contacts — anyone with no recorded touch in 30+ days, quietest first.
          </div>
        </aside>
      </div>
    </main>
  );
}
