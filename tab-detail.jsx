/* SpendWise - PO Detail + Explainability tab */

const TabDetail = () => {
  const D = window.SPENDWISE_DATA;
  const po = D.PO_ROWS[0]; // featured PO

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="sub" style={{ marginBottom: 4, fontSize: 11.5, letterSpacing:'0.04em', textTransform:'uppercase', fontWeight: 600 }}>Purchase Order · explainability</div>
          <h1 style={{ display:'flex', alignItems:'center', gap: 10 }}>
            <span className="mono" style={{ fontSize: 22 }}>{po.id}</span>
            <RoutePill route="auto"/>
            <ConfChip conf={po.conf}/>
          </h1>
          <div className="sub" style={{ marginTop: 4 }}>{po.vendor} · {fmtEURexact(po.amount)} · {po.ship} · {po.origin}</div>
        </div>
        <div className="actions">
          <button className="btn btn-sm"><Icon name="link" size={13}/> SAP record</button>
          <button className="btn btn-sm"><Icon name="download" size={13}/> Export audit</button>
        </div>
      </div>

      {/* Description card */}
      <Card title="PO description" sub="from ERP" padded={true} className="" 
        right={<span className="pill purple">SAP MM · 4500038217</span>}>
        <div style={{ fontSize: 16, lineHeight: 1.55, color:'var(--ink-2)' }}>{po.desc}</div>
        <div className="sep"/>
        <div style={{ display:'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 14 }}>
          <KV2 label="Original category" v={<span style={{ textDecoration:'line-through', color:'var(--muted)' }}>{po.oldCat}</span>}/>
          <KV2 label="Reclassified to"   v={<span style={{ color:'var(--ok)', fontWeight: 700 }}>{po.newCat}</span>}/>
          <KV2 label="UNSPSC"            v="15101500" mono/>
          <KV2 label="Model version"     v="v3.2 / 2026-04-28" mono/>
          <KV2 label="Processed at"      v="14:32:18 CET" mono/>
        </div>
      </Card>

      <div style={{ height: 16 }}/>

      {/* Pipeline trace */}
      <Card title="Pipeline trace" sub="9ms total (orchestration only) · 403ms incl. agents">
        <PipelineTrace po={po}/>
      </Card>

      <div style={{ height: 16 }}/>

      {/* SHAP + LLM reasoning */}
      <div className="grid-2">
        <Card title="ML feature attribution" sub="SHAP - XGBoost v3.2">
          <ShapBars/>
          <div style={{ marginTop: 10, padding: 10, background: 'var(--info-bg)', borderRadius: 8, fontSize: 12, color:'var(--info)' }}>
            <b>Top driver:</b> vendor identity (ENI) contributes +0.42 to the &ldquo;Bunker Fuel&rdquo; logit. Unit of measure &ldquo;MT&rdquo; adds +0.21.
          </div>
        </Card>

        <Card title="LLM reasoning chain" sub="Azure GPT-4o · chain-of-thought">
          <div style={{ display:'flex', flexDirection: 'column', gap: 10 }}>
            <ReasonStep n="1" title="Tokenize &amp; identify domain markers">
              Found marine-fuel jargon: <code className="mono">IFO 380 cSt</code>, <code className="mono">cSt</code> = centistoke (viscosity), <code className="mono">MT</code> = metric tonne, port name <i>Algeciras</i>.
            </ReasonStep>
            <ReasonStep n="2" title="Map to UNSPSC family">
              IFO is intermediate fuel oil - UNSPSC segment <b>15</b> (Fuels). Most specific: <b>15101500</b> &mdash; bunker fuel.
            </ReasonStep>
            <ReasonStep n="3" title="Validate vendor consistency">
              Vendor &ldquo;ENI Marine Fuels&rdquo; historical category distribution: 98% Bunker Fuel. Consistent.
            </ReasonStep>
            <ReasonStep n="4" title="Reject competing categories">
              Not lubricants (no viscosity grade like SAE 40/50). Not generic supplies (specific quantity in MT and delivery port).
            </ReasonStep>
            <ReasonStep n="5" title="Final answer" final>
              <b style={{ color: 'var(--ok)' }}>Bunker Fuel</b> · UNSPSC 15101500 · conf <b className="mono tnum">0.96</b>.
            </ReasonStep>
          </div>
        </Card>
      </div>

      <div style={{ height: 16 }}/>

      {/* KB matches + line items */}
      <div className="grid-2-1">
        <Card title="Line items" sub="3 lines on this PO" padded={false}>
          <table className="po-table">
            <thead>
              <tr><th>#</th><th>Material</th><th>Qty</th><th>UoM</th><th style={{ textAlign:'right' }}>Unit price</th><th style={{ textAlign:'right' }}>Total</th><th>Reclass</th></tr>
            </thead>
            <tbody>
              <tr>
                <td className="mono" style={{ color:'var(--muted)' }}>001</td>
                <td>IFO 380 cSt bunker fuel<div className="desc">RMG 380, ISO 8217:2017</div></td>
                <td className="num mono">240</td>
                <td>MT</td>
                <td className="num mono">€565.00</td>
                <td className="num mono"><b>€135,600</b></td>
                <td><span className="pill green">Bunker Fuel</span></td>
              </tr>
              <tr>
                <td className="mono" style={{ color:'var(--muted)' }}>002</td>
                <td>Bunker delivery service<div className="desc">barge-to-ship, port of Algeciras</div></td>
                <td className="num mono">1</td>
                <td>SVC</td>
                <td className="num mono">€4,800</td>
                <td className="num mono"><b>€4,800</b></td>
                <td><span className="pill purple">Port &amp; Pilotage</span></td>
              </tr>
              <tr>
                <td className="mono" style={{ color:'var(--muted)' }}>003</td>
                <td>Sampling &amp; certification<div className="desc">independent surveyor</div></td>
                <td className="num mono">1</td>
                <td>SVC</td>
                <td className="num mono">€2,000</td>
                <td className="num mono"><b>€2,000</b></td>
                <td><span className="pill amber">Marine Insurance</span></td>
              </tr>
            </tbody>
          </table>
        </Card>

        <Card title="Knowledge base matches" sub="UNSPSC 15101500">
          <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 10 }}>Top similar historical POs (vector distance):</div>
          {[
            { id:'PO-2026-47891', dist: 0.04, desc:'IFO 380 cSt bunker, 200 MT, Genova' },
            { id:'PO-2026-47502', dist: 0.06, desc:'IFO 180 cSt bunker, 150 MT, Trieste' },
            { id:'PO-2026-46118', dist: 0.09, desc:'MGO bunker fuel, 80 MT, Napoli' },
            { id:'PO-2025-92044', dist: 0.11, desc:'IFO 380 cSt, 220 MT, Gioia Tauro' },
            { id:'PO-2025-88712', dist: 0.13, desc:'Bunker fuel + delivery svc, Genova' },
          ].map(s => (
            <div key={s.id} style={{ display:'grid', gridTemplateColumns: '110px 1fr 50px', gap: 8, padding: '8px 0', borderBottom: '1px dashed var(--line)', fontSize: 12 }}>
              <span className="mono" style={{ fontSize: 11, color:'var(--muted)' }}>{s.id}</span>
              <span>{s.desc}</span>
              <span className="mono tnum" style={{ textAlign:'right', color: 'var(--accent-blue)', fontWeight: 600 }}>{s.dist.toFixed(2)}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};

const PipelineTrace = ({ po }) => {
  const D = window.SPENDWISE_DATA;
  const steps = [
    { t: 0,     who: 'Ingestion',     msg: 'PO record retrieved from SAP MM',                     latency: 8,   color: 'var(--ink-2)' },
    { t: 8,     who: 'Preprocess',    msg: 'Tokenize · UoM normalized · vendor matched',           latency: 12,  color: 'var(--ink-2)' },
    { t: 20,    who: D.AGENTS[0].name,msg: 'XGBoost predicted Bunker Fuel · 0.93',                 latency: 38,  color: D.AGENTS[0].color },
    { t: 20,    who: D.AGENTS[1].name,msg: 'GPT-4o predicted Bunker Fuel · 0.96',                  latency: 220, color: D.AGENTS[1].color },
    { t: 20,    who: D.AGENTS[2].name,msg: 'KB returned 5 similar · UNSPSC 15101500',              latency: 145, color: D.AGENTS[2].color },
    { t: 240,   who: D.AGENTS[3].name,msg: 'Weighted consensus → Bunker Fuel · 0.96',              latency: 9,   color: D.AGENTS[3].color },
    { t: 249,   who: 'Governance',    msg: 'Confidence 0.96 > 0.85 → auto-approved · audit logged',latency: 4,   color: 'var(--ok)' },
  ];
  const max = 280;
  return (
    <div style={{ display:'flex', flexDirection:'column', gap: 6 }}>
      {steps.map((s, i) => (
        <div key={i} style={{ display:'grid', gridTemplateColumns: '60px 130px 1fr 60px', gap: 10, alignItems:'center', fontSize: 12 }}>
          <span className="mono" style={{ color:'var(--muted)', fontSize: 11 }}>+{s.t}ms</span>
          <span style={{ display:'flex', alignItems:'center', gap: 6, fontWeight: 600 }}>
            <span className="dot" style={{ background: s.color }}/>{s.who}
          </span>
          <span style={{ position:'relative', height: 14, background:'var(--bg-2)', borderRadius: 3 }}>
            <span style={{
              position:'absolute', left: `${(s.t/max)*100}%`, width: `${(s.latency/max)*100}%`,
              top: 0, bottom: 0, background: s.color, opacity: 0.85, borderRadius: 3,
            }}/>
          </span>
          <span className="mono tnum" style={{ textAlign:'right', color: 'var(--ink-2)' }}>{s.latency}ms</span>
        </div>
      ))}
    </div>
  );
};

const ShapBars = () => {
  const feats = [
    { lbl: 'vendor = ENI Marine Fuels',        val: 0.42 },
    { lbl: 'unit_of_measure = MT',             val: 0.21 },
    { lbl: 'desc contains "IFO 380"',          val: 0.18 },
    { lbl: 'desc contains "bunker"',           val: 0.14 },
    { lbl: 'amount magnitude (€100k–200k)',    val: 0.09 },
    { lbl: 'port = Algeciras',                 val: 0.04 },
    { lbl: 'desc contains "viscosity"',        val: 0.03 },
    { lbl: 'ship_type = Tanker',               val: -0.06 },
    { lbl: 'historical vendor cat = Lub.',     val: -0.08 },
  ];
  const max = Math.max(...feats.map(f => Math.abs(f.val)));
  return (
    <div>
      {feats.map((f, i) => (
        <div key={i} className="shap-row">
          <span className="lbl">{f.lbl}</span>
          <div className="shap-bar">
            <div className={`b ${f.val >= 0 ? 'pos' : 'neg'}`} style={{ width: `${(Math.abs(f.val)/max)*50}%` }}/>
          </div>
          <span className="val">{f.val >= 0 ? '+' : ''}{f.val.toFixed(2)}</span>
        </div>
      ))}
    </div>
  );
};

const ReasonStep = ({ n, title, children, final }) => (
  <div style={{ display:'grid', gridTemplateColumns: '24px 1fr', gap: 10 }}>
    <div style={{
      width: 22, height: 22, borderRadius: 11,
      background: final ? 'var(--ok)' : 'var(--accent-blue)', color:'#fff',
      display:'grid', placeItems:'center', fontWeight: 700, fontSize: 11
    }}>{n}</div>
    <div>
      <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>{title}</div>
      <div style={{ fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.5 }}>{children}</div>
    </div>
  </div>
);

window.TabDetail = TabDetail;
