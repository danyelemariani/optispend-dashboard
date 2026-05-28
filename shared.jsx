/* Shared building-block components for PRISM dashboard */

// -------------------- Icons (inline SVG) --------------------
const Icon = ({ name, size = 18, stroke = 1.6 }) => {
  const props = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case 'gauge':    return <svg {...props}><path d="M12 13V7"/><path d="M5 19a7 7 0 1 1 14 0"/><circle cx="12" cy="13" r="1.5"/></svg>;
    case 'chart':    return <svg {...props}><path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/></svg>;
    case 'network':  return <svg {...props}><circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="12" cy="18" r="2.5"/><path d="M7.5 7.5L11 16"/><path d="M16.5 7.5L13 16"/><path d="M8.5 6h7"/></svg>;
    case 'inbox':    return <svg {...props}><path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/></svg>;
    case 'sparkles': return <svg {...props}><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/></svg>;
    case 'shield':   return <svg {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>;
    case 'cpu':      return <svg {...props}><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3"/></svg>;
    case 'truck':    return <svg {...props}><rect x="1" y="6" width="13" height="11" rx="1"/><path d="M14 9h4l3 3v5h-7"/><circle cx="5.5" cy="18" r="2"/><circle cx="17.5" cy="18" r="2"/></svg>;
    case 'search':   return <svg {...props}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>;
    case 'bell':     return <svg {...props}><path d="M6 8a6 6 0 0112 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 004 0"/></svg>;
    case 'cog':      return <svg {...props}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>;
    case 'check':    return <svg {...props}><path d="M5 12l5 5L20 7"/></svg>;
    case 'x':        return <svg {...props}><path d="M6 6l12 12M18 6L6 18"/></svg>;
    case 'flag':     return <svg {...props}><path d="M4 21V4"/><path d="M4 4h12l-2 4 2 4H4"/></svg>;
    case 'ship':     return <svg {...props}><path d="M3 17h18l-2 4H5l-2-4z"/><path d="M5 17V8h14v9"/><path d="M12 4v4"/><path d="M9 4h6"/></svg>;
    case 'arrow-up':   return <svg {...props}><path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></svg>;
    case 'arrow-down': return <svg {...props}><path d="M12 5v14"/><path d="M5 12l7 7 7-7"/></svg>;
    case 'arrow-right':return <svg {...props}><path d="M5 12h14M13 5l7 7-7 7"/></svg>;
    case 'play':     return <svg {...props}><polygon points="5 3 19 12 5 21 5 3"/></svg>;
    case 'pause':    return <svg {...props}><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>;
    case 'download': return <svg {...props}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></svg>;
    case 'filter':   return <svg {...props}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>;
    case 'book':     return <svg {...props}><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5V4.5A2.5 2.5 0 016.5 2z"/></svg>;
    case 'tag':      return <svg {...props}><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><circle cx="7" cy="7" r="1.5"/></svg>;
    case 'link':     return <svg {...props}><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>;
    case 'plus':     return <svg {...props}><path d="M12 5v14M5 12h14"/></svg>;
    default:         return <svg {...props}><circle cx="12" cy="12" r="9"/></svg>;
  }
};

