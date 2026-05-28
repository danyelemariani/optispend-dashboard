/* PRISM - Model Performance & Drift tab */

const TabModel = () => {
  const D = window.PRISM_DATA;
  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Model Performance &amp; Drift</h1>
          <div className="sub">v3.2 - XGBoost ensemble + LLM head · MLflow tracked</div>
        </div>
        <div className="actions">
          <button className="btn btn-sm"><Icon name="cog" size={13}/> Retrain settings</button>
          <button className="btn btn-sm btn-primary"><Icon name="play" size={13}/> Trigger retrain</button>
        </div>
      </div>

      <div className="stat-grid" style={{ marginBottom: 16 }}>
        <Stat label="Accuracy"  value="94.2" unit="%" delta={+1.7} spark={D.SPARKS.accuracy} sparkColor="var(--ok)"/>
        <Stat label="Precision (macro)" value="92.8" unit="%" delta={+1.4}/>
        <Stat label="Recall (macro)"    value="91.6" unit="%" delta={+1.1}/>
        <Stat label="F1 (macro)"        value="92.2" unit="%" delta={+1.2}/>
        <Stat label="Drift score"       value={D.KPI.drift_score.value} delta={D.KPI.drift_score.delta} spark={D.SPARKS.drift_score} sparkColor="var(--warn)"/>
      </div>

      <div className="grid-2-1" style={{ marginBottom: 16 }}>
        <Card title="Drift detection" sub="population stability index (PSI) - 90 days">
          <LineChart data={D.DRIFT} w={760} h={220} color="var(--accent-purple)" threshold={0.1} label="days (90d window)"/>
          <div style={{ display:'flex', gap: 14, marginTop: 4, fontSize: 12, color:'var(--muted)' }}>
            <span style={{ display:'inline-flex', alignItems:'center', gap: 6 }}><span className="dot" style={{ background: 'var(--ok)'}}/>green &lt; 0.1</span>
            <span style={{ display:'inline-flex', alignItems:'center', gap: 6 }}><span className="dot" style={{ background: 'var(--warn)'}}/>watch 0.1–0.2</span>
            <span style={{ display:'inline-flex', alignItems:'center', gap: 6 }}><span className="dot" style={{ background: 'var(--err)'}}/>retrain &gt; 0.2</span>
            <span style={{ marginLeft:'auto' }}>last alert: <b>none in 21 days</b></span>
          </div>
        </Card>

        <Card title="Drift by feature" sub="top contributors">
          {[
            { f: 'vendor distribution',         psi: 0.08 },
            { f: 'description length',          psi: 0.04 },
            { f: 'amount distribution',         psi: 0.11 },
            { f: 'UoM frequency',               psi: 0.03 },
            { f: 'port of origin',              psi: 0.05 },
            { f: 'ship type',                   psi: 0.02 },
          ].map((d, i) => (
            <div key={i} style={{ display:'grid', gridTemplateColumns: '140px 1fr 50px', gap: 8, padding:'7px 0', borderBottom: '1px dashed var(--line)', fontSize: 12 }}>
              <span>{d.f}</span>
              <span style={{ position:'relative', height: 8, background:'var(--bg-2)', borderRadius: 4 }}>
                <span style={{ position:'absolute', left:0, top:0, bottom:0, width: `${(d.psi/0.2)*100}%`, background: d.psi > 0.1 ? 'var(--warn)' : 'var(--ok)', borderRadius: 4 }}/>
              </span>
              <span className="mono tnum" style={{ textAlign:'right', fontWeight: 600 }}>{d.psi.toFixed(2)}</span>
            </div>
          ))}
        </Card>
      </div>

      <div className="grid-1-2" style={{ marginBottom: 16 }}>
        <Card title="Confusion matrix" sub="top 6 categories">
          <ConfusionMatrix/>
        </Card>

        <Card title="Accuracy by category" sub="last 30 days">
          <CategoryAccChart/>
        </Card>
      </div>

      <div className="grid-2" style={{ marginBottom: 16 }}>
        <Card title="Retraining pipeline" sub="Apache Airflow · ml-prism-retrain DAG">
          <RetrainPipeline/>
        </Card>
        <Card title="Hyperparameters" sub="v3.2 - XGBoost classifier">
          <HyperparamGrid/>
        </Card>
      </div>
    </div>
  );
};

