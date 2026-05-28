/* PRISM - Executive Overview tab
   - Live multi-agent pipeline (hero)
   - KPI tiles
   - Routing donut + Recent POs + Live feed
*/

const TabOverview = ({ useCase, density }) => {
  const D = window.PRISM_DATA;
  const [activeIdx, setActiveIdx] = React.useState(0);

  // Pulse-cycle through agents to convey "live processing"
  React.useEffect(() => {
    const id = setInterval(() => setActiveIdx(i => (i+1) % 4), 1800);
    return () => clearInterval(id);
  }, []);

  // Hero PO that is "flowing through" the pipeline
  const livePO = D.PO_ROWS[0];

  // Agent step renderer
  const agentStep = (idx, label, agent, output, oconf) => {
    const active = activeIdx === idx;
    return (
      <div className={`pipe-step agent ${active ? 'active' : ''}`}>
        <div className="weight">{agent.weight}%</div>
        <div className="step-label">{label}</div>
        <div className="step-title">
          <span className="ag-dot" style={{ background: agent.color }}/>
          {agent.name}
        </div>
        <div className="step-meta">{agent.sub} · {agent.latency}ms</div>
        <div className="ag-bars">
          {Array.from({length: 12}).map((_,i) => {
            const on = active && i < ((Date.now()/120) % 12 | 0);
            return <span key={i} className={`ag-bar ${on ? 'on' : ''}`} style={{ height: 6 + (i*7%18) }}/>;
          })}
        </div>
        <div className="step-out">
          <div className="cat" style={{ color: agent.color }}>{output}</div>
          <div className="conf">conf {oconf.toFixed(2)}</div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <UseCaseBar useCase={useCase}/>

      {/* Hero pipeline */}
      <div className="pipeline" style={{ marginBottom: 18 }}>
        <div className="pipeline-head">
          <h2><span className="pulse-dot"/>Live multi-agent classification pipeline</h2>
          <div style={{ display:'flex', gap: 8, alignItems:'center', fontSize: 12, color: 'var(--muted)' }}>
            <span>Processing</span>
            <span className="mono tnum" style={{ color: 'var(--ink)', fontWeight: 600 }}>1,842 POs/day</span>
            <span>·</span>
            <span>p95 latency</span>
            <span className="mono tnum" style={{ color: 'var(--ink)', fontWeight: 600 }}>612ms</span>
          </div>
        </div>

        <div className="pipeline-track">
          {/* Input */}
          <div className="pipe-step input">
            <div className="step-label">Input · L1 Ingestion</div>
            <div className="step-title">
              <Icon name="inbox" size={15}/>
              Purchase Order
            </div>
            <div className="step-meta mono" style={{ fontSize: 10.5 }}>{livePO.id}</div>
            <div style={{ fontSize: 11, color:'var(--muted)', marginTop: 6, lineHeight: 1.4, display:'-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
              {livePO.desc}
            </div>
            <div className="step-out">
              <div className="conf">{livePO.vendor.length > 22 ? livePO.vendor.slice(0,22)+'…' : livePO.vendor}</div>
              <div className="cat mono" style={{ marginTop: 2 }}>{fmtEUR(livePO.amount)}</div>
            </div>
          </div>

          {/* 3 agents in parallel */}
          {agentStep(0, 'Agent 1 · L2', D.AGENTS[0], 'Bunker Fuel',          0.93)}
          {agentStep(1, 'Agent 2 · L2', D.AGENTS[1], 'Bunker Fuel',          0.96)}
          {agentStep(2, 'Agent 3 · L2', D.AGENTS[2], 'Bunker Fuel',          0.94)}

          {/* Orchestrator (consensus) */}
          <div className={`pipe-step agent ${activeIdx === 3 ? 'active' : ''}`}>
            <div className="weight" style={{ background:'var(--accent-pink)', color:'#fff' }}>Σ</div>
            <div className="step-label">Orchestrator · L2</div>
            <div className="step-title">
              <span className="ag-dot" style={{ background: D.AGENTS[3].color }}/>
              Consensus
            </div>
            <div className="step-meta">Weighted vote · LangGraph</div>
            <div style={{ display:'flex', gap: 4, marginTop: 6, fontSize: 10, color:'var(--muted)' }}>
              <span>ML 40 + LLM 35 + KB 25</span>
            </div>
            <div className="step-out">
              <div className="cat">Bunker Fuel</div>
              <div className="conf">final conf <b style={{ color:'var(--ok)'}}>0.97</b></div>
            </div>
          </div>

          {/* Output (routing) */}
          <div className="pipe-step output">
            <div className="step-label">Output · L3 Governance</div>
            <div className="step-title">
              <Icon name="check" size={15}/>
              Routing decision
            </div>
            <div className="step-meta">Confidence &gt; 85%</div>
            <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ display:'flex', alignItems:'center', gap: 6, fontSize: 11.5 }}>
                <span className="dot" style={{ background:'var(--ok)'}}/>auto-classify
              </div>
              <div style={{ display:'flex', alignItems:'center', gap: 6, fontSize: 11.5, opacity: 0.45 }}>
                <span className="dot" style={{ background:'var(--warn)'}}/>review (opt.)
              </div>
              <div style={{ display:'flex', alignItems:'center', gap: 6, fontSize: 11.5, opacity: 0.45 }}>
                <span className="dot" style={{ background:'var(--err)'}}/>escalate
              </div>
            </div>
            <div className="step-out">
              <div className="cat" style={{ color:'var(--ok)' }}>→ auto-approved</div>
              <div className="conf">SLA &lt; 1s</div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI tiles */}
      <div className="stat-grid" style={{ marginBottom: 16 }}>
        <Stat label="Classification accuracy" value={D.KPI.accuracy.value} unit="%"  delta={D.KPI.accuracy.delta} spark={D.SPARKS.accuracy} sparkColor="var(--ok)"/>
        <Stat label="POs processed (24h)"      value={fmtNum(D.KPI.pos_today.value)} delta={D.KPI.pos_today.delta} spark={D.SPARKS.pos_today} sparkColor="var(--accent-blue)"/>
        <Stat label="Auto-classified share"    value={D.KPI.autoclassified.value} unit="%" delta={D.KPI.autoclassified.delta} spark={D.SPARKS.autoclassified} sparkColor="var(--accent-cyan)"/>
        <Stat label="Review queue"             value={D.KPI.review_queue.value} delta={D.KPI.review_queue.delta} spark={D.SPARKS.review_queue} sparkColor="var(--warn)"/>
        <Stat label="Estimated YTD savings"    value={D.KPI.savings_ytd.value} unit=" M€" delta={D.KPI.savings_ytd.delta} spark={D.SPARKS.savings_ytd} sparkColor="var(--accent-purple)"/>
      </div>

      {/* Second row: Routing + Recent POs + Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr 360px', gap: 16, marginBottom: 16 }}>
        <RoutingCard/>
        <RecentPOsCard/>
        <ActivityCard/>
      </div>

      {/* Third row: Category errors + Fleet snapshot */}
      <div className="grid-2" style={{ gap: 16 }}>
        <ErrorByCategoryCard/>
        <FleetSnapshotCard/>
      </div>
    </div>
  );
};

