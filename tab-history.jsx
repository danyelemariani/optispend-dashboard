/* OptiSpend — Spendoanalisi precedenti (Past Analyses)
   View / filter by year / review / edit
*/

const TabHistory = () => {
  const [year, setYear] = React.useState(2026);
  const [openId, setOpenId] = React.useState(null);

  const all = React.useMemo(() => buildAnalyses(), []);
  const filtered = all.filter(a => a.year === year);
  const yearTotals = React.useMemo(() => {
    const m = {};
    all.forEach(a => { m[a.year] = (m[a.year] || 0) + 1; });
    return m;
  }, [all]);

  const open = openId && all.find(a => a.id === openId);

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Spendoanalisi precedenti</h1>
          <div className="sub">Tutte le analisi storiche · filtra per anno · apri per revisione e modifica</div>
        </div>
        <div className="actions">
          <button className="btn btn-sm"><Icon name="download" size={13}/> Esporta elenco</button>
          <button className="btn btn-sm btn-primary"><Icon name="plus" size={13}/> Nuova analisi</button>
        </div>
      </div>

      {/* Year filter */}
      <div style={{ display:'flex', alignItems:'center', gap: 8, marginBottom: 18 }}>
        <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, textTransform:'uppercase', letterSpacing:'0.05em', marginRight: 4 }}>Anno</span>
        {[2026, 2025, 2024, 2023, 2022].map(y => (
          <button key={y} className={`year-pill ${y === year ? 'active' : ''}`} onClick={() => setYear(y)}>
            {y}
            <span style={{ marginLeft: 6, fontSize: 11, opacity: 0.7 }}>{yearTotals[y] || 0}</span>
          </button>
        ))}
        <span style={{ marginLeft: 16, fontSize: 12, color: 'var(--muted)' }}>
          {filtered.length} analisi · {filtered.filter(a => a.status === 'red').length} con criticità
        </span>
      </div>

      {!open ? (
        <Card padded={false} title={`Analisi ${year}`} sub="ordinate per data, più recenti in alto">
          <div style={{ display:'grid', gridTemplateColumns: '110px 1fr 130px 110px 90px 130px 110px', gap: 14, padding:'10px 18px', borderBottom: '1px solid var(--line)', fontSize: 11, color: 'var(--muted)', textTransform:'uppercase', letterSpacing:'0.05em', fontWeight: 600, background:'var(--surface-2)' }}>
            <div>Periodo</div>
            <div>Analisi</div>
            <div>Categorie</div>
            <div style={{ textAlign:'right' }}>Spend</div>
            <div style={{ textAlign:'right' }}>Risparmio</div>
            <div>Stato</div>
            <div>Azioni</div>
          </div>
          {filtered.map(a => (
            <div key={a.id} className="history-row" onClick={() => setOpenId(a.id)}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{a.period}</div>
                <div className="sub">creata {a.createdAt}</div>
              </div>
              <div>
                <div className="ttl">{a.title}</div>
                <div className="sub">{a.author} · {a.useCase}</div>
              </div>
              <div className="mono tnum" style={{ fontSize: 13 }}>{a.categories}</div>
              <div className="num mono tnum" style={{ textAlign:'right', fontWeight: 700 }}>{fmtEUR(a.spend)}</div>
              <div className="num mono tnum" style={{ textAlign:'right', color: 'var(--ok)', fontWeight: 600 }}>{fmtEUR(a.savings)}</div>
              <div><StatusLight status={a.status}/></div>
              <div style={{ display:'flex', gap: 4 }}>
                <button className="btn btn-sm btn-ghost" onClick={(e) => { e.stopPropagation(); setOpenId(a.id); }}>Apri →</button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ padding: 40, textAlign:'center', color: 'var(--muted)' }}>
              Nessuna analisi per il {year}.
            </div>
          )}
        </Card>
      ) : (
        <AnalysisDetail a={open} onBack={() => setOpenId(null)}/>
      )}
    </div>
  );
};

