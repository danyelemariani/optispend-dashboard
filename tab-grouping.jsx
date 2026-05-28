/* OptiSpend — Raggruppa ordini
   Auto-grouping orders from same supplier to reduce shipping costs.
*/

const TabGrouping = () => {
  const D = window.PRISM_DATA;
  const [window_, setWindow_] = React.useState('week');

  // Build groups: same vendor + delivery within window
  const groups = React.useMemo(() => buildGroups(D), [D]);

  const totalSavings = groups.reduce((s, g) => s + g.savings, 0);

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Raggruppamento ordini</h1>
          <div className="sub">Ordini verso lo stesso fornitore con finestra di consegna ravvicinata → consolidamento spedizione per ridurre costi.</div>
        </div>
        <div className="actions">
          <div className="tog">
            <button className={window_==='week'?'on':''} onClick={()=>setWindow_('week')}>Settimana</button>
            <button className={window_==='biweek'?'on':''} onClick={()=>setWindow_('biweek')}>Quindicina</button>
            <button className={window_==='month'?'on':''} onClick={()=>setWindow_('month')}>Mese</button>
          </div>
          <button className="btn btn-sm btn-primary"><Icon name="check" size={13}/> Conferma tutti i raggruppamenti</button>
        </div>
      </div>

      <div className="stat-grid" style={{ marginBottom: 18 }}>
        <Stat label="Gruppi rilevati"        value={groups.length} delta={+3}/>
        <Stat label="Ordini consolidabili"   value={groups.reduce((s,g)=>s+g.lines.length, 0)} delta={+12}/>
        <Stat label="Spedizioni evitate"     value={groups.length * 2 - 1} delta={+5}/>
        <Stat label="Risparmio stimato"      value={fmtEUR(totalSavings)} delta={+18}/>
        <Stat label="Fornitori coinvolti"    value={new Set(groups.map(g=>g.vendor)).size} delta={+2}/>
      </div>

      <div style={{ display:'flex', alignItems:'center', gap: 10, marginBottom: 12, fontSize: 13, color: 'var(--muted)' }}>
        <Icon name="sparkles" size={14}/>
        Mostrando {groups.length} gruppi suggeriti — finestra: {window_ === 'week' ? '7 giorni' : window_ === 'biweek' ? '15 giorni' : '30 giorni'} · porto comune
      </div>

      {groups.map((g, i) => (
        <div key={i} className="supplier-group">
          <div className="sg-head">
            <div className="av">{g.vendor.split(' ').map(w => w[0]).slice(0,2).join('')}</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{g.vendor}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                {g.lines.length} ordini · totale <b className="mono">{fmtEUR(g.total)}</b> · finestra consegna <b>{g.window}</b> · porto <b>{g.port}</b>
              </div>
            </div>
            <div style={{ display:'flex', gap: 8 }}>
              <button className="btn btn-sm"><Icon name="x" size={12}/> Ignora</button>
              <button className="btn btn-sm btn-primary"><Icon name="link" size={12}/> Consolida</button>
            </div>
          </div>
          <div>
            {g.lines.map(po => (
              <div key={po.id} className="sg-line">
                <span className="id">{po.id}</span>
                <span className="desc" title={po.desc}>{po.desc}</span>
                <span style={{ fontSize: 11.5, color: 'var(--muted)' }}>{po.ship}</span>
                <span className="mono tnum" style={{ textAlign:'right', fontWeight: 600 }}>{fmtEUR(po.amount)}</span>
                <span><StatusLight status={statusForConf(po.conf)}/></span>
              </div>
            ))}
          </div>
          <div className="sg-savings">
            <Icon name="check" size={14}/>
            <span>Una sola spedizione invece di {g.lines.length} · </span>
            <span style={{ marginLeft:'auto' }}>
              Risparmio stimato spedizione: <b className="mono tnum">+{fmtEUR(g.savings)}</b>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

// Status for traffic-light system based on confidence/amount
const statusForConf = (conf) => {
  if (conf >= 0.85) return 'green';
  if (conf >= 0.60) return 'yellow';
  return 'red';
};

const StatusLight = ({ status }) => {
  const labels = { green: 'Conforme', yellow: 'Da verificare', red: 'Critico' };
  return (
    <span className={`status-light ${status}`}>
      <span className="glow"/>
      {labels[status]}
    </span>
  );
};

// Build mock grouping data
const buildGroups = (D) => {
  // Synthetic groups based on vendor frequency
  return [
    {
      vendor: 'Wärtsilä Service Italy',
      port: 'Genova',
      window: '8-14 giu 2026',
      total: 71_280,
      savings: 1_240,
      lines: [
        { id:'PO-2026-48198', desc:'Guarnizioni testa cilindro Wärtsilä W46F, set completo',           ship:'MV Adriatic Lupa',  amount: 24_700, conf: 0.91 },
        { id:'PO-2026-48184', desc:'Pompa centrifuga ricambio + tenuta meccanica',                     ship:'MV Vesuvio',        amount: 31_200, conf: 0.88 },
        { id:'PO-2026-48162', desc:'Set guarnizioni motore principale + 4× turbocompressore',          ship:'MV Genova Spirit',  amount: 15_380, conf: 0.93 },
      ],
    },
    {
      vendor: 'Shell Marine Lubricants',
      port: 'Rotterdam',
      window: '10-16 giu 2026',
      total: 19_800,
      savings: 880,
      lines: [
        { id:'PO-2026-48177', desc:'Mobilgear SHC XMP 320 — 4× drum 208 L',                             ship:'MV Ionian Voyager', amount:  6_240, conf: 0.96 },
        { id:'PO-2026-48143', desc:'Mobilgard 412 (TBN 12) — 6× IBC 1000L',                             ship:'MV Tirreno Star',   amount: 11_400, conf: 0.94 },
        { id:'PO-2026-48092', desc:'Grasso multifunzionale — 24 cartucce',                              ship:'MV Cattolica',      amount:  2_160, conf: 0.82 },
      ],
    },
    {
      vendor: 'MAN Energy Solutions',
      port: 'Hamburg',
      window: '11-17 giu 2026',
      total: 42_140,
      savings: 1_580,
      lines: [
        { id:'PO-2026-48201', desc:'Filtri olio motore principale MAN B&W 7S60ME-C, lotto 12 pz',       ship:'MV Vesuvio',        amount: 18_320, conf: 0.94 },
        { id:'PO-2026-48133', desc:'Valvole di scarico + sedi — kit revisione completo',                ship:'MV Etna Express',   amount: 23_820, conf: 0.89 },
      ],
    },
    {
      vendor: 'ENI Marine Fuels',
      port: 'Algeciras',
      window: '12-18 giu 2026',
      total: 284_800,
      savings: 2_100,
      lines: [
        { id:'PO-2026-48210', desc:'IFO 380 cSt bunker fuel, 240 MT, delivery port Algeciras',          ship:'MV Adriatic Lupa',  amount: 142_400, conf: 0.97 },
        { id:'PO-2026-48155', desc:'MGO 0.1% S, 180 MT, Algeciras',                                     ship:'MV Genova Spirit',  amount: 142_400, conf: 0.95 },
      ],
    },
    {
      vendor: 'Mediterraneo Forniture',
      port: 'Napoli',
      window: '13-19 giu 2026',
      total: 4_120,
      savings: 320,
      lines: [
        { id:'PO-2026-48172', desc:'Detergente sgrassante industriale 25L — 40 taniche',                ship:'MV Vesuvio',        amount: 1_280, conf: 0.78 },
        { id:'PO-2026-48141', desc:'Salviette industriali — 12 confezioni',                             ship:'MV Capri Pearl',    amount:   840, conf: 0.71 },
        { id:'PO-2026-48118', desc:'Carta assorbente per spillamenti olio — 6 rotoli',                  ship:'MV Cattolica',      amount: 2_000, conf: 0.66 },
      ],
    },
  ];
};

window.TabGrouping = TabGrouping;
window.StatusLight = StatusLight;
window.statusForConf = statusForConf;
