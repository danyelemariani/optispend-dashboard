/* SpendWise - main app shell */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "density": "comfortable",
  "useCase": "shipping",
  "accent": "navy"
}/*EDITMODE-END*/;

const NAV = [
  { group: 'Operate', items: [
    { id: 'overview',    label: 'Overview',         icon: 'gauge' },
    { id: 'neworder',    label: 'Crea ordine',      icon: 'plus' },
    { id: 'queue',       label: 'Review Queue',     icon: 'inbox', badge: 47 },
    { id: 'grouping',    label: 'Raggruppa ordini', icon: 'link' },
    { id: 'detail',      label: 'PO Detail',        icon: 'sparkles' },
  ]},
  { group: 'Analyses', items: [
    { id: 'spend',       label: 'Spend Analysis',          icon: 'chart' },
    { id: 'history',     label: 'Spend Analysis Precedenti',icon: 'book' },
    { id: 'suppliers',   label: 'Fornitori',               icon: 'truck' },
  ]},
  { group: 'ML / Platform', items: [
    { id: 'agents',      label: 'Multi-Agent Monitor', icon: 'network' },
    { id: 'model',       label: 'Model & Drift',       icon: 'cpu' },
    { id: 'governance',  label: 'Governance',          icon: 'shield' },
  ]},
];

const TAB_TITLES = {
  overview:   'Overview',
  neworder:   'Crea nuovo ordine',
  queue:      'Review Queue',
  grouping:   'Raggruppamento ordini',
  detail:     'PO Detail',
  spend:      'Spend Analysis',
  history:    'Spend Analysis Precedenti',
  suppliers:  'Fornitori',
  agents:     'Multi-Agent Monitor',
  model:      'Model & Drift',
  governance: 'Governance',
};

const App = () => {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [active, setActive] = React.useState('overview');

  // Apply theme + density to document root
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', tweaks.theme);
    document.documentElement.setAttribute('data-density', tweaks.density);
  }, [tweaks.theme, tweaks.density]);

  React.useEffect(() => {
    document.documentElement.setAttribute('data-accent', tweaks.accent);
  }, [tweaks.accent]);

  // Active tab body
  const TabBody = () => {
    switch (active) {
      case 'overview':   return <TabOverview useCase={tweaks.useCase} density={tweaks.density}/>;
      case 'neworder':   return <TabNewOrder/>;
      case 'queue':      return <TabQueue onOpenDetail={() => setActive('detail')}/>;
      case 'grouping':   return <TabGrouping/>;
      case 'detail':     return <TabDetail/>;
      case 'spend':      return <TabSpend/>;
      case 'history':    return <TabHistory/>;
      case 'suppliers':  return <TabSuppliers/>;
      case 'agents':     return <TabAgents/>;
      case 'model':      return <TabModel/>;
      case 'governance': return <TabGovernance/>;
      default: return null;
    }
  };

  return (
    <div className="shell">
      <Sidebar active={active} onSelect={setActive}/>
      <div className="main">
        <TopBar active={active} useCase={tweaks.useCase}/>
        <div className="content" data-screen-label={`${(Object.keys(TAB_TITLES).indexOf(active)+1).toString().padStart(2,'0')} ${TAB_TITLES[active]}`}>
          <TabBody/>
        </div>
      </div>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Appearance">
          <TweakRadio  label="Theme" value={tweaks.theme} onChange={v => setTweak('theme', v)}
            options={[{value:'light',label:'Light'},{value:'dark',label:'Dark'}]}/>
          <TweakRadio  label="Density" value={tweaks.density} onChange={v => setTweak('density', v)}
            options={[{value:'comfortable',label:'Default'},{value:'compact',label:'Compact'}]}/>
        </TweakSection>
        <TweakSection label="Client / Use case">
          <TweakSelect label="Active use case" value={tweaks.useCase} onChange={v => setTweak('useCase', v)}
            options={[
              {value:'shipping', label:'Cargo Shipping · Mediterranea Cargo Lines'},
              {value:'retail',   label:'Retail · Iperlinea Italia'},
              {value:'pa',       label:'Public Admin · ASL Lazio'},
              {value:'manuf',    label:'Manufacturing · AutoMeccanica Torino'},
            ]}/>
        </TweakSection>
      </TweaksPanel>
    </div>
  );
};

// -------------------- Sidebar --------------------
const Sidebar = ({ active, onSelect }) => (
  <aside className="sidebar">
    <div className="brand">
      <div className="brand-mark">
        <svg width="22" height="22" viewBox="0 0 32 32">
          {/* O monogram + spark */}
          <circle cx="16" cy="16" r="10" fill="none" stroke="#fff" strokeWidth="3.2"/>
          <path d="M22 8 L26 5" stroke="#fff" strokeWidth="2.4" strokeLinecap="round"/>
          <circle cx="26" cy="5" r="2" fill="#fff"/>
        </svg>
      </div>
      <div className="brand-text">
        <div className="brand-name">SpendWise</div>
        <div className="brand-sub">Spend AI Platform</div>
      </div>
    </div>

    {NAV.map(group => (
      <React.Fragment key={group.group}>
        <div className="nav-group-label">{group.group}</div>
        {group.items.map(it => (
          <div key={it.id} className={`nav-item ${active === it.id ? 'active' : ''}`}
               onClick={() => onSelect(it.id)}>
            <span className="ico"><Icon name={it.icon} size={16}/></span>
            <span>{it.label}</span>
            {it.badge !== undefined && <span className="badge">{it.badge}</span>}
          </div>
        ))}
      </React.Fragment>
    ))}

    <div className="sidebar-foot">
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <span>Model <span className="ver">v3.2</span></span>
        <span style={{ display:'inline-flex', alignItems:'center', gap: 4 }}>
          <span style={{ width: 6, height: 6, borderRadius:'50%', background: '#00875A', boxShadow:'0 0 6px #00875A' }}/>
          live
        </span>
      </div>
      <div style={{ marginTop: 4 }}>Region: West Europe</div>
    </div>
  </aside>
);

// -------------------- TopBar --------------------
const TopBar = ({ active, useCase }) => {
  const D = window.SPENDWISE_DATA;
  const uc = D.USE_CASES[useCase] || D.USE_CASES.shipping;
  return (
    <div className="topbar">
      <div className="crumb">
        <Icon name="ship" size={14}/>
        <span style={{ marginLeft: 4 }}>{uc.company}</span>
        <span className="sep">/</span>
        <b>{TAB_TITLES[active]}</b>
      </div>
      <div className="spacer"/>
      <div className="env-pill"><span className="dot"/>Production · EU-West</div>
      <div className="search">
        <Icon name="search" size={14}/>
        <input placeholder="Search PO, vendor, category, code…"/>
        <span className="mono" style={{ fontSize: 10, color: 'var(--muted-2)', border:'1px solid var(--line)', padding:'1px 5px', borderRadius: 4 }}>⌘K</span>
      </div>
      <button className="icon-btn"><Icon name="bell" size={15}/><span className="ping"/></button>
      <button className="icon-btn"><Icon name="cog" size={15}/></button>
      <div className="avatar">MR</div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('app')).render(<App/>);