const AnalysisDetail = ({ a, onBack }) => {
  const D = window.PRISM_DATA;
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState({ title: a.title, period: a.period, status: a.status });

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', gap: 12, marginBottom: 18 }}>
        <button className="btn btn-sm btn-ghost" onClick={onBack}><Icon name="arrow-right" size={13}/> <span style={{ transform:'rotate(180deg)', display:'inline-block' }}></span>Torna all'elenco</button>
        <StatusLight status={draft.status}/>
        <span className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>{a.id}</span>
        <div style={{ marginLeft:'auto', display:'flex', gap: 8 }}>
          {!editing ? (
            <>
              <button className="btn btn-sm"><Icon name="download" size={13}/> Esporta PDF</button>
              <button className="btn btn-sm btn-primary" onClick={() => setEditing(true)}><Icon name="cog" size={13}/> Modifica</button>
            </>
          ) : (
            <>
              <button className="btn btn-sm" onClick={() => { setDraft({ title: a.title, period: a.period, status: a.status }); setEditing(false); }}>Annulla</button>
              <button className="btn btn-sm btn-primary" onClick={() => setEditing(false)}><Icon name="check" size={13}/> Salva modifiche</button>
            </>
          )}
        </div>
      </div>

      <Card padded={true}>
        {!editing ? (
          <>
            <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>{draft.title}</h2>
            <div style={{ display:'flex', gap: 16, marginTop: 8, fontSize: 13, color:'var(--muted)' }}>
              <span><Icon name="book" size={12}/> {draft.period}</span>
              <span>autore: <b style={{ color: 'var(--ink)' }}>{a.author}</b></span>
              <span>creata: {a.createdAt}</span>
              <span>ultima modifica: {a.modifiedAt}</span>
            </div>
          </>
        ) : (
          <div className="form-grid">
            <div className="form-field">
              <label>Titolo</label>
              <input className="form-input" value={draft.title} onChange={e => setDraft({...draft, title: e.target.value})}/>
            </div>
            <div className="form-field">
              <label>Periodo</label>
              <input className="form-input" value={draft.period} onChange={e => setDraft({...draft, period: e.target.value})}/>
            </div>
            <div className="form-field" style={{ gridColumn:'1 / -1' }}>
              <label>Stato semaforo</label>
              <div className="suggest-row">
                {['green','yellow','red'].map(s => (
                  <button key={s} type="button"
                    className={`suggest-chip ${draft.status === s ? 'picked' : ''}`}
                    onClick={() => setDraft({...draft, status: s})}>
                    <StatusLight status={s}/>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Card>

      <div style={{ height: 14 }}/>

      <div className="stat-grid" style={{ marginBottom: 16 }}>
        <Stat label="Spend analizzato"  value={fmtEUR(a.spend)} delta={+4.2}/>
        <Stat label="Risparmio identificato" value={fmtEUR(a.savings)} delta={+18}/>
        <Stat label="Ordini valutati"   value={fmtNum(a.poCount)} delta={+12}/>
        <Stat label="Fornitori"         value={a.vendors} delta={-3}/>
        <Stat label="Accuratezza modello" value={a.accuracy + '%'} delta={+1.4}/>
      </div>

      <div className="grid-2-1">
        <Card title="Distribuzione categoria · esito revisione" sub="ordini classificati per semaforo" padded={false}>
          <table className="po-table">
            <thead>
              <tr>
                <th>Categoria</th>
                <th style={{ textAlign:'right' }}>Verde</th>
                <th style={{ textAlign:'right' }}>Giallo</th>
                <th style={{ textAlign:'right' }}>Rosso</th>
                <th style={{ textAlign:'right' }}>Spend</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {D.CATEGORIES.slice(0,6).map((c, i) => {
                const total = 80 + i*30;
                const red = Math.max(0, Math.round(total * (0.04 + 0.05 * Math.sin(i))));
                const yellow = Math.round(total * 0.18);
                const green = total - yellow - red;
                return (
                  <tr key={c.code}>
                    <td><span style={{ display:'inline-flex', alignItems:'center', gap: 8 }}><span style={{ width:8, height:8, borderRadius:2, background: c.color }}/>{c.name}</span></td>
                    <td className="num tnum mono" style={{ color: 'var(--ok)', fontWeight: 600 }}>{green}</td>
                    <td className="num tnum mono" style={{ color: 'var(--warn)', fontWeight: 600 }}>{yellow}</td>
                    <td className="num tnum mono" style={{ color: 'var(--err)', fontWeight: 600 }}>{red}</td>
                    <td className="num tnum mono">{fmtEUR(c.spend)}</td>
                    <td style={{ fontSize: 12, color:'var(--muted)' }}>{i % 2 === 0 ? 'Nessuna anomalia' : 'Da verificare con CFO'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>

        <Card title="Note e annotazioni" sub="commenti revisori">
          {[
            { who: 'A. Bianchi',   when: '2 g fa', txt: 'Confermare la riclassificazione di 12 PO da "Generic Trade" a "Bunker Fuel" — sembra corretto.', tone:'green' },
            { who: 'M. Rossi',     when: '5 g fa', txt: 'Rivedere la categoria "Cleaning & Hygiene": alcuni ordini contengono anche prodotti tecnici.', tone:'amber' },
            { who: 'E. Pellegrini',when: '1 sett.',txt: 'Approvato il consolidamento Wärtsilä — risparmio reale €1,240.', tone:'green' },
            { who: 'L. Conti',     when: '2 sett.',txt: 'Drift score elevato nella categoria Spare Parts — segnalato per retraining.', tone:'red' },
          ].map((n, i) => (
            <div key={i} style={{ padding: '10px 0', borderBottom:'1px dashed var(--line)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize: 12, marginBottom: 4 }}>
                <b>{n.who}</b>
                <span style={{ color:'var(--muted)' }}>{n.when}</span>
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.45 }}>{n.txt}</div>
            </div>
          ))}
          {editing && (
            <div style={{ marginTop: 12 }}>
              <textarea className="form-textarea" placeholder="Aggiungi una nota…" style={{ width:'100%' }}/>
              <button className="btn btn-sm btn-primary" style={{ marginTop: 8 }}>Aggiungi nota</button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

const buildAnalyses = () => [
  { id:'SA-2026-Q2', year:2026, period:'Q2 2026 (apr-giu)',  title:'Analisi spese Q2 2026 — flotta Mediterranea Cargo Lines', author:'A. Bianchi',   createdAt:'2026-05-12', modifiedAt:'oggi',      useCase:'Cargo Shipping', categories: 10, spend: 12_700_000, savings: 1_620_000, poCount: 4210, vendors: 184, accuracy: 94.2, status:'green' },
  { id:'SA-2026-Q1', year:2026, period:'Q1 2026 (gen-mar)',  title:'Analisi spese Q1 2026 — flotta',                            author:'A. Bianchi',   createdAt:'2026-04-08', modifiedAt:'2026-04-22',useCase:'Cargo Shipping', categories: 10, spend: 11_840_000, savings: 1_410_000, poCount: 3984, vendors: 178, accuracy: 92.8, status:'green' },
  { id:'SA-2026-LUB',year:2026, period:'rolling 6 mesi',     title:'Focus categoria Lubrificanti — consolidamento fornitori',  author:'E. Pellegrini',createdAt:'2026-03-22', modifiedAt:'2026-04-02',useCase:'Cargo Shipping', categories: 1,  spend:  1_640_000, savings:    240_000, poCount: 218,  vendors: 7,   accuracy: 96.1, status:'yellow' },
  { id:'SA-2025-Q4', year:2025, period:'Q4 2025 (ott-dic)',  title:'Analisi spese Q4 2025',                                    author:'A. Bianchi',   createdAt:'2026-01-14', modifiedAt:'2026-01-30',useCase:'Cargo Shipping', categories: 10, spend: 13_220_000, savings: 1_180_000, poCount: 4302, vendors: 196, accuracy: 91.4, status:'green' },
  { id:'SA-2025-Q3', year:2025, period:'Q3 2025 (lug-set)',  title:'Analisi spese Q3 2025',                                    author:'A. Bianchi',   createdAt:'2025-10-10', modifiedAt:'2025-10-22',useCase:'Cargo Shipping', categories: 10, spend: 11_180_000, savings:    920_000, poCount: 3812, vendors: 188, accuracy: 90.2, status:'green' },
  { id:'SA-2025-Q2', year:2025, period:'Q2 2025 (apr-giu)',  title:'Analisi spese Q2 2025',                                    author:'A. Bianchi',   createdAt:'2025-07-08', modifiedAt:'2025-07-19',useCase:'Cargo Shipping', categories: 10, spend: 12_440_000, savings:    860_000, poCount: 4022, vendors: 192, accuracy: 89.1, status:'yellow' },
  { id:'SA-2025-Q1', year:2025, period:'Q1 2025 (gen-mar)',  title:'Analisi spese Q1 2025 + reset baseline UNSPSC',            author:'L. Conti',     createdAt:'2025-04-12', modifiedAt:'2025-05-02',useCase:'Cargo Shipping', categories: 10, spend: 11_960_000, savings:    410_000, poCount: 3941, vendors: 204, accuracy: 87.8, status:'red' },
  { id:'SA-2024-AN', year:2024, period:'Anno 2024',          title:'Analisi annuale 2024 — primo deploy modello v2',           author:'L. Conti',     createdAt:'2025-02-04', modifiedAt:'2025-02-20',useCase:'Cargo Shipping', categories: 10, spend: 44_800_000, savings: 2_140_000, poCount:15820, vendors: 248, accuracy: 84.6, status:'yellow' },
  { id:'SA-2023-AN', year:2023, period:'Anno 2023',          title:'Analisi annuale 2023 — baseline pre-AI',                   author:'G. Ferraro',   createdAt:'2024-01-22', modifiedAt:'2024-02-04',useCase:'Cargo Shipping', categories: 8,  spend: 42_120_000, savings:    280_000, poCount:14188, vendors: 282, accuracy: 78.4, status:'red' },
  { id:'SA-2022-AN', year:2022, period:'Anno 2022',          title:'Analisi storica 2022',                                     author:'G. Ferraro',   createdAt:'2023-02-08', modifiedAt:'2023-02-15',useCase:'Cargo Shipping', categories: 8,  spend: 40_640_000, savings:    120_000, poCount:13720, vendors: 296, accuracy: 72.1, status:'red' },
];

window.TabHistory = TabHistory;
