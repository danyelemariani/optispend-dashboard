/* PRISM - Governance & Audit tab */

const TabGovernance = () => {
  const D = window.PRISM_DATA;
  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Governance &amp; Audit</h1>
          <div className="sub">Layer 3 - accountability · model lineage · audit trail</div>
        </div>
        <div className="actions">
          <button className="btn btn-sm"><Icon name="download" size={13}/> Export audit log</button>
        </div>
      </div>

      <div className="stat-grid" style={{ marginBottom: 16 }}>
        <Stat label="Audit events (24h)" value="3,184" delta={+4.2}/>
        <Stat label="Compliance score"  value="97.4" unit="%" delta={+0.6}/>
        <Stat label="Open issues"       value="2" delta={0}/>
        <Stat label="Model versions live" value="1"  delta={0}/>
        <Stat label="Avg. time-to-audit" value="0.3" unit=" s" delta={-0.1}/>
      </div>

      <div className="grid-2-1" style={{ marginBottom: 16 }}>
        <Card title="Audit trail" sub="immutable · append-only" padded={false}
          right={<button className="btn btn-sm btn-ghost"><Icon name="filter" size={12}/> filter</button>}>
          <table className="po-table">
            <thead>
              <tr><th>Timestamp</th><th>Actor</th><th>Action</th><th>Target</th><th>Detail</th><th></th></tr>
            </thead>
            <tbody>
              {D.AUDIT.map((a,i) => (
                <tr key={i}>
                  <td className="mono" style={{ fontSize: 11, color: 'var(--muted)', whiteSpace:'nowrap' }}>{a.ts}</td>
                  <td className="mono" style={{ fontSize: 12 }}>{a.actor}</td>
                  <td><ActionPill action={a.action}/></td>
                  <td className="mono" style={{ fontSize: 12, color: 'var(--ink-2)' }}>{a.target}</td>
                  <td style={{ fontSize: 12.5, color: 'var(--ink-2)' }}>{a.detail}</td>
                  <td style={{ textAlign:'right' }}>
                    {a.kind === 'ok' && <span className="pill green"><Icon name="check" size={10}/>ok</span>}
                    {a.kind === 'info' && <span className="pill blue">info</span>}
                    {a.kind === 'warn' && <span className="pill amber"><Icon name="flag" size={10}/>flag</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card title="Compliance posture">
          <div style={{ display:'flex', flexDirection: 'column', gap: 10 }}>
            <ComplianceItem ok title="EU AI Act - high-risk classification" sub="DPIA · data lineage · human oversight"/>
            <ComplianceItem ok title="GDPR - data residency (Azure EU)" sub="processing region: West Europe (Amsterdam)"/>
            <ComplianceItem ok title="ISO/IEC 42001 - AI management" sub="certified · audit 2026-03"/>
            <ComplianceItem ok title="SOC 2 Type II - data security" sub="renewed 2026-01"/>
            <ComplianceItem warn title="UNSPSC dictionary version drift" sub="6 codes outdated · update queued"/>
            <ComplianceItem ok title="Model card v3.2 published" sub="explainability + bias evaluation"/>
          </div>
        </Card>
      </div>

      <div className="grid-2" style={{ marginBottom: 16 }}>
        <Card title="Model lineage" sub="v3.2 - current">
          <ModelLineage/>
        </Card>
        <Card title="Roles &amp; access" sub="RBAC">
          <RoleTable/>
        </Card>
      </div>

      <Card title="Data lineage" sub="end-to-end traceability">
        <DataLineage/>
      </Card>
    </div>
  );
};

const ActionPill = ({ action }) => {
  const map = {
    CLASSIFY: 'blue', APPROVE: 'green', REJECT: 'red', RETRAIN: 'purple',
    DRIFT: 'amber', DEPLOY: 'purple', INGEST: 'blue', CONFIG: 'amber'
  };
  return <span className={`pill ${map[action] || ''}`} style={{ fontFamily:'JetBrains Mono', fontSize: 10.5 }}>{action}</span>;
};

const ComplianceItem = ({ ok, warn, title, sub }) => (
  <div style={{ display:'flex', gap: 10, padding: 10, border:'1px solid var(--line)', borderRadius: 8 }}>
    <div style={{
      width: 28, height: 28, borderRadius: 8, flexShrink: 0,
      background: ok ? 'var(--ok-bg)' : 'var(--warn-bg)',
      color:    ok ? 'var(--ok)'    : 'var(--warn)',
      display:'grid', placeItems:'center'
    }}>
      <Icon name={ok ? 'check' : 'flag'} size={15}/>
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 13, fontWeight: 600 }}>{title}</div>
      <div style={{ fontSize: 11.5, color:'var(--muted)' }}>{sub}</div>
    </div>
    <span className={`pill ${ok ? 'green':'amber'}`} style={{ alignSelf:'flex-start' }}>{ok ? 'PASS' : 'WATCH'}</span>
  </div>
);

const ModelLineage = () => {
  const versions = [
    { v: 'v3.2', date: '2026-04-28', acc: 94.2, status:'live',     by:'l.conti@optispend.io' },
    { v: 'v3.1', date: '2026-03-12', acc: 92.8, status:'archived', by:'l.conti@optispend.io' },
    { v: 'v3.0', date: '2026-01-22', acc: 91.4, status:'archived', by:'g.ferraro@optispend.io' },
    { v: 'v2.4', date: '2025-11-04', acc: 89.1, status:'archived', by:'g.ferraro@optispend.io' },
  ];
  return (
    <div style={{ display:'flex', flexDirection: 'column', gap: 0 }}>
      {versions.map((v, i) => (
        <div key={v.v} style={{ display:'grid', gridTemplateColumns:'80px 110px 1fr 70px', gap: 12, padding: '10px 0', borderBottom: i < versions.length-1 ? '1px solid var(--line)' : 'none', fontSize: 13, alignItems:'center' }}>
          <span style={{ fontWeight: 700, fontFamily:'JetBrains Mono' }}>{v.v}</span>
          <span className="mono" style={{ color:'var(--muted)', fontSize: 12 }}>{v.date}</span>
          <span style={{ color:'var(--muted)', fontSize: 12 }}>by {v.by} · accuracy <b className="mono tnum" style={{ color:'var(--ink)' }}>{v.acc}%</b></span>
          <span style={{ textAlign:'right' }}>
            {v.status === 'live' ? <span className="pill green">live</span> : <span className="pill">archived</span>}
          </span>
        </div>
      ))}
    </div>
  );
};

const RoleTable = () => {
  const rows = [
    { user: 'M. Rossi',       role: 'Reviewer',           scope: 'cargo-shipping', last: '2 min ago' },
    { user: 'A. Bianchi',     role: 'Senior Reviewer',    scope: 'cargo-shipping', last: '14 min ago' },
    { user: 'L. Conti',       role: 'ML Engineer',        scope: 'all',            last: '1 h ago' },
    { user: 'G. Ferraro',     role: 'Platform Admin',     scope: 'all',            last: '3 h ago' },
    { user: 'E. Pellegrini',  role: 'Procurement Lead',   scope: 'cargo-shipping', last: '5 h ago' },
    { user: 'S. Marchetti',   role: 'Auditor (read-only)',scope: 'all',            last: 'yesterday' },
  ];
  return (
    <table style={{ width:'100%', fontSize: 12.5 }}>
      <thead>
        <tr style={{ borderBottom: '1px solid var(--line)' }}>
          <th style={{ textAlign:'left', padding:'8px 0', fontSize: 11, color:'var(--muted)', textTransform:'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>User</th>
          <th style={{ textAlign:'left', padding:'8px 0', fontSize: 11, color:'var(--muted)', textTransform:'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Role</th>
          <th style={{ textAlign:'left', padding:'8px 0', fontSize: 11, color:'var(--muted)', textTransform:'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Scope</th>
          <th style={{ textAlign:'right', padding:'8px 0', fontSize: 11, color:'var(--muted)', textTransform:'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Last active</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(r => (
          <tr key={r.user} style={{ borderBottom: '1px dashed var(--line)' }}>
            <td style={{ padding:'9px 0', fontWeight: 600 }}>{r.user}</td>
            <td><span className="pill purple">{r.role}</span></td>
            <td className="mono" style={{ fontSize: 11.5, color:'var(--muted)' }}>{r.scope}</td>
            <td style={{ textAlign:'right', color: 'var(--muted)', fontSize: 11.5 }}>{r.last}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const DataLineage = () => {
  const stages = [
    { ttl: 'SAP MM',          sub: 'ERP source', icon: 'inbox',    color: 'var(--accent-navy)' },
    { ttl: 'Ingestion',       sub: 'L1 · ADF',   icon: 'arrow-right', color: 'var(--accent-blue)' },
    { ttl: 'Preprocess',      sub: 'normalize',  icon: 'cog',      color: 'var(--accent-blue)' },
    { ttl: 'Multi-agent L2',  sub: '4 agents',   icon: 'network',  color: 'var(--accent-purple)' },
    { ttl: 'Governance L3',   sub: 'route',      icon: 'shield',   color: 'var(--accent-violet)' },
    { ttl: 'Spend warehouse', sub: 'gold layer', icon: 'chart',    color: 'var(--accent-green)' },
  ];
  return (
    <div style={{ display:'flex', alignItems:'center', gap: 6 }}>
      {stages.map((s, i) => (
        <React.Fragment key={i}>
          <div style={{
            flex: 1, padding: 12, borderRadius: 10,
            background: 'var(--surface-2)', border: '1px solid var(--line)',
            display:'flex', gap: 10, alignItems:'center'
          }}>
            <span style={{ width: 30, height: 30, borderRadius: 8, background: s.color, color:'#fff', display:'grid', placeItems:'center', flexShrink: 0 }}>
              <Icon name={s.icon} size={14}/>
            </span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{s.ttl}</div>
              <div style={{ fontSize: 11, color:'var(--muted)' }}>{s.sub}</div>
            </div>
          </div>
          {i < stages.length-1 && <span style={{ color:'var(--line-2)' }}><Icon name="arrow-right" size={14}/></span>}
        </React.Fragment>
      ))}
    </div>
  );
};

window.TabGovernance = TabGovernance;
