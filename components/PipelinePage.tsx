'use client';
import { useState, useMemo } from 'react';
import Icon from '@/components/Icon';
import { PageHeader, MetricStrip } from '@/components/modules';
import {
  PIPELINE_METRICS, PIPELINE_REVENUE_SERIES, PIPELINE_FORECAST_BY_SERVICE,
  LEAD_NURTURE, PIPELINE_DEALS, PIPELINE_LOSSES, STUCK_DEALS, WINS,
  LeadItem
} from '@/lib/data';

function TodaysMove() {
  return (
    <section className="todays-move">
      <div className="tm-edge" />
      <div className="tm-body">
        <div className="tm-kicker"><span className="pulse" />Today&apos;s move</div>
        <h3 className="tm-title">Three new referrals from Sharisse this week — none touched yet. Send a short intro to all three before EOD; they&apos;re warm right now and won&apos;t be Monday.</h3>
        <div className="tm-meta">
          <span><b>Why this?</b> Pipeline-coverage gap + warm-decay window of ~96h on referrals.</span>
        </div>
      </div>
      <div className="tm-actions">
        <button className="btn-primary"><Icon name="zap" size={14} /> Draft the three notes</button>
        <button className="btn-ghost">See referrals <Icon name="arrow-right" size={13} /></button>
      </div>
    </section>
  );
}