// -------------------- Sparkline --------------------
const Sparkline = ({ data, w = 100, h = 30, color = "var(--accent-blue)", fill = true }) => {
  if (!data || data.length === 0) return null;
  const min = Math.min(...data), max = Math.max(...data);
  const range = (max - min) || 1;
  const dx = w / (data.length - 1);
  const pts = data.map((v, i) => [i*dx, h - ((v - min) / range) * (h-3) - 1.5]);
  const path = pts.map((p, i) => (i === 0 ? 'M' : 'L') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
  const area = path + ` L${w},${h} L0,${h} Z`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display:'block', overflow:'visible' }}>
      {fill && (
        <defs>
          <linearGradient id={`sg-${color.replace(/[^a-z]/gi,'')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25"/>
            <stop offset="100%" stopColor={color} stopOpacity="0"/>
          </linearGradient>
        </defs>
      )}
      {fill && <path d={area} fill={`url(#sg-${color.replace(/[^a-z]/gi,'')})`} />}
      <path d={path} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx={pts[pts.length-1][0]} cy={pts[pts.length-1][1]} r="2.4" fill={color}/>
    </svg>
  );
};

// -------------------- Stat tile --------------------
const Stat = ({ label, value, unit, delta, spark, sparkColor, suffix, format }) => {
  const fmt = format || (v => v);
  const d = delta;
  const up = d > 0, down = d < 0;
  const cls = up ? 'up' : down ? 'down' : 'flat';
  const sign = up ? '+' : '';
  return (
    <div className="stat">
      <div className="stat-label">{label}</div>
      <div className="stat-val tnum">
        {fmt(value)}<span className="unit">{unit}</span>
      </div>
      <div className="stat-foot">
        {d !== undefined && (
          <span className={`delta ${cls}`}>
            {up ? <Icon name="arrow-up" size={11}/> : down ? <Icon name="arrow-down" size={11}/> : null}
            {sign}{d}{typeof d === 'number' && Math.abs(d) < 1 ? '' : (unit && unit !== '' ? '' : '')}
          </span>
        )}
        <span>vs. prev. 7d</span>
      </div>
      {spark && <div className="spark"><Sparkline data={spark} w={220} h={32} color={sparkColor || 'var(--accent-blue)'} /></div>}
    </div>
  );
};

// -------------------- Card --------------------
const Card = ({ title, sub, right, children, padded = true, className = "" }) => (
  <div className={`card ${className}`}>
    {(title || right) && (
      <div className="card-head">
        {title && <h3>{title}</h3>}
        {sub && <span className="sub">{sub}</span>}
        {right && <div className="right">{right}</div>}
      </div>
    )}
    {padded ? <div className="card-body">{children}</div> : children}
  </div>
);

// -------------------- Confidence chip --------------------
const ConfChip = ({ conf }) => {
  const pct = (conf*100).toFixed(0);
  const cls = conf > 0.85 ? 'auto' : conf > 0.60 ? 'review' : 'escal';
  return (
    <span className={`conf-chip ${cls}`}>
      <span className="b"><div style={{ width: `${pct}%` }}/></span>
      {pct}%
    </span>
  );
};

// -------------------- Routing pill --------------------
const RoutePill = ({ route }) => {
  const map = {
    auto:   { txt: 'Conforme',      cls: 'green' },
    review: { txt: 'Da verificare', cls: 'amber' },
    escal:  { txt: 'Critico',       cls: 'red' },
  };
  const m = map[route] || map.auto;
  return <span className={`pill ${m.cls}`}><span className="dot" style={{ background: 'currentColor' }}/>{m.txt}</span>;
};

// -------------------- Currency / number formatters --------------------
const fmtEUR = (n) => {
  if (n >= 1_000_000) return '€' + (n/1_000_000).toFixed(2) + 'M';
  if (n >= 1_000) return '€' + (n/1000).toFixed(1) + 'k';
  return '€' + n.toFixed(0);
};
const fmtEURexact = (n) =>
  new Intl.NumberFormat('it-IT', { style:'currency', currency:'EUR', maximumFractionDigits: 0 }).format(n);
const fmtNum = (n) => new Intl.NumberFormat('en-US').format(n);
const fmtTime = (d) => {
  const dd = (typeof d === 'string') ? new Date(d) : d;
  const hh = String(dd.getHours()).padStart(2,'0');
  const mm = String(dd.getMinutes()).padStart(2,'0');
  return `${hh}:${mm}`;
};

// -------------------- Treemap --------------------
// Squarified-ish treemap with manual layout
const Treemap = ({ items, width, height }) => {
  // items: [{ label, value, color, sub }]
  const total = items.reduce((a, b) => a + b.value, 0);
  const rects = [];
  // Simple recursive split layout — alternates dominant axis
  const layout = (list, x, y, w, h, horiz) => {
    if (list.length === 0) return;
    if (list.length === 1) {
      rects.push({ ...list[0], x, y, w, h }); return;
    }
    const sum = list.reduce((a,b) => a + b.value, 0);
    // Take the largest first; bisect roughly so first half ~= second half
    let cum = 0, idx = 0;
    for (let i = 0; i < list.length; i++) {
      cum += list[i].value;
      if (cum >= sum/2) { idx = Math.max(0, i); break; }
    }
    const a = list.slice(0, idx+1), b = list.slice(idx+1);
    const aSum = a.reduce((s,x)=>s+x.value,0);
    const ratio = aSum / sum;
    if (horiz) {
      layout(a, x, y, w*ratio, h, !horiz);
      layout(b, x+w*ratio, y, w*(1-ratio), h, !horiz);
    } else {
      layout(a, x, y, w, h*ratio, !horiz);
      layout(b, x, y+h*ratio, w, h*(1-ratio), !horiz);
    }
  };
  const sorted = [...items].sort((a,b) => b.value - a.value);
  layout(sorted, 0, 0, width, height, width >= height);

  return (
    <div style={{ position:'relative', width, height, borderRadius: 10, overflow:'hidden' }}>
      {rects.map((r, i) => {
        const big = r.w > 80 && r.h > 50;
        const med = r.w > 50 && r.h > 30;
        return (
          <div key={i} className="treemap-cell"
            style={{ left: r.x, top: r.y, width: r.w, height: r.h, background: r.color }}
            title={`${r.label} · ${fmtEUR(r.value)}`}>
            <div className="cat">{big || med ? r.label : ''}</div>
            <div className="amt">{big ? fmtEUR(r.value) : (med ? fmtEUR(r.value) : '')}</div>
          </div>
        );
      })}
    </div>
  );
};

// -------------------- Donut --------------------
const Donut = ({ segments, size = 160, stroke = 22 }) => {
  // segments: [{ value, color, label }]
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const total = segments.reduce((s, x) => s + x.value, 0);
  let offset = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--line)" strokeWidth={stroke} />
      {segments.map((s, i) => {
        const len = (s.value / total) * c;
        const el = (
          <circle key={i} cx={size/2} cy={size/2} r={r} fill="none"
            stroke={s.color} strokeWidth={stroke}
            strokeDasharray={`${len} ${c - len}`}
            strokeDashoffset={-offset}
            transform={`rotate(-90 ${size/2} ${size/2})`}
            style={{ transition:'stroke-dasharray 600ms' }}
          />
        );
        offset += len;
        return el;
      })}
    </svg>
  );
};

