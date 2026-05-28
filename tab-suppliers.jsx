/* PRISM - Supplier Consolidation tab */

const TabSuppliers = () => {
  const D = window.PRISM_DATA;
  const sorted = [...D.SUPPLIERS].sort((a,b) => b.spend - a.spend);
  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Supplier Consolidation</h1>
          <div className="sub">Tail-spend rationalization opportunities · best-supplier scoring</div>
        </div>
        <div className="actions">
          <button className="btn btn-sm"><Icon name="filter" size={13}/> Filter</button>
          <button className="btn btn-sm btn-primary"><Icon name="download" size={13}/> Export report</button>
        </div>
      </div>

      <div className="stat-grid" style={{ marginBottom: 16 }}>
        <Stat label="Active suppliers"  value="184" delta={-12}/>
        <Stat label="Recommended to consolidate" value="38"  delta={+4}/>
        <Stat label="Single-source risk" value="9"   delta={-2}/>
        <Stat label="Projected savings"  value="1.62" unit=" M€" delta={+22}/>
        <Stat label="Avg. supplier score" value="84"  unit="/100" delta={+3}/>
      </div>

      <div className="grid-2-1" style={{ marginBottom: 16 }}>
        <Card title="Top consolidation opportunities" sub="overlapping SKUs across tail vendors" padded={false}>
          <table className="po-table">
            <thead>
              <tr><th>Category</th><th>Current vendors</th><th>Recommended</th><th style={{ textAlign:'right' }}>Current spend</th><th style={{ textAlign:'right' }}>Projected savings</th><th>Risk</th></tr>
            </thead>
            <tbody>
              {CONSOLIDATION.map(c => (
                <tr key={c.cat}>
                  <td><b>{c.cat}</b></td>
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap: 4 }}>
                      <span className="mono tnum" style={{ fontSize: 11, color:'var(--muted)' }}>{c.fromN} →</span>
                      <span className="mono tnum" style={{ fontWeight: 700, color:'var(--ok)' }}>{c.toN}</span>
                    </div>
                  </td>
                  <td><span className="pill purple">{c.winner}</span></td>
                  <td className="num mono">{fmtEUR(c.spend)}</td>
                  <td className="num mono" style={{ color:'var(--ok)', fontWeight: 700 }}>+{fmtEUR(c.savings)}</td>
                  <td>{c.risk === 'low' ? <span className="pill green">low</span> : c.risk === 'med' ? <span className="pill amber">medium</span> : <span className="pill red">high</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card title="Score breakdown - top supplier" sub="ENI Marine Fuels">
          <ScoreRadar/>
          <div style={{ display:'flex', flexDirection:'column', gap: 4, marginTop: 10, fontSize: 12 }}>
            {[
              ['Price',         92, 'var(--ok)'],
              ['On-time delivery',95,'var(--ok)'],
              ['Quality (NCR)',  88,'var(--ok)'],
              ['ESG score',      78,'var(--warn)'],
              ['Geographic cov.',96,'var(--ok)'],
              ['Risk (financial)',91,'var(--ok)'],
            ].map(([l,v,c]) => (
              <div key={l} style={{ display:'grid', gridTemplateColumns: '140px 1fr 40px', gap: 6, alignItems:'center' }}>
                <span style={{ color: 'var(--ink-2)' }}>{l}</span>
                <span style={{ position:'relative', height: 6, background:'var(--bg-2)', borderRadius: 3 }}>
                  <span style={{ position:'absolute', left:0, top:0, bottom:0, width: `${v}%`, background: c, borderRadius: 3 }}/>
                </span>
                <span className="mono tnum" style={{ textAlign:'right', fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card title="Suppliers" sub={`${D.SUPPLIERS.length} active`} padded={false}>
        <table className="po-table">
          <thead>
            <tr>
              <th>Supplier</th><th>Country</th><th>Primary categories</th>
              <th style={{ textAlign:'right' }}>POs (YTD)</th>
              <th style={{ textAlign:'right' }}>Spend (YTD)</th>
              <th style={{ textAlign:'right' }}>Score</th>
              <th>Risk</th>
              <th>Recommendation</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((s, i) => {
              const recommend =
                s.perfScore >= 85 ? { txt: 'Strategic partner', cls: 'green' } :
                s.perfScore >= 70 ? { txt: 'Approved', cls: 'blue' } :
                                     { txt: 'Consolidate', cls: 'amber' };
              return (
                <tr key={s.name}>
                  <td><b>{s.name}</b></td>
                  <td><Flag code={s.country}/>{s.country}</td>
                  <td style={{ fontSize: 12, color:'var(--muted)' }}>{primaryCats(i)}</td>
                  <td className="num mono">{s.pos}</td>
                  <td className="num mono"><b>{fmtEUR(s.spend)}</b></td>
                  <td className="num">
                    <span className="mono tnum" style={{ fontWeight: 700, color: s.perfScore >= 85 ? 'var(--ok)' : s.perfScore >= 70 ? 'var(--ink)' : 'var(--warn)' }}>{s.perfScore}</span>
                    <span style={{ color:'var(--muted)' }}>/100</span>
                  </td>
                  <td>
                    {s.risk === 'low'  ? <span className="pill green">low</span>  :
                     s.risk === 'med'  ? <span className="pill amber">medium</span> :
                                         <span className="pill red">high</span>}
                  </td>
                  <td><span className={`pill ${recommend.cls}`}>{recommend.txt}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

const CONSOLIDATION = [
  { cat:'Lubricants & Greases',   fromN: 7,  toN: 2, winner:'Shell Marine Lubricants', spend: 1_640_000, savings:  240_000, risk:'low' },
  { cat:'Marine Spare Parts',     fromN: 14, toN: 4, winner:'Wärtsilä Service Italy',  spend: 3_120_000, savings:  410_000, risk:'med' },
  { cat:'Cleaning & Hygiene',     fromN: 9,  toN: 2, winner:'Mediterraneo Forniture',  spend:   210_000, savings:   38_000, risk:'low' },
  { cat:'Deck & Engine Tools',    fromN: 11, toN: 3, winner:'Generic Trade SRL',       spend:   480_000, savings:   74_000, risk:'med' },
  { cat:'IT & Telematics',        fromN: 5,  toN: 1, winner:'TelMar Solutions',        spend:   260_000, savings:   52_000, risk:'med' },
  { cat:'Provisions / Galley',    fromN: 18, toN: 4, winner:'Forniture Navali Bonomi', spend:   340_000, savings:   46_000, risk:'low' },
];

const primaryCats = (i) => {
  const groups = [
    ['Bunker Fuel'],
    ['Lubricants & Greases'],
    ['Marine Spare Parts', 'Deck & Engine Tools'],
    ['Marine Spare Parts'],
    ['Port & Pilotage Svc.'],
    ['Marine Insurance'],
    ['Lubricants & Greases'],
    ['Marine Insurance'],
    ['Marine Insurance'],
    ['Cleaning & Hygiene', 'Other'],
    ['Provisions / Galley'],
    ['Cleaning & Hygiene'],
  ];
  return (groups[i] || ['-']).join(' · ');
};

const ScoreRadar = () => {
  const labels = ['Price','Delivery','Quality','ESG','Coverage','Risk'];
  const scores = [92, 95, 88, 78, 96, 91];
  const N = labels.length;
  const cx = 110, cy = 110, R = 88;
  const ang = i => -Math.PI/2 + (i/N)*Math.PI*2;
  const pt = (i, r) => [cx + Math.cos(ang(i)) * r, cy + Math.sin(ang(i)) * r];
  const pts = scores.map((s, i) => pt(i, (s/100)*R));
  const path = pts.map((p, i) => (i?'L':'M') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ') + 'Z';

  return (
    <svg width={220} height={220} viewBox="0 0 220 220" style={{ display:'block', margin:'0 auto' }}>
      {[0.25, 0.5, 0.75, 1].map((g, i) => {
        const gp = Array.from({length: N}).map((_,k) => pt(k, R*g));
        const gPath = gp.map((p,k) => (k?'L':'M') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ') + 'Z';
        return <path key={i} d={gPath} fill="none" stroke="var(--line)" />;
      })}
      {Array.from({length: N}).map((_,i) => {
        const p = pt(i, R);
        return <line key={i} x1={cx} y1={cy} x2={p[0]} y2={p[1]} stroke="var(--line)"/>;
      })}
      <path d={path} fill="rgba(0,145,218,0.18)" stroke="var(--accent-blue)" strokeWidth="2"/>
      {pts.map((p,i) => <circle key={i} cx={p[0]} cy={p[1]} r="3" fill="var(--accent-blue)"/>)}
      {labels.map((l, i) => {
        const p = pt(i, R + 14);
        const align = Math.abs(Math.cos(ang(i))) < 0.3 ? 'middle' : (Math.cos(ang(i)) > 0 ? 'start' : 'end');
        return <text key={l} x={p[0]} y={p[1]+3} fontSize="11" textAnchor={align} fill="var(--muted)">{l}</text>;
      })}
    </svg>
  );
};

window.TabSuppliers = TabSuppliers;