function RevenueChart() {
  const { months, retainer, workshop, advisory } = PIPELINE_REVENUE_SERIES;
  const totals = months.map((_, i) => retainer[i] + workshop[i] + advisory[i]);
  const max = Math.max(...totals);
  const ttd = totals.reduce((a, b) => a + b, 0);
  const ytd = totals.slice(-4).reduce((a, b) => a + b, 0);
  return (
    <section className="panel chart-panel">
      <div className="panel-head">
        <div>
          <span className="panel-title">Revenue · last 12 months</span>
          <div className="panel-meta-line">
            <span className="legend"><span className="legend-sw" style={{ background: "var(--accent)" }} /> retainer</span>
            <span className="legend"><span className="legend-sw" style={{ background: "var(--violet-1)" }} /> workshops</span>
            <span className="legend"><span className="legend-sw" style={{ background: "var(--ink-2)" }} /> advisory</span>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 22, color: "var(--ink-1)" }}>${ttd}K</div>
          <div style={{ fontSize: 11, color: "var(--ink-3)" }}>12 mo · last 4 ${ytd}K</div>
        </div>
      </div>
      <div className="bar-chart">
        {months.map((m, i) => {
          const t = totals[i];
          const h = (t / max) * 100;
          const rH = (retainer[i] / t) * h;
          const wH = (workshop[i] / t) * h;
          const aH = (advisory[i] / t) * h;
          return (
            <div key={i} className="bar-col" title={`${m} · $${t}K`}>
              <div className="bar-stack">
                <span className="bar-seg s-advisory" style={{ height: `${aH}%` }} />
                <span className="bar-seg s-workshop" style={{ height: `${wH}%` }} />
                <span className="bar-seg s-retainer" style={{ height: `${rH}%` }} />
              </div>
              <div className="bar-label">{m}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ForecastPanel() {
  const total = PIPELINE_FORECAST_BY_SERVICE.reduce((s, d) => s + d.value, 0);
  const colors = ["var(--accent)", "var(--violet-1)", "var(--ink-2)", "var(--peach)"];
  return (
    <section className="panel chart-panel">
      <div className="panel-head">
        <div>
          <span className="panel-title">Q-end forecast · by service</span>
          <div className="panel-meta-line">
            <span style={{ fontSize: 11, color: "var(--ink-3)" }}>weighted by stage probability</span>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 22, color: "var(--ink-1)" }}>${total}K</div>
          <div style={{ fontSize: 11, color: "var(--ink-3)" }}>vs $150K goal · 65%</div>
        </div>
      </div>
      <div className="forecast-rows">
        {PIPELINE_FORECAST_BY_SERVICE.map((d, i) => (
          <div key={i} className="forecast-row">
            <div className="forecast-label">
              <span className="forecast-sw" style={{ background: colors[i] }} />
              {d.label}
            </div>
            <div className="forecast-track">
              <span className="forecast-fill" style={{ width: `${d.share * 100}%`, background: colors[i] }} />
            </div>
            <div className="forecast-val">${d.value}K</div>
            <div className="forecast-pct">{Math.round(d.share * 100)}%</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function LeadNurture() {
  const [sortBy, setSortBy] = useState("newest");
  const [items, setItems] = useState<LeadItem[]>(LEAD_NURTURE);

  const sorted = useMemo(() => {
    const arr = [...items];
    if (sortBy === "newest") arr.sort((a, b) => a.days - b.days);
    if (sortBy === "oldest") arr.sort((a, b) => b.days - a.days);
    if (sortBy === "value")  arr.sort((a, b) => parseInt(b.value.replace(/\D/g,"")) - parseInt(a.value.replace(/\D/g,"")));
    return arr;
  }, [items, sortBy]);

  const act = (name: string, kind: string) => {
    setItems(prev => prev.map(l => l.name === name ? { ...l, _flash: kind } : l));
    setTimeout(() => setItems(prev => prev.map(l => ({ ...l, _flash: undefined }))), 1400);
  };

  return (
    <section className="section">
      <div className="section-head">
        <span className="section-dot" style={{ background: "var(--violet-1)" }} />
        <h3 className="section-title">Leads to Nurture</h3>
        <span className="section-count">HubSpot · Lead/MQL · {items.length} in flight · upstream of deals</span>
        <span className="section-action lead-sort">
          sort:
          {[["newest","newest"],["oldest","oldest"],["value","value"]].map(([id,label]) => (
            <button key={id} className={`lead-sort-btn ${sortBy===id?"active":""}`} onClick={() => setSortBy(id)}>{label}</button>
          ))}
          <span style={{ color: "var(--ink-4)", margin: "0 6px" }}>·</span>
          <a href="#" style={{ color: "var(--ink-3)" }}>+ add lead <Icon name="arrow-right" size={12} /></a>
        </span>
      </div>
      <div className="lead-rows">
        {sorted.map((l) => (
          <div key={l.name} className={`lead-row temp-${l.status} ${l._flash ? "flash-"+l._flash : ""}`}>
            <div className="lead-main">
              <div className="lead-top">
                <span className="lead-name">{l.name}</span>
                <span className="lead-source">{l.source}</span>
                <span className="lead-stage">{l.stage}</span>
                <span className={`temp-pill temp-${l.status}`}><span className="temp-dot" />{l.status}</span>
              </div>
              <div className="lead-mid">
                <span className="lead-contact">{l.contact}</span>
                <span className="lead-sep">·</span>
                <span className="lead-value">{l.value} est.</span>
                <span className="lead-sep">·</span>
                <span className="lead-last">last touch {l.last}</span>
              </div>
              <div className="lead-next"><span className="lead-next-label">Next ›</span> {l.next}</div>
            </div>
            <div className="lead-actions">
              <button className={`lead-btn touch ${l.suggest==="touch"?"recommended":""}`}
                      onClick={() => act(l.name, "touch")}>
                <Icon name="mail" size={11} /> Touch
              </button>
              <button className={`lead-btn graduate ${l.suggest==="graduate"?"recommended":""}`}
                      onClick={() => act(l.name, "graduate")}>
                <Icon name="arrow-right" size={11} /> Graduate
              </button>
              <button className={`lead-btn cool ${l.suggest==="cool"?"recommended":""}`}
                      onClick={() => act(l.name, "cool")}>
                <Icon name="archive" size={11} /> Cool off
              </button>
            </div>
            {l._flash && (
              <div className="lead-flash">
                {l._flash === "touch"    && <>✓ Touch logged · drafted message ready</>}
                {l._flash === "graduate" && <>✓ Promoted — now in Active Deals</>}
                {l._flash === "cool"     && <>✓ Cooled off · Quickie set for 60d follow-up</>}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function DealsTable() {
  return (
    <section className="section">
      <div className="section-head">
        <span className="section-dot" style={{ background: "var(--dot-healthy)" }} />
        <h3 className="section-title">Active Deals</h3>
        <span className="section-count">{PIPELINE_DEALS.length} open</span>
        <a className="section-action" href="#">+ Add deal <Icon name="arrow-right" size={12} /></a>
      </div>
      <div className="dtable">
        <div className="dtable-head">
          <div>Client</div><div>Stage</div><div>Value</div><div>Next Action</div><div>Last Touch</div><div>Owner</div>
        </div>
        {PIPELINE_DEALS.map((d, i) => (
          <div key={i} className={`dtable-row ${d.stuck ? "stuck" : ""}`}>
            <div className="dtable-client">{d.client}</div>
            <div><span className="dtable-stage">{d.stage}</span></div>
            <div className="dtable-value">{d.value}</div>
            <div className="dtable-next">{d.next}</div>
            <div className={`dtable-last ${d.stuck ? "warn" : ""}`}>{d.last}</div>
            <div><div className="dtable-owner">{d.owner}</div></div>
          </div>
        ))}
      </div>
    </section>
  );
}

function StuckBanner() {
  return (
    <button className="stuck-banner">
      <Icon name="alert" size={13} />
      <span><strong>{STUCK_DEALS.count} deals untouched 30+ days</strong> · ${STUCK_DEALS.totalValue} at risk · oldest: {STUCK_DEALS.oldest}</span>
      <span className="stuck-banner-cta">filter the table <Icon name="arrow-right" size={12} /></span>
    </button>
  );
}

function WinsLossesRow() {
  return (
    <div className="two-col">
      <section className="panel">
        <div className="panel-head">
          <span className="panel-title">Recent Wins · 90 days</span>
          <span className="panel-meta">$112K booked</span>
        </div>
        <div className="wins-list">
          {WINS.slice(0, 4).map((w, i) => (
            <div key={i} className="win-row">
              <div className="win-amount">{w.amount}</div>
              <div className="win-meta">
                <div className="win-client">{w.name}</div>
                <div className="win-when">{w.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="panel">
        <div className="panel-head">
          <span className="panel-title" style={{ color: "var(--ink-3)" }}>Recent Losses · 90 days</span>
          <span className="panel-meta">$154K · for learning, not shame</span>
        </div>
        <div className="wins-list" style={{ opacity: 0.85 }}>
          {PIPELINE_LOSSES.map((l, i) => (
            <div key={i} className="win-row">
              <div className="win-amount" style={{ color: "var(--ink-3)" }}>{l.amount}</div>
              <div className="win-meta">
                <div className="win-client">{l.client}</div>
                <div className="win-when">{l.date} · {l.reason}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default function PipelinePage() {
  return (
    <main className="main main-full">
      <PageHeader
        title={<>Pipeline.</>}
        sub="Where the money is — and where it's stalling. 9 active conversations, 3 quiet, 6 leads warming."
        right={<><strong>Apr 24, 2026</strong><span className="muted">SYNCED 8 MIN AGO · HUBSPOT</span></>}
      />
      <TodaysMove />
      <MetricStrip items={PIPELINE_METRICS} />
      <div className="two-col chart-row">
        <RevenueChart />
        <ForecastPanel />
      </div>
      <StuckBanner />
      <DealsTable />
      <LeadNurture />
      <WinsLossesRow />
    </main>
  );
}