// -------------------- Bar (horizontal stacked) --------------------
const HBar = ({ segments, height = 12, radius = 6 }) => {
  const total = segments.reduce((s, x) => s + x.value, 0);
  return (
    <div style={{ display:'flex', width:'100%', height, borderRadius: radius, overflow:'hidden', background:'var(--bg-2)' }}>
      {segments.map((s, i) => (
        <div key={i}
             title={`${s.label} ${((s.value/total)*100).toFixed(1)}%`}
             style={{ width: `${(s.value/total)*100}%`, background: s.color }} />
      ))}
    </div>
  );
};

// -------------------- Line Chart --------------------
const LineChart = ({ data, w = 600, h = 180, color = "var(--accent-blue)", threshold, label = "" }) => {
  if (!data || data.length === 0) return null;
  const padL = 36, padR = 8, padT = 12, padB = 22;
  const cw = w - padL - padR, ch = h - padT - padB;
  const min = Math.min(0, ...data);
  const max = Math.max(...data, threshold || 0) * 1.15;
  const range = (max - min) || 1;
  const dx = cw / (data.length - 1);
  const yOf = v => padT + ch - ((v - min) / range) * ch;
  const xOf = i => padL + i*dx;
  const path = data.map((v, i) => (i ? 'L' : 'M') + xOf(i).toFixed(1) + ',' + yOf(v).toFixed(1)).join(' ');
  const area = path + ` L${xOf(data.length-1)},${padT+ch} L${padL},${padT+ch} Z`;
  const ticks = 4;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display:'block', overflow:'visible' }}>
      <defs>
        <linearGradient id="lc-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      {Array.from({length: ticks+1}).map((_, i) => {
        const y = padT + (ch / ticks) * i;
        const v = max - (range/ticks)*i;
        return (
          <g key={i}>
            <line x1={padL} x2={padL+cw} y1={y} y2={y} stroke="var(--line)" strokeDasharray={i===ticks ? "" : "2 3"} />
            <text x={padL-6} y={y+3} textAnchor="end" fontSize="10" fill="var(--muted)">{v.toFixed(2)}</text>
          </g>
        );
      })}
      {threshold !== undefined && (
        <g>
          <line x1={padL} x2={padL+cw} y1={yOf(threshold)} y2={yOf(threshold)} stroke="var(--err)" strokeDasharray="4 3" strokeWidth="1"/>
          <text x={padL+cw} y={yOf(threshold)-4} textAnchor="end" fontSize="10" fill="var(--err)">threshold {threshold}</text>
        </g>
      )}
      <path d={area} fill="url(#lc-fill)" />
      <path d={path} fill="none" stroke={color} strokeWidth="1.8"/>
      <text x={padL} y={h-4} fontSize="10" fill="var(--muted)">{label}</text>
    </svg>
  );
};

// -------------------- Flag --------------------
const Flag = ({ code }) => {
  const map = { IT:'🇮🇹', NL:'🇳🇱', DE:'🇩🇪', FR:'🇫🇷', UK:'🇬🇧', US:'🇺🇸', ES:'🇪🇸', GR:'🇬🇷' };
  return <span style={{ fontSize: 14, lineHeight: 1, marginRight: 4 }}>{map[code] || '🏳️'}</span>;
};

// expose
Object.assign(window, { Icon, Sparkline, Stat, Card, ConfChip, RoutePill, fmtEUR, fmtEURexact, fmtNum, fmtTime, Treemap, Donut, HBar, LineChart, Flag });
