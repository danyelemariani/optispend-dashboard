/* SpendWise - Review Queue (Human in the Loop) */

const TabQueue = ({ onOpenDetail }) => {
  const D = window.SPENDWISE_DATA;
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
          <div className="sub">Layer 4 - Human in the loop · review &amp; corrections feed retraining</div>
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
const getMockSimilarPOs = (category) => {
  const mockKB = {
    'Bunker Fuel': [
      { id: 'KB-2025-0104', desc: 'Bunker fuel IFO 180 cSt, 180 MT, Genoa delivery', vendor: 'ENI Marine Fuels', amount: 98400, conf: 0.98 },
      { id: 'KB-2025-0322', desc: 'MGO Marine Gas Oil, 50 MT, bunkering at Augusta', vendor: 'ENI Marine Fuels', amount: 32600, conf: 0.97 },
      { id: 'KB-2025-0511', desc: 'Bunker IFO 380, 200 MT, Rotterdam port', vendor: 'BP Marine', amount: 118000, conf: 0.99 }
    ],
    'Lubricants & Greases': [
      { id: 'KB-2025-0812', desc: 'Olio lubrificante motore Castrol Cyltech 70 - 4 IBC 1000L', vendor: 'Castrol Marine', amount: 15400, conf: 0.96 },
      { id: 'KB-2025-0902', desc: 'Mobilgard 312, 10 fusti da 208L', vendor: 'Shell Marine Lubricants', amount: 3800, conf: 0.94 },
      { id: 'KB-2025-1011', desc: 'Grasso per macchinari coperta Mobilux EP 2', vendor: 'Shell Marine Lubricants', amount: 1200, conf: 0.91 }
    ],
    'Marine Spare Parts': [
      { id: 'KB-2025-1102', desc: 'Segmenti pistone motore Wärtsilä 32, set da 6 pz', vendor: 'Wärtsilä Service Italy', amount: 12400, conf: 0.95 },
      { id: 'KB-2025-1115', desc: 'Valvole di aspirazione MAN B&W 50MC', vendor: 'MAN Energy Solutions', amount: 9600, conf: 0.93 },
      { id: 'KB-2025-1201', desc: 'Ugelli iniettori combustibile per generatore auxiliary', vendor: 'Wärtsilä Service Italy', amount: 4800, conf: 0.92 }
    ],
    'Port & Pilotage Svc.': [
      { id: 'KB-2025-0410', desc: 'Pilotage fees Port of Venice - MV Tirreno Star', vendor: 'Port Authority of Venice', amount: 2800, conf: 0.99 },
      { id: 'KB-2025-0604', desc: 'Rimorchiatori Porto di Napoli - Assistenza ormeggio', vendor: 'Rimorchiatori Napoletani', amount: 7200, conf: 0.98 },
      { id: 'KB-2025-0715', desc: 'Tasse portuali di ancoraggio - MV Genova Spirit', vendor: 'Port Authority of Genova', amount: 4500, conf: 0.97 }
    ],
    'Deck & Engine Tools': [
      { id: 'KB-2025-0219', desc: 'Smerigliatrice angolare Bosch Professional GWS 22-230 LVI', vendor: 'Generic Trade SRL', amount: 420, conf: 0.88 },
      { id: 'KB-2025-0310', desc: 'Set chiavi a bussola BETA 1/2 pollici, 25 pz', vendor: 'Generic Trade SRL', amount: 350, conf: 0.91 },
      { id: 'KB-2025-0402', desc: 'Trapano a percussione Makita HP2071F', vendor: 'Generic Trade SRL', amount: 280, conf: 0.89 }
    ],
    'Cleaning & Hygiene': [
      { id: 'KB-2025-0112', desc: 'Sgrassante biodegradabile per sentina - Tanica 25L x 10', vendor: 'Mediterraneo Forniture', amount: 450, conf: 0.92 },
      { id: 'KB-2025-0220', desc: 'Rotoli carta assorbente industriale x 24', vendor: 'Mediterraneo Forniture', amount: 320, conf: 0.94 },
      { id: 'KB-2025-0315', desc: 'Sapone liquido lavamani officina - Tanica 5L x 8', vendor: 'Mediterraneo Forniture', amount: 180, conf: 0.91 }
    ],
    'Provisions / Galley': [
      { id: 'KB-2025-0708', desc: 'Fornitura viveri bordo: carne fresca e congelata', vendor: 'Forniture Navali Bonomi', amount: 2800, conf: 0.96 },
      { id: 'KB-2025-0719', desc: 'Frutta e verdura fresca - Consegna settimanale Livorno', vendor: 'Forniture Navali Bonomi', amount: 1200, conf: 0.95 },
      { id: 'KB-2025-0801', desc: 'Prodotti secchi e in scatola per cambusa MV Vesuvio', vendor: 'Forniture Navali Bonomi', amount: 3100, conf: 0.97 }
    ],
    'Marine Insurance': [
      { id: 'KB-2025-0101', desc: 'Polizza H&M Hull & Machinery MV Tirreno Star - Quota Q1', vendor: 'Generali Marine Insurance', amount: 45000, conf: 0.99 },
      { id: 'KB-2025-0115', desc: 'Copertura P&I Protection & Indemnity - Rata annuale', vendor: 'Generali Marine Insurance', amount: 120000, conf: 0.99 },
      { id: 'KB-2025-0210', desc: 'Rinnovo assicurativo Cargo Liability 2026', vendor: 'Generali Marine Insurance', amount: 35000, conf: 0.98 }
    ],
    'IT & Telematics': [
      { id: 'KB-2025-0520', desc: 'Canone mensile connettività satellitare FleetBroadband', vendor: 'Generic Trade SRL', amount: 2400, conf: 0.94 },
      { id: 'KB-2025-0612', desc: 'Router Cisco Catalyst 1000 - Sostituzione apparato', vendor: 'Generic Trade SRL', amount: 1100, conf: 0.95 },
      { id: 'KB-2025-0704', desc: 'Licenze software navigazione ECDIS - Update annuale', vendor: 'Generic Trade SRL', amount: 4500, conf: 0.93 }
    ],
    'Other / Misc.': [
      { id: 'KB-2025-0303', desc: 'Servizi di smaltimento rifiuti di bordo - Porto di Trieste', vendor: 'Ecoservizi Navali', amount: 1500, conf: 0.91 },
      { id: 'KB-2025-0420', desc: 'Disinfestazione cambusa e alloggi equipaggio', vendor: 'Forniture Navali Bonomi', amount: 800, conf: 0.88 },
      { id: 'KB-2025-0518', desc: 'Noleggio attrezzatura ponte per lavori straordinari', vendor: 'Generic Trade SRL', amount: 2100, conf: 0.85 }
    ]
  };
  return mockKB[category] || [];
};

const ReviewDetail = ({ po, onOpenDetail }) => {
  const D = window.SPENDWISE_DATA;
  const [pick, setPick] = React.useState(po.newCat);
  React.useEffect(() => setPick(po.newCat), [po.id]);

  // Mock agent verdicts (slightly different categories on lower-conf POs)
  const verdicts = [
    { a: D.AGENTS[0], cat: po.newCat,   conf: po.conf - 0.04 + Math.random()*0.04 },
    { a: D.AGENTS[1], cat: po.newCat,   conf: po.conf + 0.02 + Math.random()*0.03 },
    { a: D.AGENTS[2], cat: po.conf < 0.7 ? 'IT & Telematics' : po.newCat, conf: po.conf - 0.10 + Math.random()*0.05 },
    { a: D.AGENTS[3], cat: po.newCat,   conf: po.conf },
  ];

  // Similar POs from KB (fallback to RAG simulation if live results are sparse)
  let similarMatches = D.PO_ROWS.filter(p => p.id !== po.id && p.newCat === po.newCat);
  if (similarMatches.length < 3) {
    const mockItems = getMockSimilarPOs(po.newCat);
    similarMatches = [...similarMatches, ...mockItems];
  }
  const similar = similarMatches.slice(0, 3);

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
              <li><b>Lexical:</b> &ldquo;IFO 380 cSt&rdquo; is industry shorthand for <i>Intermediate Fuel Oil, 380 centistoke viscosity</i> - bunker fuel.</li>
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