const ConfusionMatrix = () => {
  const D = window.PRISM_DATA;
  const M = D.CONFUSION;
  const labels = D.CONFUSION_LABELS;
  const allMax = Math.max(...M.flat());
  return (
    <div style={{ display:'grid', gridTemplateColumns: '60px repeat(6,1fr)', gap: 3 }}>
      <div/>
      {labels.map(l => <div key={l} style={{ fontSize: 10.5, fontWeight: 700, color:'var(--muted)', textAlign:'center' }}>{l}</div>)}
      {M.map((row, i) => (
        <React.Fragment key={i}>
          <div style={{ fontSize: 10.5, fontWeight: 700, color:'var(--muted)', textAlign:'right', alignSelf:'center' }}>{labels[i]}</div>
          {row.map((v, j) => {
            const t = v / allMax;
            const isDiag = i === j;
            const bg = isDiag
              ? `rgba(0,135,90,${0.18 + t*0.7})`
              : `rgba(176,0,32,${0.05 + t*0.65})`;
            return (
              <div key={j} style={{
                padding: '10px 4px', textAlign:'center',
                background: bg, borderRadius: 4,
                fontSize: 11, fontWeight: 600,
                color: t > 0.5 ? '#fff' : 'var(--ink)'
              }} className="tnum">
                {v}
              </div>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
};

const CategoryAccChart = () => {
  const D = window.PRISM_DATA;
  const items = D.CATEGORIES.slice(0,8).map(c => ({
    cat: c.name,
    acc: 100 - c.errNow,
    color: c.color,
  }));
  return (
    <div style={{ display:'flex', flexDirection:'column', gap: 9 }}>
      {items.map(it => (
        <div key={it.cat} style={{ display:'grid', gridTemplateColumns: '170px 1fr 60px', gap: 8, fontSize: 12.5, alignItems:'center' }}>
          <span style={{ fontWeight: 600, color: 'var(--ink-2)' }}>{it.cat}</span>
          <span style={{ position:'relative', height: 14, background:'var(--bg-2)', borderRadius: 4, overflow:'hidden' }}>
            <span style={{ position:'absolute', left:0, top:0, bottom:0, width: `${it.acc}%`, background: it.color, borderRadius: 4 }}/>
            <span style={{ position:'absolute', right: 6, top: -1, fontSize: 10.5, color: '#fff', mixBlendMode: 'difference' }} className="mono tnum">{it.acc.toFixed(1)}%</span>
          </span>
          <span className="mono tnum" style={{ textAlign:'right', fontWeight: 700 }}>{it.acc.toFixed(1)}%</span>
        </div>
      ))}
    </div>
  );
};

const RetrainPipeline = () => {
  const steps = [
    { t: 'Collect corrections',  v: '+348 samples in buffer', dur: '12s',  ok: true },
    { t: 'Validate annotations', v: '12 disagreements → committee', dur: '3m', ok: true },
    { t: 'Train XGBoost',        v: '12 trees, depth 6 · MLflow run 412', dur: '8m', ok: true },
    { t: 'Evaluate on holdout',  v: 'acc 94.6% (+0.4)', dur: '1m', ok: true },
    { t: 'Bias / fairness check',v: 'no per-vendor disparity', dur: '40s', ok: true },
    { t: 'Approval gate',        v: 'awaiting platform admin', dur: '-', ok: false, pending: true },
    { t: 'Deploy to staging',    v: 'pending approval', dur: '-', ok: false, pending: true },
  ];
  return (
    <div>
      {steps.map((s, i) => (
        <div key={i} style={{ display:'grid', gridTemplateColumns:'22px 1fr 60px', gap: 10, padding: '8px 0', borderBottom: i < steps.length-1 ? '1px dashed var(--line)' : 'none', alignItems:'center' }}>
          <span style={{
            width: 18, height: 18, borderRadius: 9,
            background: s.ok ? 'var(--ok)' : s.pending ? 'var(--warn-bg)' : 'var(--line-2)',
            color: s.ok ? '#fff' : 'var(--warn)',
            display:'grid', placeItems:'center', fontSize: 10, fontWeight: 700
          }}>
            {s.ok ? <Icon name="check" size={11}/> : s.pending ? '·' : i+1}
          </span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{s.t}</div>
            <div style={{ fontSize: 11.5, color:'var(--muted)' }}>{s.v}</div>
          </div>
          <span className="mono" style={{ textAlign:'right', fontSize: 11, color:'var(--muted)' }}>{s.dur}</span>
        </div>
      ))}
      <div style={{ marginTop: 12, padding: 10, background:'var(--warn-bg)', borderRadius: 8, fontSize: 12, color:'var(--warn)' }}>
        <Icon name="flag" size={13}/> &nbsp;Next retrain candidate <b>v3.3</b> is ready for promotion - accuracy delta +0.4pp.
      </div>
    </div>
  );
};

const HyperparamGrid = () => {
  const hps = [
    ['n_estimators',     '300'],
    ['max_depth',         '6'],
    ['learning_rate',     '0.08'],
    ['min_child_weight',  '3'],
    ['subsample',         '0.85'],
    ['colsample_bytree',  '0.8'],
    ['gamma',             '0.2'],
    ['reg_alpha',         '0.5'],
    ['reg_lambda',        '1.2'],
    ['objective',         'multi:softprob'],
    ['embedding model',   'text-embedding-3-large'],
    ['embedding dim',     '3072'],
  ];
  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 4, fontSize: 12 }}>
      {hps.map(([k,v]) => (
        <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'7px 10px', background:'var(--surface-2)', border:'1px solid var(--line)', borderRadius: 6 }}>
          <span style={{ color:'var(--muted)', fontFamily:'JetBrains Mono', fontSize: 11.5 }}>{k}</span>
          <span style={{ fontWeight: 600, fontFamily:'JetBrains Mono' }}>{v}</span>
        </div>
      ))}
    </div>
  );
};

window.TabModel = TabModel;
