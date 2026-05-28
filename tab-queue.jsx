/* PRISM — Review Queue (Human in the Loop) */

const TabQueue = ({ onOpenDetail }) => {
  const D = window.PRISM_DATA;
  // queue is review + escalate
  const queue = D.PO_ROWS.filter(p => p.route !== 'auto');
  const [selectedId, setSelectedId] = React.useState(queue[0]?.id);
  const [tab, setTab] = React.useState('pending');
  const selected = queue.find(p => p.id === selectedId) || queue[0];

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Review Queue</h1>
          <div className="sub">Layer 4 — Human in the loop · review &amp; corrections feed retraining</div>
        </div>
        <div className="actions">
          <button className="btn btn-sm"><Icon name="filter" size={13}/> Filter</button>
          <button className="btn btn-sm btn-primary"><Icon name="play" size={13}/> Bulk approve high-conf</button>
        </div>
      </div>

      <div className="stat-grid" style={{ marginBottom: 16 }}>
        <Stat label="Pending review"   value="47"  delta={-12}/>
        <Stat label="Escalated"        value="14"  delta={+3}/>
        <Stat label="Avg. review time" value="2.4" unit=" min" delta={-0.3}/>
        <Stat label="SLA compliance"   value="98.7" unit="%" delta={+0.4}/>
        <Stat label="Override rate"    value="11.3" unit="%" delta={-2.1}/>
      </div>

      <div className="tabs">
        <div className={`tab ${tab==='pending'?'active':''}`} onClick={()=>setTab('pending')}>Pending · 47</div>
        <div className={`tab ${tab==='escal'?'active':''}`} onClick={()=>setTab('escal')}>Escalated · 14</div>
        <div className={`tab ${tab==='done'?'active':''}`} onClick={()=>setTab('done')}>Resolved today · 218</div>
        <div className={`tab ${tab==='retrain'?'active':''}`} onClick={()=>setTab('retrain')}>Retrain buffer · 348</div>
      </div>

      <div className="queue-shell">
        {/* List */}
        <div className="queue-list">
          {queue.map(p => (
            <div key={p.id} className={`queue-row ${selectedId === p.id ? 'active':''}`} onClick={() => setSelectedId(p.id)}>
              <div className="ln1">
                <span className="id">{p.id}</span>
                <span style={{ flex: 1 }}><RoutePill route={p.route}/></span>
                <span className="amt">{fmtEUR(p.amount)}</span>
              </div>
              <div className="ln2">{p.desc}</div>
              <div className="ln3">
                <span className="pill purple"><Icon name="tag" size={10}/>{p.newCat}</span>
                <ConfChip conf={p.conf}/>
                <span style={{ color:'var(--muted)', fontSize: 11 }}>· {p.ship}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Detail panel */}
        {selected && <ReviewDetail po={selected} onOpenDetail={onOpenDetail}/>}
      </div>
    </div>
  );
};

const ReviewDetail = ({ po, onOpenDetail }) => {
  const D = window.PRISM_DATA;
  const [pick, setPick] = React.useState(po.newCat);
  React.useEffect(() => setPick(po.newCat), [po.id]);

  // Mock agent verdicts (slightly different categories on lower-conf POs)
  const verdicts = [
    { a: D.AGENTS[0], cat: po.newCat,   conf: po.conf - 0.04 + Math.random()*0.04 },
    { a: D.AGENTS[1], cat: po.newCat,   conf: po.conf + 0.02 + Math.random()*0.03 },
    { a: D.AGENTS[2], cat: po.conf < 0.7 ? 'IT & Telematics' : po.newCat, conf: po.conf - 0.10 + Math.random()*0.05 },
    { a: D.AGENTS[3], cat: po.newCat,   conf: po.conf },
  ];

  // Similar POs from KB
  const similar = D.PO_ROWS.filter(p => p.id !== po.id && p.newCat === po.newCat).slice(0, 3);

  return (
    <div className="detail">
      <Card padded={true}>
        <div style={{ display:'flex', alignItems:'center', gap: 12, marginBottom: 12 }}>
          <span className="mono" style={{ fontSize: 12, color:'var(--muted)' }}>{po.id}</span>
          <RoutePill route={po.route}/>
          <ConfChip conf={po.conf}/>
          <div style={{ marginLeft:'auto', display:'flex', gap: 6 }}>
            <button className="btn btn-sm btn-ghost" onClick={onOpenDetail}>Open full detail →</button>
          </div>
        </div>
        <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.4, marginBottom: 10 }}>{po.desc}</div>
        <div style={{ display:'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
          <KV2 label="Vendor"   v={po.vendor}/>
          <KV2 label="Ship"     v={po.ship}/>
          <KV2 label="Port"     v={po.origin}/>
          <KV2 label="Amount"   v={fmtEURexact(po.amount)} mono/>
        </div>
      </Card>

      <Card title="Agent verdicts" sub="parallel">
        <div className="verdict-grid">
          {verdicts.map(v => (
            <div key={v.a.id} className="verdict">
              <div className="ttl"><span className="ag-dot" style={{ background: v.a.color }}/>{v.a.name}</div>
              <div className="cat-label">{v.cat}</div>
              <div className="conf">conf {v.conf.toFixed(2)} · weight {v.a.weight}%</div>
              <div style={{ marginTop: 8, height: 4, background: 'var(--bg-2)', borderRadius: 2 }}>
                <div style={{ height: '100%', width: `${v.conf*100}%`, background: v.a.color, borderRadius: 2 }}/>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid-2">
        <Card title="LLM reasoning" sub="Azure GPT-4o">
          <div style={{ fontSize: 13, lineHeight: 1.55, color:'var(--ink-2)' }}>
            <p style={{ marginTop: 0 }}>The description contains two strong category signals:</p>
            <ul style={{ paddingLeft: 18, margin: '6px 0' }}>
              <li><b>Lexical:</b> &ldquo;IFO 380 cSt&rdquo; is industry shorthand for <i>Intermediate Fuel Oil, 380 centistoke viscosity</i> — bunker fuel.</li>
              <li><b>Quantity unit:</b> &ldquo;240&nbsp;MT&rdquo; (metric tonnes) and the magnitude (€142k) match typical bunker fuel orders.</li>
              <li><b>Vendor:</b> ENI Marine Fuels exclusively supplies marine fuels.</li>
            </ul>
            <p style={{ marginBottom: 0 }}>Suggested category: <b style={{ color:'var(--ok)' }}>Bunker Fuel</b> (UNSPSC 15101500). High confidence.</p>
          </div>
        </Card>

        <Card title="Similar POs (KB)" sub="RAG · top 3">
          {similar.map(s => (
            <div key={s.id} style={{ padding: 9, border:'1px solid var(--line)', borderRadius: 8, marginBottom: 8, fontSize: 12 }}>
              <div style={{ display:'flex', gap: 8, alignItems:'center' }}>
                <span className="mono" style={{ color:'var(--muted)', fontSize: 11 }}>{s.id}</span>
                <span style={{ marginLeft:'auto' }}><ConfChip conf={s.conf}/></span>
              </div>
              <div style={{ marginTop: 4, color:'var(--ink-2)' }}>{s.desc}</div>
              <div style={{ marginTop: 4, color:'var(--muted)', fontSize: 11 }}>{s.vendor} · {fmtEUR(s.amount)}</div>
            </div>
          ))}
        </Card>
      </div>

      {/* Decision */}
      <Card title="Reviewer decision">
        <div style={{ fontSize: 12, color:'var(--muted)', marginBottom: 6 }}>Override category (optional)</div>
        <div style={{ display:'flex', flexWrap:'wrap', gap: 6, marginBottom: 16 }}>
          {D.CATEGORIES.slice(0,8).map(c => (
            <button key={c.code} onClick={()=>setPick(c.name)}
              style={{
                fontSize: 12, padding:'5px 10px', borderRadius: 6,
                border: '1px solid '+(pick===c.name?c.color:'var(--line)'),
                background: pick === c.name ? c.color : 'var(--surface)',
                color: pick === c.name ? '#fff' : 'var(--ink-2)',
                fontWeight: 600, cursor:'pointer'
              }}>
              {c.name}
            </button>
          ))}
        </div>
        <div style={{ display:'flex', gap: 8 }}>
          <button className="btn btn-primary"><Icon name="check" size={14}/> Approve</button>
          <button className="btn"><Icon name="flag" size={14}/> Approve &amp; flag for retrain</button>
          <button className="btn"><Icon name="x" size={14}/> Reject</button>
          <div style={{ marginLeft:'auto', fontSize: 11, color: 'var(--muted)', alignSelf:'center' }}>
            <Icon name="shield" size={12}/> all actions audited · audit_id <span className="mono">AUD-948112</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

const KV2 = ({ label, v, mono }) => (
  <div>
    <div style={{ fontSize: 10.5, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'0.05em', fontWeight: 600 }}>{label}</div>
    <div style={{ fontSize: 13, fontWeight: 600, marginTop: 3 }} className={mono ? 'mono tnum' : ''}>{v}</div>
  </div>
);

window.TabQueue = TabQueue;
