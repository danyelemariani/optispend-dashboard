/* SpendWise - Crea Ordine
   Form for new PO creation with AI-suggested predefined options per field.
*/

const TabNewOrder = () => {
  const D = window.PRISM_DATA;

  // Suggested option dictionaries
  const SUGG = {
    ship: D.FLEET.slice(0, 6).map(s => s.name),
    portOrigin: ['Genova', 'Napoli', 'Trieste', 'Gioia Tauro', 'La Spezia', 'Livorno', 'Augusta'],
    portDest:   ['Algeciras', 'Rotterdam', 'Antwerp', 'Hamburg', 'Pireo', 'Valencia', 'Barcellona'],
    vendor:    D.SUPPLIERS.slice(0, 6).map(s => s.name),
    category:  D.CATEGORIES.slice(0, 6).map(c => ({ name: c.name, code: c.code })),
    uom:       ['MT', 'kg', 'L', 'm³', 'pz', 'set', 'SVC'],
    currency:  ['EUR', 'USD', 'GBP'],
    incoterms: ['FOB', 'CIF', 'DAP', 'EXW', 'DDP'],
    urgency:   ['Standard (15g)', 'Rapida (5g)', 'Urgente (48h)'],
    paymentTerms: ['30 gg', '60 gg', '90 gg', 'Anticipato', 'Alla consegna'],
  };

  // Form state
  const [form, setForm] = React.useState({
    ship: 'MV Adriatic Lupa',
    portOrigin: 'Genova',
    portDest: 'Algeciras',
    vendor: '',
    category: '',
    uom: '',
    currency: 'EUR',
    incoterms: 'FOB',
    urgency: 'Standard (15g)',
    paymentTerms: '30 gg',
    description: '',
    qty: '',
    unitPrice: '',
    needBy: '2026-06-18',
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // Heuristic: deduce category from description
  const aiCat = React.useMemo(() => {
    const d = form.description.toLowerCase();
    if (/ifo|bunker|fuel|gasolio/.test(d))             return 'Bunker Fuel';
    if (/lubric|olio|grease|sae/.test(d))              return 'Lubricants & Greases';
    if (/spare|filtro|ricambio|guarnizion|pompa/.test(d)) return 'Marine Spare Parts';
    if (/pilot|porto|ormeggio/.test(d))                return 'Port & Pilotage Svc.';
    if (/pulizi|detergent/.test(d))                    return 'Cleaning & Hygiene';
    if (/galley|prov|cibo|food/.test(d))               return 'Provisions / Galley';
    if (/vsat|telematic|antenna|IT|software/i.test(d)) return 'IT & Telematics';
    if (/insur|assicur|solas/.test(d))                 return 'Marine Insurance';
    return null;
  }, [form.description]);

  const total = (+form.qty || 0) * (+form.unitPrice || 0);

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Crea nuovo ordine</h1>
          <div className="sub">Il sistema suggerisce opzioni predefinite ad ogni campo - l'utente conferma o modifica. Riduce errori e standardizza i dati.</div>
        </div>
        <div className="actions">
          <button className="btn btn-sm"><Icon name="book" size={13}/> Carica da template</button>
          <button className="btn btn-sm"><Icon name="download" size={13}/> Salva bozza</button>
        </div>
      </div>

      <div className="grid-2-1" style={{ alignItems:'flex-start' }}>
        {/* Form */}
        <Card title="Dati ordine" sub="passo 1 di 2">
          <div className="form-grid">
            <Field label="Nave" required ai>
              <input className="form-input" value={form.ship} onChange={e => set('ship', e.target.value)} placeholder="Es. MV Genova Spirit"/>
              <Suggestions items={SUGG.ship} value={form.ship} onPick={v => set('ship', v)}/>
            </Field>

            <Field label="Fornitore" required ai>
              <input className="form-input" value={form.vendor} onChange={e => set('vendor', e.target.value)} placeholder="Cerca o digita…"/>
              <Suggestions items={SUGG.vendor} value={form.vendor} onPick={v => set('vendor', v)}/>
            </Field>

            <Field label="Porto di origine">
              <input className="form-input" value={form.portOrigin} onChange={e => set('portOrigin', e.target.value)}/>
              <Suggestions items={SUGG.portOrigin} value={form.portOrigin} onPick={v => set('portOrigin', v)}/>
            </Field>

            <Field label="Porto di destinazione">
              <input className="form-input" value={form.portDest} onChange={e => set('portDest', e.target.value)}/>
              <Suggestions items={SUGG.portDest} value={form.portDest} onPick={v => set('portDest', v)}/>
            </Field>

            <div className="form-field" style={{ gridColumn:'1 / -1' }}>
              <label>Descrizione articolo <span className="req">*</span>
                <span className="ai-hint"><Icon name="sparkles" size={10}/> auto-categoria</span>
              </label>
              <textarea className="form-textarea" placeholder="Es. IFO 380 cSt bunker fuel, 240 MT, consegna Algeciras…"
                value={form.description} onChange={e => set('description', e.target.value)}/>
              <div className="form-help">L'AI proporrà una categoria UNSPSC dopo la digitazione di una descrizione significativa.</div>
            </div>

            <Field label="Categoria UNSPSC" required ai>
              <input className="form-input" value={form.category} onChange={e => set('category', e.target.value)} placeholder={aiCat || 'Selezione…'}/>
              <div className="suggest-row">
                {aiCat && (
                  <button className={`suggest-chip ai`} onClick={() => set('category', aiCat)}>
                    <Icon name="sparkles" size={11}/> AI · {aiCat}
                  </button>
                )}
                {SUGG.category.map(c => (
                  <button key={c.code} className={`suggest-chip ${form.category===c.name?'picked':''}`} onClick={() => set('category', c.name)}>
                    {c.name}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Unità di misura" required>
              <input className="form-input" value={form.uom} onChange={e => set('uom', e.target.value)} placeholder="MT"/>
              <Suggestions items={SUGG.uom} value={form.uom} onPick={v => set('uom', v)}/>
            </Field>

            <Field label="Quantità" required>
              <input className="form-input mono tnum" type="number" value={form.qty} onChange={e => set('qty', e.target.value)} placeholder="240"/>
            </Field>

            <Field label="Prezzo unitario (€)" required>
              <input className="form-input mono tnum" type="number" value={form.unitPrice} onChange={e => set('unitPrice', e.target.value)} placeholder="565.00"/>
            </Field>

            <Field label="Incoterms">
              <input className="form-input" value={form.incoterms} onChange={e => set('incoterms', e.target.value)}/>
              <Suggestions items={SUGG.incoterms} value={form.incoterms} onPick={v => set('incoterms', v)}/>
            </Field>

            <Field label="Pagamento">
              <input className="form-input" value={form.paymentTerms} onChange={e => set('paymentTerms', e.target.value)}/>
              <Suggestions items={SUGG.paymentTerms} value={form.paymentTerms} onPick={v => set('paymentTerms', v)}/>
            </Field>

            <Field label="Urgenza">
              <input className="form-input" value={form.urgency} onChange={e => set('urgency', e.target.value)}/>
              <Suggestions items={SUGG.urgency} value={form.urgency} onPick={v => set('urgency', v)}/>
            </Field>

            <Field label="Data richiesta consegna">
              <input className="form-input" type="date" value={form.needBy} onChange={e => set('needBy', e.target.value)}/>
            </Field>
          </div>

          <div style={{ display:'flex', gap: 8, marginTop: 22, paddingTop: 18, borderTop:'1px solid var(--line)' }}>
            <button className="btn btn-primary"><Icon name="check" size={14}/> Invia per approvazione</button>
            <button className="btn">Salva come bozza</button>
            <button className="btn btn-ghost">Annulla</button>
            <div style={{ marginLeft:'auto', fontSize: 12, color:'var(--muted)', alignSelf:'center' }}>
              <Icon name="shield" size={12}/> tutte le azioni sono tracciate (audit)
            </div>
          </div>
        </Card>

        {/* Preview / AI assist */}
        <div style={{ display:'flex', flexDirection:'column', gap: 14 }}>
          <Card title="Riepilogo">
            <KVRow l="Totale stimato" v={total ? fmtEURexact(total) : '-'} big/>
            <KVRow l="Nave"      v={form.ship || '-'}/>
            <KVRow l="Fornitore" v={form.vendor || '-'}/>
            <KVRow l="Categoria" v={form.category || aiCat || '-'} hint={!form.category && aiCat ? 'suggerita AI' : null}/>
            <KVRow l="Tratta"    v={form.portOrigin && form.portDest ? `${form.portOrigin} → ${form.portDest}` : '-'}/>
            <KVRow l="Quantità"  v={form.qty ? `${form.qty} ${form.uom}` : '-'}/>
            <KVRow l="Incoterms" v={form.incoterms}/>
            <KVRow l="Consegna entro" v={form.needBy}/>
          </Card>

          <Card title="AI assist" sub="suggerimenti predittivi"
            right={<span className="pill purple"><Icon name="sparkles" size={11}/> attivo</span>}>
            <Suggest icon="check" tone="green" title="Categoria suggerita"
              body={aiCat ? <>Sulla base della descrizione, la categoria probabile è <b>{aiCat}</b>. Click sul chip per applicare.</> : 'Inserisci una descrizione per ricevere suggerimenti.'}/>
            <Suggest icon="link" tone="blue" title="Possibile raggruppamento"
              body={<>Esistono <b>3 ordini aperti</b> verso <b>{form.vendor || 'Wärtsilä Service Italy'}</b> nella stessa settimana - potresti consolidare la spedizione (risparmio ~€640).</>}/>
            <Suggest icon="flag" tone="amber" title="Verifica budget"
              body={<>La categoria <b>{aiCat || 'Marine Spare Parts'}</b> è al <b>87%</b> del budget mensile. Probabile semaforo <span className="status-light yellow"><span className="glow"/>giallo</span> in fase di revisione.</>}/>
            <Suggest icon="shield" tone="purple" title="Compliance"
              body={<>L'incoterm <b>{form.incoterms}</b> richiede l'allegato della certificazione SOLAS. Il sistema chiederà l'upload.</>}/>
          </Card>

          <Card title="Validazione" sub="real-time">
            <Validation ok title="Fornitore in anagrafica" body="Verificato in master data SAP."/>
            <Validation ok title="UNSPSC valido" body={`Codice ${aiCat ? '15101500' : '-'} esiste e attivo.`}/>
            <Validation warn title="Prezzo entro la fascia"
              body="Prezzo unitario nel 92° percentile storico per questa categoria - verifica."/>
            <Validation ok title="Documenti previsti" body="3/3 documenti standard per la categoria."/>
          </Card>
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, required, ai, children }) => (
  <div className="form-field">
    <label>
      {label} {required && <span className="req">*</span>}
      {ai && <span className="ai-hint"><Icon name="sparkles" size={10}/> suggerito</span>}
    </label>
    {children}
  </div>
);

const Suggestions = ({ items, value, onPick }) => (
  <div className="suggest-row">
    {items.map(it => (
      <button key={it} className={`suggest-chip ${value === it ? 'picked' : ''}`} onClick={() => onPick(it)} type="button">
        {it}
      </button>
    ))}
  </div>
);

const KVRow = ({ l, v, hint, big }) => (
  <div style={{ display:'flex', justifyContent:'space-between', gap: 12, padding: '7px 0', borderBottom:'1px dashed var(--line)', fontSize: 13, alignItems:'baseline' }}>
    <span style={{ color:'var(--muted)', fontSize: 12 }}>{l}</span>
    <span style={{
      fontWeight: big ? 700 : 600,
      fontSize: big ? 18 : 13,
      textAlign:'right',
      color: big ? 'var(--brand-purple)' : 'var(--ink)'
    }} className={big ? 'tnum' : ''}>
      {v}
      {hint && <span style={{ marginLeft: 6, fontSize: 10, color:'var(--brand-purple)', fontWeight: 600 }}>· {hint}</span>}
    </span>
  </div>
);

const Suggest = ({ icon, tone, title, body }) => {
  const tones = {
    green:  { bg: 'var(--ok-bg)',   fg: 'var(--ok)' },
    blue:   { bg: 'var(--info-bg)', fg: 'var(--info)' },
    amber:  { bg: 'var(--warn-bg)', fg: 'var(--warn)' },
    purple: { bg: 'var(--brand-grad-soft)', fg: 'var(--brand-purple)' },
  }[tone] || { bg: 'var(--bg-2)', fg: 'var(--muted)' };
  return (
    <div style={{ display:'flex', gap: 10, padding: '10px 0', borderBottom:'1px dashed var(--line)' }}>
      <div style={{ width: 28, height: 28, borderRadius: 8, background: tones.bg, color: tones.fg, display:'grid', placeItems:'center', flexShrink: 0 }}>
        <Icon name={icon} size={14}/>
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700 }}>{title}</div>
        <div style={{ fontSize: 12, color:'var(--ink-2)', lineHeight: 1.45, marginTop: 2 }}>{body}</div>
      </div>
    </div>
  );
};

const Validation = ({ ok, warn, title, body }) => (
  <div style={{ display:'flex', gap: 10, padding:'8px 0', borderBottom:'1px dashed var(--line)' }}>
    <div style={{
      width: 22, height: 22, borderRadius: 11,
      background: ok ? 'var(--ok)' : 'var(--warn)',
      color:'#fff', display:'grid', placeItems:'center', flexShrink: 0
    }}>
      <Icon name={ok ? 'check' : 'flag'} size={12}/>
    </div>
    <div>
      <div style={{ fontSize: 12.5, fontWeight: 600 }}>{title}</div>
      <div style={{ fontSize: 11.5, color:'var(--muted)', lineHeight: 1.4, marginTop: 2 }}>{body}</div>
    </div>
  </div>
);

window.TabNewOrder = TabNewOrder;
