/* PRISM - Spend Analysis tab */

const TabSpend = () => {
  const D = window.PRISM_DATA;
  const [grouping, setGrouping] = React.useState('category');

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Spend Analysis</h1>
          <div className="sub">Reclassified spend - Mediterranea Cargo Lines · Jan – May 2026</div>
        </div>
        <div className="actions">
          <button className="btn btn-sm"><Icon name="filter" size={13}/> Filter</button>
          <button className="btn btn-sm"><Icon name="download" size={13}/> Export</button>
        </div>
      </div>

      {/* Top stats */}
      <div className="stat-grid" style={{ marginBottom: 16 }}>
        <Stat label="Addressable spend" value="12.7" unit=" M€" delta={3.4}/>
        <Stat label="Tail spend share"   value={D.KPI.tail_spend_share.value} unit="%" delta={D.KPI.tail_spend_share.delta} spark={D.SPARKS.tail_spend} sparkColor="var(--accent-purple)"/>
        <Stat label="Suppliers active"   value={fmtNum(184)} delta={-12}/>
        <Stat label="Consolidation opp." value="1.62" unit=" M€" delta={+22}/>
        <Stat label="Maverick spend"     value="3.1" unit="%" delta={-1.8}/>
      </div>

      {/* Treemap + Tail spend */}
      <div className="grid-2-1" style={{ marginBottom: 16 }}>
        <Card title="Spend by category - reclassified view" sub="UNSPSC, after PRISM"
          right={
            <div className="tog">
              <button className={grouping==='category'?'on':''} onClick={() => setGrouping('category')}>Category</button>
              <button className={grouping==='vendor'?'on':''}   onClick={() => setGrouping('vendor')}>Vendor</button>
              <button className={grouping==='ship'?'on':''}     onClick={() => setGrouping('ship')}>Ship</button>
            </div>
          }>
          {grouping === 'category' && (
            <Treemap width={760} height={320} items={D.CATEGORIES.map(c => ({ label: c.name, value: c.spend, color: c.color }))}/>
          )}
          {grouping === 'vendor' && (
            <Treemap width={760} height={320} items={D.SUPPLIERS.map((s,i) => ({ label: s.name, value: s.spend, color: D.CATEGORIES[i % D.CATEGORIES.length].color }))}/>
          )}
          {grouping === 'ship' && (
            <Treemap width={760} height={320} items={D.FLEET.map((s,i) => ({ label: s.name.replace('MV ',''), value: s.spend, color: D.CATEGORIES[i % D.CATEGORIES.length].color }))}/>
          )}
          <div className="legend" style={{ marginTop: 12 }}>
            {(grouping==='category' ? D.CATEGORIES : []).slice(0, 6).map(c => (
              <div key={c.code} className="li"><span className="sw" style={{ background: c.color }}/>{c.name}</div>
            ))}
          </div>
        </Card>

        <Card title="Tail spend - Pareto" sub="80 / 20">
          <ParetoChart/>
          <div style={{ display:'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginTop: 14 }}>
            <MiniStat label="Top 20% vendors" value="9.8 M€" tone="ok"/>
            <MiniStat label="Tail (80%) vendors" value="2.9 M€" tone="warn"/>
            <MiniStat label="Sub-€10k vendors" value="64" tone="muted"/>
          </div>
          <div style={{ marginTop: 10, padding: 10, background: 'var(--info-bg)', borderRadius: 8, fontSize: 12, color: 'var(--info)' }}>
            <Icon name="sparkles" size={13}/> &nbsp;PRISM identified <b>1.62 M€</b> in consolidation opportunities across 38 tail-spend vendors with overlapping SKUs.
          </div>
        </Card>
      </div>

      {/* Spend trend + Category vs Ship matrix */}
      <div className="grid-2-1" style={{ marginBottom: 16 }}>
        <Card title="Spend trend by category" sub="rolling 12 months">
          <SpendTrendChart/>
        </Card>
        <Card title="Top categories" sub="reclassified">
          <div style={{ display:'flex', flexDirection: 'column', gap: 6 }}>
            {[...D.CATEGORIES].sort((a,b) => b.spend - a.spend).slice(0,7).map(c => (
              <div key={c.code} className="flow-row">
                <div className="from" style={{ width: 130, fontWeight: 600, color: 'var(--ink-2)' }}>{c.name}</div>
                <div className="bar"><div style={{ width: `${(c.spend / D.CATEGORIES[0].spend) * 100}%`, background: c.color }}/></div>
                <div className="val">{fmtEUR(c.spend)}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Before / After reclassification table */}
      <Card title="Reclassification impact" sub="categories with largest spend reattribution" padded={false}>
        <table className="po-table">
          <thead>
            <tr>
              <th>UNSPSC</th><th>Category</th>
              <th style={{ textAlign: 'right' }}>Spend (pre)</th>
              <th style={{ textAlign: 'right' }}>Spend (post)</th>
              <th style={{ textAlign: 'right' }}>Δ Reattributed</th>
              <th style={{ textAlign: 'right' }}>Err. rate ↓</th>
              <th>Confidence</th>
            </tr>
          </thead>
          <tbody>
            {D.CATEGORIES.map(c => {
              const pre = Math.round(c.spend * (1 - (Math.random()*0.18 + 0.05)));
              const delta = c.spend - pre;
              return (
                <tr key={c.code}>
                  <td className="mono" style={{ fontSize: 11.5, color:'var(--muted)' }}>{c.code}</td>
                  <td><span style={{ display:'inline-flex', alignItems:'center', gap: 8 }}><span className="sw" style={{ width:10, height:10, borderRadius:3, background: c.color, display:'inline-block' }}/>{c.name}</span></td>
                  <td className="num mono" style={{ color: 'var(--muted)' }}>{fmtEUR(pre)}</td>
                  <td className="num mono"><b>{fmtEUR(c.spend)}</b></td>
                  <td className="num mono" style={{ color: delta > 0 ? 'var(--ok)' : 'var(--err)' }}>{delta > 0 ? '+' : ''}{fmtEUR(delta)}</td>
                  <td className="num"><span className="pill green">−{(c.errPrev - c.errNow).toFixed(1)} pp</span></td>
                  <td><ConfChip conf={0.85 + Math.random()*0.12}/></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

const MiniStat = ({ label, value, tone }) => {
  const colors = { ok: 'var(--ok)', warn: 'var(--warn)', muted: 'var(--muted)' };
  return (
    <div style={{ padding: 10, border: '1px solid var(--line)', borderRadius: 8 }}>
      <div style={{ fontSize: 10.5, color: 'var(--muted)', textTransform:'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 700, marginTop: 4, color: colors[tone] || 'var(--ink)' }} className="tnum">{value}</div>
    </div>
  );
};

const ParetoChart = () => {
  // Pareto: bars (descending vendor spend) + cumulative line
  const D = window.PRISM_DATA;
  const vendors = [...D.SUPPLIERS].sort((a,b) => b.spend - a.spend);
  const total = vendors.reduce((s,v) => s + v.spend, 0);
  const w = 360, h = 200, padL = 28, padR = 36, padT = 12, padB = 28;
  const cw = w - padL - padR, ch = h - padT - padB;
  const maxV = vendors[0].spend;
  let cum = 0;
  const cumPoints = vendors.map((v, i) => {
    cum += v.spend;
    return [padL + (cw / vendors.length) * (i + 0.5), padT + ch - (cum/total) * ch];
  });
  const cumPath = cumPoints.map((p,i) => (i?'L':'M') + p[0] + ',' + p[1]).join(' ');

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display:'block', overflow:'visible' }}>
      {[0, 0.25, 0.5, 0.75, 1].map((g, i) => (
        <line key={i} x1={padL} x2={padL+cw} y1={padT + ch*(1-g)} y2={padT + ch*(1-g)} stroke="var(--line)" strokeDasharray={i? "2 3":""}/>
      ))}
      {[0, 25, 50, 75, 100].map((g, i) => (
        <text key={i} x={padL+cw+4} y={padT + ch*(1-g/100)+3} fontSize="9" fill="var(--muted)">{g}%</text>
      ))}
      {vendors.map((v, i) => {
        const bw = cw / vendors.length - 3;
        const bh = (v.spend / maxV) * ch;
        return <rect key={v.name} x={padL + (cw/vendors.length)*i + 1} y={padT + ch - bh} width={bw} height={bh} fill="var(--accent-blue)" opacity={0.5 + 0.5*(1-i/vendors.length)}/>;
      })}
      <path d={cumPath} fill="none" stroke="var(--accent-pink)" strokeWidth="2"/>
      {cumPoints.map((p,i) => <circle key={i} cx={p[0]} cy={p[1]} r="2.4" fill="var(--accent-pink)"/>)}
      <line x1={padL} x2={padL+cw} y1={padT + ch*0.2} y2={padT + ch*0.2} stroke="var(--warn)" strokeDasharray="4 3" strokeWidth="1"/>
      <text x={padL+2} y={padT + ch*0.2 - 4} fontSize="10" fill="var(--warn)">80% cumulative</text>
      <text x={padL} y={h-6} fontSize="10" fill="var(--muted)">vendors (sorted by spend)</text>
    </svg>
  );
};

const SpendTrendChart = () => {
  const D = window.PRISM_DATA;
  const months = ['Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May'];
  const cats = D.CATEGORIES.slice(0,4);
  const w = 720, h = 220, padL = 40, padR = 12, padT = 12, padB = 30;
  const cw = w - padL - padR, ch = h - padT - padB;
  // build stacked series
  const totals = months.map(() => 0);
  const series = cats.map((c, ci) => {
    const arr = months.map((_, mi) => {
      const base = c.spend / 12;
      return base * (0.7 + 0.6 * Math.sin(mi/3 + ci) * 0.5 + Math.random()*0.25);
    });
    return { c, arr };
  });
  const stacked = series.map(s => {
    const bottoms = totals.slice();
    s.arr.forEach((v, i) => totals[i] += v);
    return { c: s.c, bottoms, vals: s.arr };
  });
  const maxY = Math.max(...totals);
  const xOf = i => padL + (cw / (months.length-1)) * i;
  const yOf = v => padT + ch - (v / maxY) * ch;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display:'block', overflow:'visible', maxWidth: '100%' }}>
      {[0,1,2,3,4].map(i => {
        const y = padT + (ch/4) * i;
        const v = maxY - (maxY/4) * i;
        return (
          <g key={i}>
            <line x1={padL} x2={padL+cw} y1={y} y2={y} stroke="var(--line)" strokeDasharray={i===4?"":"2 3"}/>
            <text x={padL-6} y={y+3} textAnchor="end" fontSize="9" fill="var(--muted)">{fmtEUR(v)}</text>
          </g>
        );
      })}
      {months.map((m, i) => (
        <text key={m+i} x={xOf(i)} y={h-12} textAnchor="middle" fontSize="10" fill="var(--muted)">{m}</text>
      ))}
      {stacked.map((s, si) => {
        const top = s.vals.map((v, i) => [xOf(i), yOf(s.bottoms[i] + v)]);
        const bot = s.vals.map((v, i) => [xOf(i), yOf(s.bottoms[i])]).reverse();
        const d = [...top, ...bot].map((p, i) => (i?'L':'M') + p[0] + ',' + p[1]).join(' ') + 'Z';
        return <path key={si} d={d} fill={s.c.color} opacity={0.85}/>;
      })}
      <g transform={`translate(${padL+8},${padT+10})`}>
        {cats.map((c, i) => (
          <g key={c.code} transform={`translate(0, ${i*16})`}>
            <rect width="10" height="10" fill={c.color} rx="2"/>
            <text x="14" y="9" fontSize="10.5" fill="var(--ink-2)">{c.name}</text>
          </g>
        ))}
      </g>
    </svg>
  );
};

window.TabSpend = TabSpend;
