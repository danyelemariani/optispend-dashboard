/* PRISM mock data — Mediterranea Cargo Lines (24-vessel fleet) */
(function(){
  // ----------- KPIs / Summary -----------
  const KPI = {
    accuracy:          { value: 94.2, delta: +1.7, unit: '%' },
    pos_today:         { value: 1842, delta: +8.4, unit: '' },
    autoclassified:    { value: 76.3, delta: +3.1, unit: '%' },
    review_queue:      { value: 47,   delta: -12,  unit: '' },
    avg_latency:       { value: 412,  delta: -6,   unit: 'ms' },
    savings_ytd:       { value: 8.42, delta: +12,  unit: 'M €' },
    drift_score:       { value: 0.07, delta: -0.02,unit: '' },
    tail_spend_share:  { value: 22.4, delta: -3.6, unit: '%' },
  };

  // ----------- Sparkline series (24h) -----------
  const spark = (mean, vol, n=24) => {
    const arr = [];
    let v = mean;
    for (let i=0; i<n; i++){
      v += (Math.random()-0.5)*vol;
      v = Math.max(mean*0.6, Math.min(mean*1.4, v));
      arr.push(+v.toFixed(2));
    }
    return arr;
  };
  const SPARKS = {
    accuracy:       spark(94, 1.4),
    pos_today:      spark(75, 18),
    autoclassified: spark(76, 3),
    review_queue:   spark(50, 12),
    avg_latency:    spark(420, 30),
    savings_ytd:    spark(8, 0.4),
    drift_score:    spark(0.08, 0.02),
    tail_spend:     spark(22, 1.8),
  };

  // ----------- Agents -----------
  const AGENTS = [
    { id: 'ml',   name: 'ML Classifier',    sub: 'XGBoost • v3.2', color: '#0091DA', weight: 40, latency: 38,  accuracy: 91.4, calls24h: 1842, status: 'healthy' },
    { id: 'llm',  name: 'NLP / LLM',        sub: 'Azure GPT-4o',   color: '#483698', weight: 35, latency: 220, accuracy: 93.8, calls24h: 1842, status: 'healthy' },
    { id: 'kb',   name: 'Knowledge Base',   sub: 'RAG • UNSPSC',   color: '#00A3A1', weight: 25, latency: 145, accuracy: 89.2, calls24h: 1842, status: 'healthy' },
    { id: 'orc',  name: 'Orchestrator',     sub: 'LangGraph',      color: '#BC204B', weight: 100,latency: 9,   accuracy: 96.1, calls24h: 1842, status: 'healthy' },
  ];

  // ----------- Categories (UNSPSC-flavored for shipping) -----------
  const CATEGORIES = [
    { code: '15101500', name: 'Bunker Fuel',          spend: 4_280_000, errPrev: 18.4, errNow: 3.1, color: '#00338D' },
    { code: '15121800', name: 'Lubricants & Greases', spend: 1_640_000, errPrev: 22.1, errNow: 4.8, color: '#0091DA' },
    { code: '25171500', name: 'Marine Spare Parts',   spend: 3_120_000, errPrev: 31.2, errNow: 6.2, color: '#00B8F5' },
    { code: '78101800', name: 'Port & Pilotage Svc.', spend: 1_220_000, errPrev: 9.6,  errNow: 2.1, color: '#483698' },
    { code: '24112400', name: 'Deck & Engine Tools',  spend:   480_000, errPrev: 28.7, errNow: 5.4, color: '#6D2077' },
    { code: '47131600', name: 'Cleaning & Hygiene',   spend:   210_000, errPrev: 14.0, errNow: 3.0, color: '#00A3A1' },
    { code: '50191500', name: 'Provisions / Galley',  spend:   340_000, errPrev: 19.3, errNow: 4.2, color: '#EAAA00' },
    { code: '84131500', name: 'Marine Insurance',     spend:   970_000, errPrev: 5.2,  errNow: 1.4, color: '#BC204B' },
    { code: '81111800', name: 'IT & Telematics',      spend:   260_000, errPrev: 17.2, errNow: 3.8, color: '#8A93AC' },
    { code: '95110000', name: 'Other / Misc.',        spend:   180_000, errPrev: 41.5, errNow: 11.0,color: '#5A6685' },
  ];

  // ----------- Fleet (sample) -----------
  const FLEET = [
    { name: 'MV Genova Spirit',     imo: '9485217', type: 'Container',  spend: 1_240_000, pos: 312 },
    { name: 'MV Tirreno Star',      imo: '9612344', type: 'Bulk Carrier',spend: 980_000,  pos: 268 },
    { name: 'MV Adriatic Lupa',     imo: '9701229', type: 'Tanker',     spend: 1_410_000, pos: 341 },
    { name: 'MV Ionian Voyager',    imo: '9542110', type: 'Container',  spend: 870_000,  pos: 224 },
    { name: 'MV Etna Express',      imo: '9388124', type: 'Ro-Ro',      spend: 720_000,  pos: 198 },
    { name: 'MV Cattolica',         imo: '9477812', type: 'Bulk Carrier',spend: 640_000,  pos: 187 },
    { name: 'MV Vesuvio',           imo: '9821477', type: 'Container',  spend: 1_120_000, pos: 290 },
    { name: 'MV Capri Pearl',       imo: '9554002', type: 'Ro-Ro',      spend: 530_000,  pos: 164 },
  ];

  // ----------- Suppliers -----------
  const SUPPLIERS = [
    { name: 'ENI Marine Fuels',          country: 'IT', spend: 2_410_000, pos: 142, perfScore: 92, risk: 'low'  },
    { name: 'Shell Marine Lubricants',   country: 'NL', spend:   980_000, pos: 218, perfScore: 88, risk: 'low'  },
    { name: 'Wärtsilä Service Italy',    country: 'IT', spend: 1_650_000, pos: 312, perfScore: 86, risk: 'low'  },
    { name: 'MAN Energy Solutions',      country: 'DE', spend: 1_120_000, pos: 198, perfScore: 90, risk: 'low'  },
    { name: 'Port Authority of Genova',  country: 'IT', spend:   540_000, pos: 88,  perfScore: 78, risk: 'med'  },
    { name: 'Lloyd\'s Register Italia',  country: 'IT', spend:   320_000, pos: 24,  perfScore: 94, risk: 'low'  },
    { name: 'Castrol Marine',            country: 'UK', spend:   410_000, pos: 96,  perfScore: 81, risk: 'med'  },
    { name: 'Bureau Veritas Marine',     country: 'FR', spend:   280_000, pos: 31,  perfScore: 89, risk: 'low'  },
    { name: 'Generali Marine Insurance', country: 'IT', spend:   780_000, pos: 18,  perfScore: 91, risk: 'low'  },
    { name: 'Generic Trade SRL',         country: 'IT', spend:    62_000, pos: 124, perfScore: 54, risk: 'high' },
    { name: 'Forniture Navali Bonomi',   country: 'IT', spend:    48_000, pos: 88,  perfScore: 61, risk: 'med'  },
    { name: 'Mediterraneo Forniture',    country: 'IT', spend:    34_000, pos: 72,  perfScore: 58, risk: 'med'  },
  ];

  // ----------- Purchase Orders (live-ish stream) -----------
  const PO_DESCRIPTIONS = [
    { desc: 'IFO 380 cSt bunker fuel, 240 MT, delivery port Algeciras',     vendor: 'ENI Marine Fuels',        amount: 142_400, oldCat: 'Materiali Generici',     newCat: 'Bunker Fuel',          conf: 0.97 },
    { desc: 'Filtri olio motore principale MAN B&W 7S60ME-C, lotto 12 pz',   vendor: 'MAN Energy Solutions',    amount:  18_320, oldCat: 'Spare Parts Generic',    newCat: 'Marine Spare Parts',   conf: 0.94 },
    { desc: 'Mobilgear SHC XMP 320 — 4× drum 208 L',                          vendor: 'Shell Marine Lubricants', amount:   6_240, oldCat: 'Misc supplies',          newCat: 'Lubricants & Greases', conf: 0.96 },
    { desc: 'Pilotage charges Port of Genova — MV Adriatic Lupa, 2× movements',vendor: 'Port Authority of Genova',amount:   3_840, oldCat: 'Servizi vari',           newCat: 'Port & Pilotage Svc.', conf: 0.99 },
    { desc: 'Guarnizioni testa cilindro Wärtsilä W46F, set completo',          vendor: 'Wärtsilä Service Italy',  amount:  24_700, oldCat: 'Materiali Generici',     newCat: 'Marine Spare Parts',   conf: 0.91 },
    { desc: 'Detergente sgrassante industriale 25L — 40 taniche',              vendor: 'Mediterraneo Forniture',  amount:   1_280, oldCat: 'Generic Trade',          newCat: 'Cleaning & Hygiene',   conf: 0.78 },
    { desc: 'Provviste di bordo galley — fresh produce, settimanale',          vendor: 'Forniture Navali Bonomi', amount:   4_120, oldCat: 'Vari',                   newCat: 'Provisions / Galley',  conf: 0.84 },
    { desc: 'Certificazione SOLAS — rinnovo annuale MV Vesuvio',              vendor: 'Lloyd\'s Register Italia',amount:  18_900, oldCat: 'Servizi tecnici',        newCat: 'Marine Insurance',     conf: 0.58 },
    { desc: 'Chiavi inglesi industriali set 8-32 mm — 4 set',                   vendor: 'Generic Trade SRL',       amount:     840, oldCat: 'Materiali Generici',     newCat: 'Deck & Engine Tools',  conf: 0.72 },
    { desc: 'Antenna VSAT KU-band — installazione e canone 12 mesi',           vendor: 'Generic Trade SRL',       amount:  14_280, oldCat: 'IT services',            newCat: 'IT & Telematics',      conf: 0.66 },
    { desc: 'Olio motore SAE 40 — 2× IBC 1000L (consegna Napoli)',             vendor: 'Castrol Marine',          amount:   7_680, oldCat: 'Materiali Generici',     newCat: 'Lubricants & Greases', conf: 0.93 },
    { desc: 'Pompa centrifuga ricambio + tenuta meccanica',                   vendor: 'Wärtsilä Service Italy',  amount:  31_200, oldCat: 'Generic equipment',      newCat: 'Marine Spare Parts',   conf: 0.88 },
  ];

  const PO_ROWS = PO_DESCRIPTIONS.map((p, i) => {
    const ts = new Date(Date.now() - i*1000*60*12 - Math.random()*1000*60*5);
    const route = p.conf > 0.85 ? 'auto' : p.conf > 0.60 ? 'review' : 'escal';
    return {
      id: 'PO-2026-' + String(48210 - i).padStart(5,'0'),
      ts, ...p, route,
      ship: ['MV Genova Spirit','MV Adriatic Lupa','MV Vesuvio','MV Tirreno Star','MV Ionian Voyager','MV Etna Express'][i%6],
      origin: ['Genova','Napoli','Trieste','Gioia Tauro','La Spezia','Livorno'][i%6],
    };
  });

  // ----------- Activity feed -----------
  const ACTIVITY = [
    { t: '14:32:18', who: 'Orchestrator', msg: 'Auto-classified PO-2026-48210 as <b>Bunker Fuel</b> · conf 0.97', kind: 'ok' },
    { t: '14:32:14', who: 'ML Classifier', msg: 'Predicted <b>Marine Spare Parts</b> (XGBoost) for PO-2026-48209', kind: 'info' },
    { t: '14:32:09', who: 'Reviewer · M.Rossi', msg: 'Approved correction PO-2026-48206 → <b>IT & Telematics</b>', kind: 'ok' },
    { t: '14:31:54', who: 'Knowledge Base', msg: 'Matched UNSPSC 25171500 with 3 prior similar POs', kind: 'info' },
    { t: '14:31:42', who: 'Orchestrator', msg: 'Routed PO-2026-48203 to <b>review</b> · conf 0.58', kind: 'warn' },
    { t: '14:31:30', who: 'LLM Agent', msg: 'Confidence drop on "Generic Trade SRL" descriptions — flagging vendor', kind: 'warn' },
    { t: '14:31:18', who: 'System', msg: 'Drift detection completed · score 0.07 (below threshold)', kind: 'ok' },
    { t: '14:31:02', who: 'Reviewer · A.Bianchi', msg: 'Sent 4 correction samples to retraining buffer', kind: 'info' },
    { t: '14:30:47', who: 'ML Classifier', msg: 'Model v3.2 active · last retrain 18h ago', kind: 'info' },
  ];

  // ----------- Routing distribution -----------
  const ROUTING = {
    total: 1842,
    auto:     { share: 76.3, count: 1405, threshold: '> 85%', color: '#00875A' },
    review:   { share: 18.4, count:  339, threshold: '60–85%', color: '#B26A00' },
    escalate: { share:  5.3, count:   98, threshold: '< 60%',  color: '#B00020' },
  };

  // ----------- Drift series (90d) -----------
  const DRIFT = Array.from({length: 90}, (_,i) => {
    const base = 0.06 + (i>60? 0.005*(i-60):0);
    return +(base + (Math.random()-0.5)*0.025).toFixed(3);
  });
  // Confusion matrix (top 6 cats)
  const CONFUSION_LABELS = ['Bunker', 'Lub.', 'Spares', 'Port', 'Tools', 'Misc.'];
  const CONFUSION = [
    [312, 4,  2,  0,  1,  3],
    [  6,184, 5,  0,  2,  4],
    [  3, 6, 268, 2,  9,  5],
    [  0, 0,  2, 142, 0,  1],
    [  1, 3, 11, 0,  88, 4],
    [  2, 2,  3, 1,  4,  62],
  ];

  // ----------- Audit trail -----------
  const AUDIT = [
    { ts:'2026-05-20 14:32:18', actor:'orchestrator@prism',     action:'CLASSIFY', target:'PO-2026-48210', detail:'auto · Bunker Fuel · v3.2', kind:'ok' },
    { ts:'2026-05-20 14:32:09', actor:'m.rossi@optispend.io',         action:'APPROVE',  target:'PO-2026-48206', detail:'override → IT & Telematics', kind:'ok' },
    { ts:'2026-05-20 14:30:02', actor:'a.bianchi@optispend.io',       action:'RETRAIN',  target:'buffer-348',    detail:'4 corrections appended', kind:'info' },
    { ts:'2026-05-20 13:58:44', actor:'system',                   action:'DRIFT',    target:'model v3.2',    detail:'score 0.07 OK', kind:'ok' },
    { ts:'2026-05-20 13:42:11', actor:'l.conti@optispend.io',          action:'REJECT',   target:'PO-2026-48177', detail:'wrong UNSPSC suggested', kind:'warn' },
    { ts:'2026-05-20 12:14:55', actor:'system',                   action:'DEPLOY',   target:'model v3.2',    detail:'promoted from staging', kind:'info' },
    { ts:'2026-05-19 22:08:30', actor:'system',                   action:'INGEST',   target:'SAP-MM batch',  detail:'4,210 PO ingested · 0 errors', kind:'ok' },
    { ts:'2026-05-19 18:47:02', actor:'g.ferraro@optispend.io',        action:'CONFIG',   target:'thresholds',    detail:'auto > 0.85 (was 0.82)', kind:'info' },
  ];

  // ----------- Use-case definitions -----------
  const USE_CASES = {
    shipping: { name: 'Cargo Shipping', company: 'Mediterranea Cargo Lines', sub: '24-vessel fleet · Mediterranean / Northern Europe routes', scheme: 'UNSPSC' },
    retail:   { name: 'Retail Chain',   company: 'Iperlinea Italia',          sub: '184 stores · 6 regional warehouses',                       scheme: 'UNSPSC' },
    pa:       { name: 'Public Admin',   company: 'ASL Regione Lazio',         sub: 'Hospital network · 12 facilities',                          scheme: 'CPV (EU)' },
    manuf:    { name: 'Manufacturing',  company: 'AutoMeccanica Torino',      sub: 'Tier-1 automotive supplier · 4 plants',                     scheme: 'UNSPSC' },
  };

  window.PRISM_DATA = {
    KPI, SPARKS, AGENTS, CATEGORIES, FLEET, SUPPLIERS, PO_ROWS, ACTIVITY, ROUTING, DRIFT,
    CONFUSION_LABELS, CONFUSION, AUDIT, USE_CASES,
  };
})();