// -------------------- UseCaseBar --------------------
const UseCaseBar = ({ useCase }) => {
  const D = window.PRISM_DATA;
  const uc = D.USE_CASES[useCase] || D.USE_CASES.shipping;
  return (
    <div className="usecase-bar">
      <span className="label">Active client</span>
      <strong style={{ fontWeight: 700 }}>{uc.company}</strong>
      <span style={{ color: 'var(--muted)' }}>· {uc.sub}</span>
      <span style={{ marginLeft: 'auto', display:'flex', gap:8, alignItems:'center' }}>
        <span className="pill purple">{uc.scheme}</span>
        <span className="pill blue">Production · v3.2</span>
        <span style={{ color:'var(--muted)', fontSize: 11 }}>last sync 2 min ago</span>
      </span>
    </div>
  );
};

// -------------------- Routing card --------------------
const RoutingCard = () => {
  const D = window.PRISM_DATA;
  const r = D.ROUTING;
  const segs = [
    { value: r.auto.count, color: r.auto.color, label: 'auto' },
    { value: r.review.count, color: r.review.color, label: 'review' },
    { value: r.escalate.count, color: r.escalate.color, label: 'escalate' },
  ];
  return (
    <Card title="Stato revisione ordini" sub="semaforo · last 24h" padded={true}>
      <div style={{ display:'flex', alignItems:'center', gap: 16 }}>
        <div style={{ position:'relative' }}>
          <Donut segments={segs} size={140} stroke={20}/>
          <div style={{ position:'absolute', inset: 0, display:'grid', placeItems:'center', textAlign:'center' }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700 }} className="tnum">{r.total.toLocaleString()}</div>
              <div style={{ fontSize: 10.5, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>POs / day</div>
            </div>
          </div>
        </div>
        <div style={{ flex: 1, display:'flex', flexDirection: 'column', gap: 8 }}>
          <RoutingRow color={'var(--ok)'}   label="Conforme · approva"     sub="verde"  pct={r.auto.share}    n={r.auto.count}/>
          <RoutingRow color={'var(--warn)'} label="Da verificare"          sub="giallo" pct={r.review.share}  n={r.review.count}/>
          <RoutingRow color={'var(--err)'}  label="Critico · non conforme" sub="rosso"  pct={r.escalate.share}n={r.escalate.count}/>
        </div>
      </div>
    </Card>
  );
};

const RoutingRow = ({ color, label, sub, pct, n }) => (
  <div>
    <div style={{ display:'flex', alignItems:'baseline', gap:6, fontSize: 13 }}>
      <span className="dot" style={{ background: color }}/>
      <span style={{ fontWeight: 600 }}>{label}</span>
      <span style={{ color:'var(--muted)', fontSize: 11 }}>{sub}</span>
      <span style={{ marginLeft:'auto', fontFamily:'JetBrains Mono', fontSize: 12, fontWeight: 600 }}>{pct.toFixed(1)}%</span>
    </div>
    <div style={{ display:'flex', height: 6, background: 'var(--bg-2)', borderRadius: 4, overflow:'hidden', marginTop: 4 }}>
      <div style={{ width: `${pct}%`, background: color }}/>
    </div>
    <div style={{ fontSize: 10.5, color:'var(--muted)', marginTop: 3 }}>{n.toLocaleString()} POs</div>
  </div>
);

// -------------------- Recent POs --------------------
const RecentPOsCard = () => {
  const D = window.PRISM_DATA;
  const rows = D.PO_ROWS.slice(0, 6);
  return (
    <Card title="Recent classifications" sub="live" padded={false}
      right={
        <button className="btn btn-sm btn-ghost">
          <Icon name="filter" size={13}/> Filter
        </button>
      }>
      <table className="po-table">
        <thead>
          <tr><th>PO</th><th>Description</th><th>Vendor</th><th style={{ textAlign:'right' }}>Amount</th><th>Reclassified</th><th>Conf.</th></tr>
        </thead>
        <tbody>
          {rows.map(p => (
            <tr key={p.id}>
              <td className="mono" style={{ fontSize: 11.5, color: 'var(--muted)' }}>{p.id.slice(-5)}</td>
              <td style={{ maxWidth: 280 }}>
                <div style={{ whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{p.desc}</div>
                <div className="desc" style={{ whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                  <span style={{ textDecoration:'line-through', opacity: 0.6 }}>{p.oldCat}</span>
                  {' → '}<span style={{ color: 'var(--ok)' }}>{p.newCat}</span>
                </div>
              </td>
              <td style={{ fontSize: 12 }}>{p.vendor}</td>
              <td className="num mono">{fmtEUR(p.amount)}</td>
              <td><span className="pill purple"><Icon name="tag" size={10}/>{p.newCat}</span></td>
              <td><ConfChip conf={p.conf}/></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
};

// -------------------- Activity feed --------------------
const ActivityCard = () => {
  const D = window.PRISM_DATA;
  return (
    <Card title="Activity" sub="live" padded={true}
      right={<span className="pill green"><span className="dot" style={{ background: 'currentColor' }}/>live</span>}>
      <div style={{ display:'flex', flexDirection: 'column' }}>
        {D.ACTIVITY.slice(0, 9).map((a, i) => (
          <div key={i} className="feed-row">
            <div className="t">{a.t}</div>
            <div>
              <div className="msg" dangerouslySetInnerHTML={{ __html: a.msg }}/>
              <div className="who">{a.who}</div>
            </div>
            <div style={{ textAlign:'right' }}>
              {a.kind === 'ok'   && <span className="pill green"><Icon name="check" size={10}/>ok</span>}
              {a.kind === 'info' && <span className="pill blue"></span>}
              {a.kind === 'warn' && <span className="pill amber"><Icon name="flag" size={10}/>flag</span>}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

// -------------------- Errors by category --------------------
const ErrorByCategoryCard = () => {
  const D = window.PRISM_DATA;
  const sorted = [...D.CATEGORIES].sort((a,b) => b.errPrev - a.errPrev).slice(0, 8);
  const maxErr = Math.max(...sorted.map(c => c.errPrev));
  return (
    <Card title="Misclassification rate - before / after PRISM" sub="last 90 days vs. baseline" padded={true}>
      <div style={{ display:'flex', flexDirection: 'column', gap: 9 }}>
        {sorted.map(c => (
          <div key={c.code}>
            <div style={{ display:'flex', alignItems:'baseline', gap: 8, fontSize: 12, marginBottom: 4 }}>
              <span style={{ fontWeight: 600, color: 'var(--ink-2)' }}>{c.name}</span>
              <span className="mono" style={{ color: 'var(--muted)', fontSize: 11 }}>UNSPSC {c.code}</span>
              <span style={{ marginLeft:'auto', display:'flex', gap: 10, alignItems:'baseline' }}>
                <span style={{ color: 'var(--muted)', fontSize: 11 }}>before <b className="mono tnum" style={{ color:'var(--err)' }}>{c.errPrev.toFixed(1)}%</b></span>
                <span style={{ color: 'var(--muted)', fontSize: 11 }}>after  <b className="mono tnum" style={{ color:'var(--ok)' }}>{c.errNow.toFixed(1)}%</b></span>
                <span className="pill green" style={{ fontSize: 10 }}>−{(c.errPrev - c.errNow).toFixed(1)} pp</span>
              </span>
            </div>
            <div style={{ position:'relative', height: 10, background: 'var(--bg-2)', borderRadius: 4, overflow:'hidden' }}>
              <div style={{ position:'absolute', left: 0, top: 0, bottom: 0, width: `${(c.errPrev/maxErr)*100}%`, background: 'var(--err)', opacity: 0.32 }}/>
              <div style={{ position:'absolute', left: 0, top: 0, bottom: 0, width: `${(c.errNow/maxErr)*100}%`, background: 'var(--ok)' }}/>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

// -------------------- Fleet snapshot --------------------
const FleetSnapshotCard = () => {
  const D = window.PRISM_DATA;
  return (
    <Card title="Fleet spend snapshot" sub="MTD" padded={true}
      right={
        <div className="tog">
          <button className="on">MTD</button>
          <button>QTD</button>
          <button>YTD</button>
        </div>
      }>
      <div>
        {D.FLEET.slice(0, 8).map(s => (
          <div key={s.imo} className="ship-row">
            <div className="ico"><Icon name="ship" size={16}/></div>
            <div>
              <div className="name">{s.name}</div>
              <div className="sub">IMO {s.imo} · {s.type} · {s.pos} POs</div>
            </div>
            <div className="amt">{fmtEUR(s.spend)}</div>
          </div>
        ))}
      </div>
    </Card>
  );
};

window.TabOverview = TabOverview;
