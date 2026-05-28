/* PRISM — Multi-Agent Monitoring tab */

const TabAgents = () => {
  const D = window.PRISM_DATA;
  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Multi-Agent Monitoring</h1>
          <div className="sub">Layer 2 — LangGraph orchestration · 4 agents · health, latency, accuracy</div>
        </div>
        <div className="actions">
          <button className="btn btn-sm"><Icon name="cog" size={13}/> Configure weights</button>
        </div>
      </div>

      {/* Agent cards */}
      <div style={{ display:'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 16 }}>
        {D.AGENTS.map(a => <AgentCard key={a.id} a={a}/>)}
      </div>

      {/* Agent agreement matrix + Routing thresholds */}
      <div className="grid-2" style={{ marginBottom: 16 }}>
        <Card title="Agent agreement" sub="last 24h · % of POs where each pair agreed on category">
          <AgreementMatrix/>
          <div style={{ display:'flex', alignItems:'center', gap: 16, marginTop: 12, fontSize: 11, color: 'var(--muted)' }}>
            <span>Low</span>
            <div style={{ width: 200, height: 10, borderRadius: 5, background: 'linear-gradient(90deg, var(--err) 0%, var(--warn) 50%, var(--ok) 100%)' }}/>
            <span>High</span>
            <span style={{ marginLeft:'auto' }}>3-way consensus rate: <b className="mono tnum">82.4%</b></span>
          </div>
        </Card>

        <Card title="Confidence thresholds" sub="orchestrator routing rules">
          <ThresholdSlider/>
        </Card>
      </div>

      {/* Latency + Volume */}
      <div className="grid-2" style={{ marginBottom: 16 }}>
        <Card title="Latency by agent" sub="p50 / p95, last 24h">
          <LatencyChart/>
        </Card>
        <Card title="Volume by agent" sub="calls/min · last 24h">
          <VolumeChart/>
        </Card>
      </div>

      {/* Agent details table */}
      <Card title="Agent health" sub="real-time" padded={false}>
        <table className="po-table">
          <thead>
            <tr>
              <th>Agent</th><th>Backend</th><th>Status</th>
              <th style={{ textAlign:'right' }}>Calls (24h)</th>
              <th style={{ textAlign:'right' }}>p50</th>
              <th style={{ textAlign:'right' }}>p95</th>
              <th style={{ textAlign:'right' }}>Accuracy</th>
              <th style={{ textAlign:'right' }}>Weight</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {D.AGENTS.map(a => (
              <tr key={a.id}>
                <td><span style={{ display:'inline-flex', alignItems:'center', gap: 8 }}>
                  <span className="dot" style={{ background: a.color, width: 10, height: 10 }}/>
                  <b>{a.name}</b>
                </span></td>
                <td><span className="pill purple">{a.sub}</span></td>
                <td><span className="pill green"><span className="dot" style={{ background: 'currentColor' }}/>healthy</span></td>
                <td className="num mono">{a.calls24h.toLocaleString()}</td>
                <td className="num mono">{Math.round(a.latency*0.6)}ms</td>
                <td className="num mono">{Math.round(a.latency*1.6)}ms</td>
                <td className="num mono"><b>{a.accuracy.toFixed(1)}%</b></td>
                <td className="num mono">{a.weight}%</td>
                <td><button className="btn btn-sm btn-ghost">Inspect →</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

const AgentCard = ({ a }) => {
  // mock 24-pt latency series
  const data = React.useMemo(() => Array.from({length: 24}, () => a.latency * (0.7 + Math.random()*0.6)), [a.id]);
  return (
    <div className="card" style={{ padding: 16 }}>
      <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
        <span style={{ width: 32, height: 32, borderRadius: 8, background: a.color, color: '#fff', display:'grid', placeItems:'center', flexShrink: 0 }}>
          <Icon name={a.id === 'ml' ? 'chart' : a.id === 'llm' ? 'sparkles' : a.id === 'kb' ? 'book' : 'network'} size={16}/>
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700 }}>{a.name}</div>
          <div style={{ fontSize: 11, color: 'var(--muted)' }}>{a.sub}</div>
        </div>
        <span className="pill green" style={{ fontSize: 10 }}><span className="dot" style={{ background:'currentColor' }}/>OK</span>
      </div>
      <div style={{ display:'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginTop: 14 }}>
        <KV label="Accuracy" v={`${a.accuracy.toFixed(1)}%`}/>
        <KV label="Latency"  v={`${a.latency}ms`}/>
        <KV label="Weight"   v={`${a.weight}%`}/>
      </div>
      <div style={{ marginTop: 12 }}>
        <Sparkline data={data} w={240} h={34} color={a.color}/>
      </div>
    </div>
  );
};

const KV = ({ label, v }) => (
  <div>
    <div style={{ fontSize: 10, color: 'var(--muted)', textTransform:'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{label}</div>
    <div style={{ fontSize: 15, fontWeight: 700, marginTop: 2 }} className="tnum">{v}</div>
  </div>
);

const AgreementMatrix = () => {
  const labels = ['ML', 'LLM', 'KB', 'Final'];
  const colors = ['#0091DA','#483698','#00A3A1','#BC204B'];
  // symmetric agreement matrix
  const M = [
    [100, 84,  78,  91],
    [ 84,100,  82,  94],
    [ 78, 82, 100,  89],
    [ 91, 94,  89, 100],
  ];
  const cell = (v) => {
    const t = (v - 70) / 30; // 70..100 -> 0..1
    const tc = Math.max(0, Math.min(1, t));
    const r = Math.round(176 + (0 - 176) * tc);
    const g = Math.round(32 + (135 - 32) * tc);
    const b = Math.round(75 + (90 - 75) * tc);
    return `rgba(${r},${g},${b},${0.18 + tc*0.55})`;
  };
  return (
    <div style={{ display:'grid', gridTemplateColumns: '60px repeat(4, 1fr)', gap: 4 }}>
      <div/>
      {labels.map((l,i) => <div key={l} style={{ textAlign:'center', fontSize: 11, fontWeight: 700, color: colors[i] }}>{l}</div>)}
      {M.map((row, i) => (
        <React.Fragment key={i}>
          <div style={{ fontSize: 11, fontWeight: 700, color: colors[i], textAlign:'right', alignSelf:'center' }}>{labels[i]}</div>
          {row.map((v, j) => (
            <div key={j} style={{
              padding: '14px 6px', textAlign:'center',
              background: i===j ? 'var(--bg-2)' : cell(v),
              borderRadius: 6, fontSize: 12, fontWeight: 600,
              color: i===j ? 'var(--muted)' : (v > 88 ? '#fff' : 'var(--ink)')
            }} className="tnum">{i===j ? '—' : v + '%'}</div>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
};

const ThresholdSlider = () => {
  const [low, setLow] = React.useState(60);
  const [high, setHigh] = React.useState(85);
  return (
    <div>
      <div style={{ position:'relative', height: 36, marginTop: 10 }}>
        <div style={{ position:'absolute', left: 0, right: 0, top: 14, height: 8, borderRadius: 4, background:'linear-gradient(90deg, var(--err) 0%, var(--err) '+low+'%, var(--warn) '+low+'%, var(--warn) '+high+'%, var(--ok) '+high+'%, var(--ok) 100%)' }}/>
        <div style={{ position:'absolute', left: `${low}%`, top: 6, width: 4, height: 22, background:'var(--ink)', borderRadius: 2 }}/>
        <div style={{ position:'absolute', left: `${high}%`, top: 6, width: 4, height: 22, background:'var(--ink)', borderRadius: 2 }}/>
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', fontSize: 11, color:'var(--muted)', marginTop: 4 }}>
        <span>0%</span><span>50%</span><span>100%</span>
      </div>

      <div style={{ display:'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 18 }}>
        <RouteCard color="var(--ok)"   title="Auto-classify"   range={`> ${high}%`}      share="76.3%"/>
        <RouteCard color="var(--warn)" title="Optional review" range={`${low}–${high}%`}  share="18.4%"/>
      </div>
      <div style={{ marginTop: 8 }}>
        <RouteCard color="var(--err)"  title="Mandatory escalation" range={`< ${low}%`}  share="5.3%"/>
      </div>

      <div style={{ marginTop: 14, display:'flex', gap: 8, fontSize: 12, color:'var(--muted)' }}>
        <Icon name="shield" size={14}/> Thresholds are audited and require <b style={{ color:'var(--ink)' }}>approver</b> sign-off.
      </div>

      <div style={{ display:'flex', gap: 16, marginTop: 14, alignItems:'center' }}>
        <label style={{ fontSize: 12, color: 'var(--muted)', flex: 1 }}>
          Lower bound
          <input type="range" min="40" max="80" value={low} onChange={e => setLow(+e.target.value)} style={{ width:'100%', accentColor: 'var(--accent-blue)' }}/>
        </label>
        <label style={{ fontSize: 12, color: 'var(--muted)', flex: 1 }}>
          Upper bound
          <input type="range" min="75" max="95" value={high} onChange={e => setHigh(+e.target.value)} style={{ width:'100%', accentColor: 'var(--accent-blue)' }}/>
        </label>
      </div>
    </div>
  );
};

const RouteCard = ({ color, title, range, share }) => (
  <div style={{ display:'flex', alignItems:'center', gap: 10, padding: 10, border:'1px solid var(--line)', borderRadius: 8 }}>
    <div style={{ width: 6, alignSelf:'stretch', background: color, borderRadius: 3 }}/>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 12.5, fontWeight: 700 }}>{title}</div>
      <div style={{ fontSize: 11, color:'var(--muted)' }}>conf {range}</div>
    </div>
    <div style={{ fontSize: 16, fontWeight: 700 }} className="tnum">{share}</div>
  </div>
);

const LatencyChart = () => {
  const D = window.PRISM_DATA;
  const w = 600, h = 200, padL = 40, padR = 12, padT = 12, padB = 30;
  const cw = w - padL - padR, ch = h - padT - padB;
  const N = 24;
  const series = D.AGENTS.slice(0,3).map(a => ({
    a, data: Array.from({length: N}, () => a.latency * (0.7 + Math.random()*0.6))
  }));
  const maxY = 300;
  const xOf = i => padL + (cw / (N-1)) * i;
  const yOf = v => padT + ch - (v / maxY) * ch;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display:'block', maxWidth:'100%' }}>
      {[0,1,2,3,4].map(i => {
        const y = padT + (ch/4) * i;
        const v = maxY - (maxY/4) * i;
        return <g key={i}>
          <line x1={padL} x2={padL+cw} y1={y} y2={y} stroke="var(--line)" strokeDasharray={i===4?"":"2 3"}/>
          <text x={padL-6} y={y+3} textAnchor="end" fontSize="9" fill="var(--muted)">{v}ms</text>
        </g>;
      })}
      {series.map(s => {
        const path = s.data.map((v,i)=> (i?'L':'M') + xOf(i) + ',' + yOf(v)).join(' ');
        return <path key={s.a.id} d={path} fill="none" stroke={s.a.color} strokeWidth="1.8"/>;
      })}
      <g transform={`translate(${padL+8},${padT+6})`}>
        {series.map((s,i) => (
          <g key={s.a.id} transform={`translate(${i*120},0)`}>
            <line x1="0" y1="6" x2="14" y2="6" stroke={s.a.color} strokeWidth="2"/>
            <text x="18" y="9" fontSize="10.5" fill="var(--ink-2)">{s.a.name}</text>
          </g>
        ))}
      </g>
      <text x={padL} y={h-6} fontSize="10" fill="var(--muted)">24 hours</text>
    </svg>
  );
};

const VolumeChart = () => {
  const D = window.PRISM_DATA;
  const w = 600, h = 200, padL = 40, padR = 12, padT = 12, padB = 30;
  const cw = w - padL - padR, ch = h - padT - padB;
  const N = 24;
  const xOf = i => padL + (cw / N) * i;
  const series = D.AGENTS.slice(0,3).map((a, ai) => Array.from({length: N}, (_,i) => 60 + Math.sin(i/4 + ai)*20 + Math.random()*20));
  const maxY = Math.max(...series.flat()) * 1.1;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display:'block', maxWidth:'100%' }}>
      {[0,1,2,3,4].map(i => {
        const y = padT + (ch/4) * i;
        const v = maxY - (maxY/4) * i;
        return <g key={i}>
          <line x1={padL} x2={padL+cw} y1={y} y2={y} stroke="var(--line)" strokeDasharray={i===4?"":"2 3"}/>
          <text x={padL-6} y={y+3} textAnchor="end" fontSize="9" fill="var(--muted)">{Math.round(v)}</text>
        </g>;
      })}
      {Array.from({length: N}).map((_,i) => {
        const bw = cw/N - 3;
        const xs = xOf(i) + 1;
        let yOff = padT + ch;
        return (
          <g key={i}>
            {series.map((s, si) => {
              const hgt = (s[i] / maxY) * ch / 1.6;
              yOff -= hgt;
              return <rect key={si} x={xs} y={yOff} width={bw} height={hgt} fill={D.AGENTS[si].color} opacity="0.8"/>;
            })}
          </g>
        );
      })}
      <text x={padL} y={h-6} fontSize="10" fill="var(--muted)">24 hours</text>
    </svg>
  );
};

window.TabAgents = TabAgents;
