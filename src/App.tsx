import { useState, useRef, useCallback, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

/* ─── DESIGN TOKENS ─────────────────────────────────────── */
const T = {
  dark:    "#04293A",
  navy:    "#021B2C",
  primary: "#064663",
  teal:    "#0D9488",
  mint:    "#02C39A",
  mintDim: "#01A882",
  light:   "#ECF9F9",
  muted:   "#94A3B8",
  gray:    "#64748B",
  white:   "#FFFFFF",
  card:    "#0A3A52",
  border:  "#0D5472",
};

/* ─── GLOBAL STYLES ─────────────────────────────────────── */
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:ital,wght@0,400;0,500;1,400&family=Outfit:wght@300;400;500;600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin:0; padding:0; }
    html { scroll-behavior: smooth; }
    body, #root { background:${T.navy}; color:${T.white}; font-family:'Outfit',sans-serif; min-height:100vh; overflow-x:hidden; }
    ::-webkit-scrollbar { width:6px; }
    ::-webkit-scrollbar-track { background:${T.dark}; }
    ::-webkit-scrollbar-thumb { background:${T.teal}; border-radius:3px; }

    .page { min-height:100vh; }
    .mesh-bg {
      background:
        radial-gradient(ellipse 80% 50% at 20% 20%, rgba(2,195,154,0.08) 0%, transparent 60%),
        radial-gradient(ellipse 60% 40% at 80% 80%, rgba(13,148,136,0.10) 0%, transparent 50%),
        ${T.navy};
    }

    @keyframes fadeUp { from{opacity:0;transform:translateY(24px);} to{opacity:1;transform:translateY(0);} }
    @keyframes fadeIn { from{opacity:0;} to{opacity:1;} }
    @keyframes pulse-ring { 0%{transform:scale(1);opacity:0.4;} 100%{transform:scale(1.6);opacity:0;} }
    @keyframes float { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-8px);} }
    @keyframes shimmer { 0%{background-position:-200% center;} 100%{background-position:200% center;} }
    @keyframes blob-morph {
      0%,100%{ border-radius: 60% 40% 55% 45% / 55% 45% 60% 40%; }
      25%{ border-radius: 50% 50% 40% 60% / 40% 60% 55% 45%; }
      50%{ border-radius: 40% 60% 60% 40% / 50% 40% 60% 50%; }
      75%{ border-radius: 55% 45% 50% 50% / 60% 45% 50% 40%; }
    }
    @keyframes blob-spin { from{ transform: rotate(0deg); } to{ transform: rotate(360deg); } }
    @keyframes orbit { from{ transform: rotate(0deg) translateX(140px) rotate(0deg); } to{ transform: rotate(360deg) translateX(140px) rotate(-360deg); } }
    @keyframes orbit2 { from{ transform: rotate(180deg) translateX(110px) rotate(-180deg); } to{ transform: rotate(540deg) translateX(110px) rotate(-540deg); } }
    @keyframes orbit3 { from{ transform: rotate(90deg) translateX(170px) rotate(-90deg); } to{ transform: rotate(450deg) translateX(170px) rotate(-450deg); } }
    @keyframes scan-line { 0%{ top: -2px; } 100%{ top: 100%; } }
    @keyframes count-up { from{ opacity:0; transform: scale(0.8); } to{ opacity:1; transform: scale(1); } }
    @keyframes dash { to{ stroke-dashoffset: 0; } }
    @keyframes grid-pulse { 0%,100%{ opacity:0.03; } 50%{ opacity:0.07; } }
    @keyframes slide-in-right { from{opacity:0; transform:translateX(20px);} to{opacity:1; transform:translateX(0);} }
    @keyframes progress-fill { from{ width:0%; } to{ width: var(--target-width); } }
    @keyframes spin { from{transform:rotate(0deg);} to{transform:rotate(360deg);} }
    @keyframes drop-in { 0%{transform:scale(0.9) translateY(-8px);opacity:0;} 100%{transform:scale(1) translateY(0);opacity:1;} }

    .fade-up { animation: fadeUp 0.6s ease forwards; }
    .fade-up-1 { animation: fadeUp 0.6s 0.1s ease both; }
    .fade-up-2 { animation: fadeUp 0.6s 0.2s ease both; }
    .fade-up-3 { animation: fadeUp 0.6s 0.3s ease both; }
    .fade-up-4 { animation: fadeUp 0.6s 0.4s ease both; }
    .fade-up-5 { animation: fadeUp 0.6s 0.5s ease both; }
    .fade-up-6 { animation: fadeUp 0.6s 0.6s ease both; }
    .float { animation: float 4s ease-in-out infinite; }
    .shimmer-text { background: linear-gradient(90deg, ${T.mint}, ${T.teal}, #5EEAD4, ${T.mint}); background-size:200% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; animation: shimmer 3s linear infinite; }

    .glass-card { background: rgba(10,58,82,0.6); border:1px solid rgba(13,148,136,0.2); backdrop-filter: blur(12px); border-radius:16px; transition: border-color 0.3s, transform 0.2s, box-shadow 0.3s; }
    .glass-card:hover { border-color: rgba(2,195,154,0.4); transform:translateY(-2px); box-shadow:0 8px 32px rgba(2,195,154,0.12); }

    .btn-primary { background: linear-gradient(135deg, ${T.mint}, ${T.teal}); color:${T.dark}; border:none; border-radius:10px; padding:12px 28px; font-family:'Syne',sans-serif; font-weight:700; font-size:15px; cursor:pointer; transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s; letter-spacing:0.3px; }
    .btn-primary:hover { opacity:0.9; transform:translateY(-1px); box-shadow:0 6px 24px rgba(2,195,154,0.35); }
    .btn-ghost { background:transparent; color:${T.mint}; border:1px solid rgba(2,195,154,0.4); border-radius:10px; padding:11px 26px; font-family:'Syne',sans-serif; font-weight:600; font-size:15px; cursor:pointer; transition:background 0.2s, border-color 0.2s, transform 0.2s; }
    .btn-ghost:hover { background:rgba(2,195,154,0.08); border-color:${T.mint}; transform:translateY(-1px); }
    .btn-sm { padding:8px 18px; font-size:13px; border-radius:8px; }

    .nav { position:fixed; top:0; left:0; right:0; z-index:100; display:flex; align-items:center; justify-content:space-between; padding:18px 48px; background: rgba(2,27,44,0.85); backdrop-filter:blur(16px); border-bottom:1px solid rgba(13,148,136,0.15); }
    .nav-logo { font-family:'Syne',sans-serif; font-weight:800; font-size:22px; color:${T.white}; letter-spacing:-0.5px; cursor:pointer; }
    .nav-logo span { color:${T.mint}; }
    .nav-links { display:flex; gap:32px; }
    .nav-link { font-family:'Outfit',sans-serif; font-size:14px; color:${T.muted}; cursor:pointer; transition:color 0.2s; background:none; border:none; }
    .nav-link:hover, .nav-link.active { color:${T.white}; }
    .nav-link.active { color:${T.mint}; }

    .sidebar { position:fixed; left:0; top:0; bottom:0; width:220px; background: rgba(4,41,58,0.95); border-right:1px solid rgba(13,148,136,0.15); backdrop-filter:blur(16px); display:flex; flex-direction:column; padding:0; z-index:50; }
    .sidebar-footer { padding:16px 20px; border-top:1px solid rgba(13,148,136,0.12); }
    .sidebar-profile { display:flex; align-items:center; gap:10px; }
    .sidebar-avatar { width:32px; height:32px; border-radius:50%; background:linear-gradient(135deg,${T.teal},${T.mint}); display:flex; align-items:center; justify-content:center; font-size:14px; }
    .sidebar-name { font-size:13px; font-weight:600; color:${T.white}; }
    .sidebar-subtext { font-size:11px; color:${T.muted}; font-family:'DM Mono',monospace; }
    .sidebar-logo { padding:24px 24px 20px; border-bottom:1px solid rgba(13,148,136,0.12); font-family:'Syne',sans-serif; font-weight:800; font-size:20px; color:${T.white}; cursor:pointer; }
    .sidebar-logo span { color:${T.mint}; }
    .sidebar-nav { flex:1; padding:16px 12px; display:flex; flex-direction:column; gap:4px; overflow-y:auto; }
    .sidebar-item { display:flex; align-items:center; gap:12px; padding:11px 14px; border-radius:10px; cursor:pointer; font-size:14px; font-family:'Outfit',sans-serif; font-weight:500; color:${T.muted}; transition:all 0.2s; background:none; border:none; width:100%; text-align:left; }
    .sidebar-item:hover { background: rgba(2,195,154,0.07); color:${T.white}; }
    .sidebar-item.active { background: rgba(2,195,154,0.12); color:${T.mint}; }
    .sidebar-item .icon { font-size:17px; width:20px; text-align:center; flex-shrink:0; }
    .sidebar-section { padding:8px 14px 4px; font-size:10px; font-family:'DM Mono',monospace; color:${T.gray}; letter-spacing:1.5px; text-transform:uppercase; }

    .chip { display:inline-flex; align-items:center; gap:6px; background: rgba(2,195,154,0.1); border:1px solid rgba(2,195,154,0.25); color:${T.mint}; border-radius:999px; padding:4px 14px; font-size:12px; font-family:'DM Mono',monospace; letter-spacing:0.5px; }
    .chip .dot { width:6px; height:6px; background:${T.mint}; border-radius:50%; animation:pulse-ring 1.5s ease-out infinite; position:relative; }

    .stat-card { background: rgba(10,58,82,0.5); border:1px solid rgba(13,148,136,0.2); border-radius:14px; padding:20px 24px; transition:border-color 0.3s, transform 0.2s; }
    .stat-card:hover { border-color: rgba(2,195,154,0.35); transform:translateY(-2px); }
    .stat-num { font-family:'Syne',sans-serif; font-size:32px; font-weight:800; color:${T.mint}; }
    .stat-label { font-size:13px; color:${T.muted}; margin-top:4px; }
    .stat-delta { font-size:12px; font-family:'DM Mono',monospace; }
    .delta-up { color: #02C39A; }
    .delta-down { color: #EF4444; }

    .data-table { width:100%; border-collapse:collapse; }
    .data-table th { text-align:left; padding:12px 16px; font-size:11px; font-family:'DM Mono',monospace; color:${T.muted}; letter-spacing:1px; text-transform:uppercase; border-bottom:1px solid rgba(13,148,136,0.15); white-space:nowrap; }
    .data-table td { padding:14px 16px; font-size:13px; color:${T.light}; border-bottom:1px solid rgba(13,148,136,0.08); }
    .data-table tr:last-child td { border-bottom:none; }
    .data-table tr:hover td { background: rgba(2,195,154,0.04); }

    .upload-zone { border:2px dashed rgba(2,195,154,0.3); border-radius:20px; padding:60px 40px; text-align:center; transition:all 0.3s; cursor:pointer; }
    .upload-zone:hover, .upload-zone.drag-over { border-color:${T.mint}; background:rgba(2,195,154,0.05); }
    .upload-zone.has-file { border-color: ${T.mint}; border-style: solid; background:rgba(2,195,154,0.06); }

    .progress-bar { height:4px; background: rgba(13,148,136,0.2); border-radius:2px; overflow:hidden; }
    .progress-fill { height:100%; background: linear-gradient(90deg, ${T.teal}, ${T.mint}); border-radius:2px; transition: width 0.4s ease; }

    .badge { display:inline-flex; align-items:center; padding:3px 10px; border-radius:999px; font-size:11px; font-family:'DM Mono',monospace; font-weight:500; }
    .badge-success { background: rgba(2,195,154,0.15); color: ${T.mint}; }
    .badge-pending { background: rgba(234,179,8,0.15); color: #EAB308; }
    .badge-error { background: rgba(239,68,68,0.15); color: #EF4444; }
    .badge-info { background: rgba(59,130,246,0.15); color: #60A5FA; }

    .recharts-cartesian-grid-horizontal line,
    .recharts-cartesian-grid-vertical line { stroke: rgba(13,148,136,0.12); }
    .recharts-text { fill: ${T.muted}; font-family: 'DM Mono',monospace; font-size: 11px; }
    .recharts-tooltip-wrapper { outline: none; }

    .section-divider { width:40px; height:3px; background: linear-gradient(90deg, ${T.mint}, transparent); border-radius:2px; }

    input[type=range] { -webkit-appearance:none; appearance:none; height:4px; background:rgba(13,148,136,0.2); border-radius:2px; outline:none; }
    input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; appearance:none; width:16px; height:16px; border-radius:50%; background:${T.mint}; cursor:pointer; }

    .tag { display:inline-flex; align-items:center; gap:4px; background:rgba(13,148,136,0.12); border:1px solid rgba(13,148,136,0.2); color:#5EEAD4; border-radius:6px; padding:2px 10px; font-size:12px; font-family:'DM Mono',monospace; }
  `}</style>
);

/* ─── MOCK DATA ─────────────────────────────────────────── */
const mockTrend = [
  { month:"Jan", value:4200, volume:3800 },
  { month:"Feb", value:5800, volume:4200 },
  { month:"Mar", value:5100, volume:5000 },
  { month:"Apr", value:7200, volume:6100 },
  { month:"May", value:6800, volume:5900 },
  { month:"Jun", value:9100, volume:8200 },
  { month:"Jul", value:8400, volume:7600 },
  { month:"Aug", value:11200, volume:9800 },
];

const mockCategories = [
  { name:"Category A", value:38, fill:"#02C39A" },
  { name:"Category B", value:27, fill:"#0D9488" },
  { name:"Category C", value:18, fill:"#064663" },
  { name:"Category D", value:17, fill:"#0A3A52" },
];

const mockBar = [
  { label:"Q1", current:62, previous:44 },
  { label:"Q2", current:78, previous:55 },
  { label:"Q3", current:71, previous:63 },
  { label:"Q4", current:91, previous:72 },
];

const mockRows = [
  { id:"BL-001", name:"sales_2024_q4.csv",      rows:"12,480", cols:14, size:"2.1 MB",  status:"success", date:"Mar 10" },
  { id:"BL-002", name:"user_events_march.csv",   rows:"89,012", cols:8,  size:"14.3 MB", status:"success", date:"Mar 9" },
  { id:"BL-003", name:"product_inventory.csv",   rows:"3,204",  cols:22, size:"0.8 MB",  status:"pending", date:"Mar 9" },
  { id:"BL-004", name:"financial_report_h1.csv", rows:"1,056",  cols:31, size:"1.2 MB",  status:"success", date:"Mar 8" },
  { id:"BL-005", name:"raw_sensor_logs.csv",     rows:"500,000",cols:6,  size:"88.4 MB", status:"error",   date:"Mar 7" },
];

const insightItems = [
  { icon:"📈", text:"Sales trend up 34% MoM in Aug", type:"positive" },
  { icon:"⚠️", text:"3 null columns detected in dataset", type:"warning" },
  { icon:"🔁", text:"Correlation: revenue ↔ volume 0.91", type:"info" },
  { icon:"✂️", text:"47 duplicate rows removed", type:"neutral" },
];

/* ─── CUSTOM TOOLTIP ─────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:"rgba(4,41,58,0.95)", border:"1px solid rgba(2,195,154,0.25)", borderRadius:10, padding:"10px 14px", fontFamily:"'DM Mono',monospace", fontSize:12 }}>
      <div style={{ color:T.muted, marginBottom:6 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || T.mint, marginBottom:2 }}>
          {p.name}: <strong>{typeof p.value === "number" ? p.value.toLocaleString() : p.value}</strong>
        </div>
      ))}
    </div>
  );
};

/* ─── NAV ───────────────────────────────────────────────── */
function Nav() {
  const navigate = useNavigate();
  const location = useLocation();
  const links = [
    { path:"/",          label:"Home" },
    { path:"/upload",    label:"Upload" },
    { path:"/dashboard", label:"Dashboard" },
  ];
  return (
    <nav className="nav">
      <div className="nav-logo" onClick={() => navigate("/")}>Blob<span>lytics</span></div>
      <div className="nav-links">
        {links.map(l => (
          <button key={l.path} className={`nav-link ${location.pathname===l.path?"active":""}`} onClick={() => navigate(l.path)}>
            {l.label}
          </button>
        ))}
      </div>
      <button className="btn-primary" style={{fontSize:13,padding:"9px 22px"}} onClick={() => navigate("/upload")}>
        Launch App →
      </button>
    </nav>
  );
}

/* ─── SIDEBAR ───────────────────────────────────────────── */
function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const active = location.pathname === "/upload" ? "upload" : "dashboard";
  const items = [
    { id:"dashboard", icon:"📊", label:"Dashboard",   section: null },
    { id:"upload",    icon:"⬆️",  label:"Upload Data", section: "DATA" },
    { id:"datasets",  icon:"🗂️",  label:"My Datasets", section: null },
    { id:"charts",    icon:"📈",  label:"Charts",       section: "VISUALIZE" },
    { id:"reports",   icon:"📄",  label:"Reports",      section: null },
    { id:"settings",  icon:"⚙️",  label:"Settings",     section: "ACCOUNT" },
  ];
  const routeMap = { dashboard: "/dashboard", upload: "/upload" };
  return (
    <div className="sidebar">
      <div className="sidebar-logo" onClick={() => navigate("/")}>Blob<span>lytics</span></div>
      <div className="sidebar-nav">
        {items.map(it => (
          <div key={it.id}>
            {it.section && <div className="sidebar-section">{it.section}</div>}
            <button
              className={`sidebar-item ${active===it.id?"active":""}`}
              onClick={() => routeMap[it.id] && navigate(routeMap[it.id])}
            >
              <span className="icon">{it.icon}</span>
              {it.label}
            </button>
          </div>
        ))}
      </div>
      <div className="sidebar-footer">
        <div className="sidebar-profile">
          <div className="sidebar-avatar">🧑</div>
          <div>
            <div className="sidebar-name">Builder</div>
            <div className="sidebar-subtext">Free plan · 2 uploads</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   LANDING PAGE
═══════════════════════════════════════════════════════════ */
function Landing() {
  const navigate = useNavigate();
  const features = [
    { icon:"🔍", title:"Smart Detection",   desc:"Auto-detect column types, nulls, outliers, and distributions the moment you drop a file." },
    { icon:"📊", title:"Instant Charts",     desc:"7 chart types auto-generated from your data. Customize colors, axes, and aggregations." },
    { icon:"🧬", title:"Correlation Matrix", desc:"Find hidden relationships between variables in milliseconds. Color-coded heatmaps." },
    { icon:"🤖", title:"AI Summaries",       desc:"Natural-language insights generated for every dataset — no SQL or code required." },
    { icon:"⚡", title:"Blazing Fast",       desc:"Handle 1M+ rows without breaking a sweat. Virtualized rendering keeps the UI silky." },
    { icon:"🔒", title:"Private by Design",  desc:"Data never leaves your browser. Zero server-side storage. Full local processing." },
  ];

  const stats = [
    { num:"12M+", label:"Rows processed" },
    { num:"98%",  label:"Accuracy rate" },
    { num:"0.3s", label:"Avg load time" },
    { num:"50+",  label:"Chart types" },
  ];

  return (
    <div className="page mesh-bg" style={{ paddingTop: 80 }}>
      {/* ── HERO ── */}
      <section style={{ minHeight:"90vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"60px 48px 80px", position:"relative", overflow:"hidden" }}>
        {/* Grid bg */}
        <div style={{ position:"absolute", inset:0, backgroundImage:`linear-gradient(rgba(2,195,154,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(2,195,154,0.04) 1px, transparent 1px)`, backgroundSize:"48px 48px", animation:"grid-pulse 4s ease-in-out infinite", pointerEvents:"none" }} />

        <div style={{ maxWidth:1100, width:"100%", display:"grid", gridTemplateColumns:"1fr 1fr", gap:80, alignItems:"center", position:"relative", zIndex:1 }}>
          {/* LEFT */}
          <div>
            <div className="chip fade-up" style={{ marginBottom:24 }}>
              <span className="dot" />
              Now in Beta · Free to use
            </div>
            <h1 className="fade-up-1" style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"clamp(40px,5vw,64px)", lineHeight:1.05, letterSpacing:"-1.5px", marginBottom:20, color:T.white }}>
              Turn raw blobs<br />of data into<br />
              <span className="shimmer-text">clear insights.</span>
            </h1>
            <p className="fade-up-2" style={{ color:T.muted, fontSize:17, lineHeight:1.7, maxWidth:440, marginBottom:36 }}>
              Drop any CSV and get instant visualizations, statistical summaries, and AI-powered insights — no setup, no code, no nonsense.
            </p>
            <div className="fade-up-3" style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
              <button className="btn-primary" style={{ fontSize:16, padding:"14px 32px" }} onClick={() => navigate("/upload")}>
                Analyze My Data →
              </button>
              <button className="btn-ghost" style={{ fontSize:16, padding:"13px 28px" }} onClick={() => navigate("/dashboard")}>
                View Demo
              </button>
            </div>
            <div className="fade-up-4" style={{ marginTop:40, display:"flex", gap:32 }}>
              {stats.map(s => (
                <div key={s.num}>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:22, color:T.mint }}>{s.num}</div>
                  <div style={{ fontSize:12, color:T.muted, fontFamily:"'DM Mono',monospace" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Animated blob visual */}
          <div className="float fade-up-2" style={{ display:"flex", justifyContent:"center", alignItems:"center", position:"relative", height:440 }}>
            {/* Outer glow */}
            <div style={{ position:"absolute", width:320, height:320, borderRadius:"50%", background:"radial-gradient(circle, rgba(2,195,154,0.1) 0%, transparent 70%)", animation:"blob-morph 8s ease-in-out infinite" }} />
            {/* Main blob */}
            <div style={{ width:240, height:240, background:"linear-gradient(135deg, rgba(13,148,136,0.4), rgba(2,195,154,0.2))", animation:"blob-morph 6s ease-in-out infinite", border:"1.5px solid rgba(2,195,154,0.35)", backdropFilter:"blur(8px)", display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:18, color:T.mint, textAlign:"center", lineHeight:1.4 }}>
                CSV<br />
                <span style={{ fontSize:38 }}>→</span><br />
                Insight
              </div>
              {/* Scan line */}
              <div style={{ position:"absolute", left:0, right:0, height:2, background:"linear-gradient(90deg, transparent, rgba(2,195,154,0.6), transparent)", animation:"scan-line 3s linear infinite", opacity:0.6 }} />
            </div>
            {/* Orbiting dots */}
            <div style={{ position:"absolute", width:280, height:280, animation:"blob-spin 12s linear infinite" }}>
              <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translateX(-50%) translateY(-50%)" }}>
                <div style={{ animation:"orbit 12s linear infinite", position:"relative" }}>
                  <div style={{ width:12, height:12, borderRadius:"50%", background:T.mint, boxShadow:`0 0 12px ${T.mint}` }} />
                </div>
              </div>
            </div>
            <div style={{ position:"absolute", width:220, height:220, animation:"blob-spin 18s linear infinite reverse" }}>
              <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translateX(-50%) translateY(-50%)" }}>
                <div style={{ animation:"orbit2 18s linear infinite reverse", position:"relative" }}>
                  <div style={{ width:8, height:8, borderRadius:"50%", background:"#5EEAD4", boxShadow:`0 0 10px #5EEAD4` }} />
                </div>
              </div>
            </div>
            {/* Floating mini cards */}
            <div style={{ position:"absolute", top:30, right:0, animation:"float 5s 1s ease-in-out infinite" }}>
              <div className="glass-card" style={{ padding:"10px 14px", fontSize:12, fontFamily:"'DM Mono',monospace", minWidth:130 }}>
                <div style={{ color:T.muted, marginBottom:4 }}>correlation</div>
                <div style={{ color:T.mint, fontWeight:600 }}>0.94 ↑ strong</div>
              </div>
            </div>
            <div style={{ position:"absolute", bottom:40, left:0, animation:"float 4s 0.5s ease-in-out infinite" }}>
              <div className="glass-card" style={{ padding:"10px 14px", fontSize:12, fontFamily:"'DM Mono',monospace", minWidth:130 }}>
                <div style={{ color:T.muted, marginBottom:4 }}>rows analyzed</div>
                <div style={{ color:T.mint, fontWeight:600 }}>89,012 ✓</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding:"80px 48px", borderTop:"1px solid rgba(13,148,136,0.12)" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ marginBottom:12, display:"flex", alignItems:"center", gap:12 }}>
            <div className="section-divider" />
            <span style={{ fontSize:12, fontFamily:"'DM Mono',monospace", color:T.muted, letterSpacing:"1.5px", textTransform:"uppercase" }}>Features</span>
          </div>
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:36, color:T.white, marginBottom:16 }}>
            Everything you need.<br />Nothing you don't.
          </h2>
          <p style={{ color:T.muted, fontSize:15, marginBottom:56, maxWidth:500 }}>
            Bloblytics strips away complexity so you can focus on the story your data is telling.
          </p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:20 }}>
            {features.map((f,i) => (
              <div key={i} className="glass-card" style={{ padding:"28px 28px" }}>
                <div style={{ fontSize:28, marginBottom:14 }}>{f.icon}</div>
                <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:17, color:T.white, marginBottom:8 }}>{f.title}</h3>
                <p style={{ color:T.muted, fontSize:14, lineHeight:1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding:"80px 48px", background:"rgba(4,41,58,0.3)", borderTop:"1px solid rgba(13,148,136,0.1)", borderBottom:"1px solid rgba(13,148,136,0.1)" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ marginBottom:12, display:"flex", alignItems:"center", gap:12 }}>
            <div className="section-divider" />
            <span style={{ fontSize:12, fontFamily:"'DM Mono',monospace", color:T.muted, letterSpacing:"1.5px", textTransform:"uppercase" }}>How it works</span>
          </div>
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:36, color:T.white, marginBottom:56 }}>
            Three steps.<br />Zero friction.
          </h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:40, position:"relative" }}>
            {/* Connector line */}
            <div style={{ position:"absolute", top:32, left:"16%", right:"16%", height:1, background:"linear-gradient(90deg, transparent, rgba(2,195,154,0.3), transparent)", pointerEvents:"none" }} />
            {[
              { step:"01", title:"Drop your CSV",     desc:"Drag & drop or browse for any CSV file. We support files up to 500MB instantly." },
              { step:"02", title:"We analyze it",     desc:"Our engine scans every column, detects types, finds patterns, and builds your charts." },
              { step:"03", title:"Explore & export",  desc:"Interact with live charts, tweak filters, and export reports as PDF or PNG." },
            ].map((s,i) => (
              <div key={i} style={{ textAlign:"center", position:"relative" }}>
                <div style={{ width:64, height:64, borderRadius:"50%", background:"rgba(2,195,154,0.1)", border:"1.5px solid rgba(2,195,154,0.3)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px", fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:18, color:T.mint }}>
                  {s.step}
                </div>
                <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:18, color:T.white, marginBottom:10 }}>{s.title}</h3>
                <p style={{ color:T.muted, fontSize:14, lineHeight:1.65 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding:"100px 48px", textAlign:"center" }}>
        <div style={{ maxWidth:600, margin:"0 auto" }}>
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:42, color:T.white, marginBottom:16, letterSpacing:"-1px" }}>
            Your data has a story.<br />
            <span className="shimmer-text">Let's find it.</span>
          </h2>
          <p style={{ color:T.muted, fontSize:16, marginBottom:36, lineHeight:1.7 }}>
            Start for free. No account required. Your first analysis in under 10 seconds.
          </p>
          <button className="btn-primary" style={{ fontSize:18, padding:"16px 44px" }} onClick={() => navigate("/upload")}>
            Upload Your First Dataset →
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop:"1px solid rgba(13,148,136,0.12)", padding:"24px 48px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div className="nav-logo" style={{ cursor:"default" }}>Blob<span style={{color:T.mint}}>lytics</span></div>
        <div style={{ fontSize:12, color:T.gray, fontFamily:"'DM Mono',monospace" }}>
          © 2025 Bloblytics · All data stays in your browser
        </div>
      </footer>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   UPLOAD PAGE
═══════════════════════════════════════════════════════════ */
function Upload() {
  const navigate = useNavigate();
  const [drag, setDrag] = useState(false);
  const [file, setFile] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [previewRows, setPreviewRows] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [selectedAnalyses, setSelectedAnalyses] = useState(["stats","correlations","charts"]);
  const fileRef = useRef<HTMLInputElement>(null);

  const analyses = [
    { id:"stats",        icon:"📐", label:"Summary Stats",      desc:"Mean, median, std, quartiles" },
    { id:"correlations", icon:"🔗", label:"Correlations",        desc:"Pearson & Spearman matrices" },
    { id:"charts",       icon:"📊", label:"Auto Charts",         desc:"7 chart types auto-generated" },
    { id:"outliers",     icon:"🎯", label:"Outlier Detection",   desc:"IQR & Z-score flagging" },
    { id:"missing",      icon:"🕳️", label:"Missing Data",        desc:"Null pattern visualization" },
    { id:"ai",           icon:"🤖", label:"AI Insights",         desc:"GPT-powered narrative summary" },
  ];

  const parseCSV = (text) => {
    const lines = text.split("\n").filter(Boolean);
    const h = lines[0].split(",").map(c => c.trim().replace(/"/g,""));
    const rows = lines.slice(1, 6).map(l => l.split(",").map(c => c.trim().replace(/"/g,"")));
    setHeaders(h.slice(0, 8));
    setPreviewRows(rows.map(r => r.slice(0, 8)));
  };

  const handleFile = (f) => {
    setFile(f);
    setDone(false);
    setProgress(0);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      parseCSV(text);
    };
    reader.readAsText(f);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer.files[0];
    if (f && f.name.endsWith(".csv")) handleFile(f);
  }, []);

  const handleAnalyze = () => {
    if (!file) return;
    setParsing(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setParsing(false);
          setDone(true);
          return 100;
        }
        return prev + Math.random() * 14 + 4;
      });
    }, 180);
  };

  const toggleAnalysis = (id) => {
    setSelectedAnalyses(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const recentFiles = [
    { name:"sales_2024_q4.csv",    size:"2.1 MB", date:"Today" },
    { name:"user_events_march.csv", size:"14.3 MB", date:"Yesterday" },
  ];

  return (
    <div className="page mesh-bg" style={{ minHeight:"100vh", padding:"100px 48px 60px" }}>
      <div style={{ maxWidth:1000, margin:"0 auto" }}>
        <div className="fade-up" style={{ marginBottom:40 }}>
          <div style={{ marginBottom:8, display:"flex", alignItems:"center", gap:12 }}>
            <div className="section-divider" />
            <span style={{ fontSize:12, fontFamily:"'DM Mono',monospace", color:T.muted, letterSpacing:"1.5px", textTransform:"uppercase" }}>New Analysis</span>
          </div>
          <h1 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:36, color:T.white }}>Upload Your Dataset</h1>
          <p style={{ color:T.muted, fontSize:15, marginTop:8 }}>Supports CSV up to 500 MB. Data is processed locally and never uploaded to any server.</p>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 280px", gap:28 }}>
          {/* MAIN COLUMN */}
          <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
            {/* Drop zone */}
            <div
              className={`upload-zone fade-up-1 ${drag ? "drag-over" : ""} ${file ? "has-file" : ""}`}
              onDragOver={e => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              onDrop={handleDrop}
              onClick={() => !file && fileRef.current?.click()}
              style={{ position:"relative" }}
            >
              <input ref={fileRef} type="file" accept=".csv" style={{ display:"none" }}
                onChange={e => { const f = e.target.files?.[0]; if(f) handleFile(f); }} />

              {!file ? (
                <>
                  <div style={{ fontSize:48, marginBottom:16 }}>📂</div>
                  <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:20, color:T.white, marginBottom:8 }}>
                    Drop your CSV here
                  </h3>
                  <p style={{ color:T.muted, fontSize:14, marginBottom:20 }}>or click to browse files</p>
                  <div style={{ display:"flex", gap:8, justifyContent:"center", flexWrap:"wrap" }}>
                    {[".csv","Up to 500 MB","Any encoding","Local processing"].map(t => (
                      <span key={t} className="tag">{t}</span>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{ display:"flex", alignItems:"center", gap:20, justifyContent:"center" }}>
                  <div style={{ fontSize:40 }}>📋</div>
                  <div style={{ textAlign:"left" }}>
                    <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:18, color:T.mint, marginBottom:4 }}>
                      {file.name}
                    </div>
                    <div style={{ fontSize:13, color:T.muted, fontFamily:"'DM Mono',monospace" }}>
                      {(file.size / 1024 / 1024).toFixed(2)} MB · {headers.length} columns detected
                    </div>
                  </div>
                  <button className="btn-ghost btn-sm" style={{ marginLeft:20 }} onClick={e => { e.stopPropagation(); setFile(null); setHeaders([]); setPreviewRows([]); setDone(false); }}>
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Preview table */}
            {headers.length > 0 && (
              <div className="glass-card fade-up-2" style={{ padding:0, overflow:"hidden" }}>
                <div style={{ padding:"14px 20px", borderBottom:"1px solid rgba(13,148,136,0.15)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:14, color:T.white }}>Data Preview</span>
                  <span style={{ fontSize:12, color:T.muted, fontFamily:"'DM Mono',monospace" }}>First 5 rows · {headers.length} cols shown</span>
                </div>
                <div style={{ overflowX:"auto" }}>
                  <table className="data-table">
                    <thead>
                      <tr>{headers.map(h => <th key={h}>{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {previewRows.map((row, i) => (
                        <tr key={i}>{row.map((cell, j) => <td key={j}>{cell || <span style={{color:T.gray,fontFamily:"'DM Mono',monospace"}}>null</span>}</td>)}</tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Analyses selector */}
            <div className="glass-card fade-up-3" style={{ padding:24 }}>
              <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:15, color:T.white, marginBottom:16 }}>
                Select Analyses
              </h3>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                {analyses.map(a => {
                  const selected = selectedAnalyses.includes(a.id);
                  return (
                    <div
                      key={a.id}
                      onClick={() => toggleAnalysis(a.id)}
                      style={{ padding:"12px 14px", borderRadius:10, border:`1.5px solid ${selected ? "rgba(2,195,154,0.5)" : "rgba(13,148,136,0.15)"}`, background: selected ? "rgba(2,195,154,0.07)" : "rgba(10,58,82,0.3)", cursor:"pointer", display:"flex", alignItems:"center", gap:12, transition:"all 0.2s" }}
                    >
                      <span style={{ fontSize:18 }}>{a.icon}</span>
                      <div>
                        <div style={{ fontSize:13, fontWeight:600, color: selected ? T.mint : T.white }}>{a.label}</div>
                        <div style={{ fontSize:11, color:T.muted, fontFamily:"'DM Mono',monospace" }}>{a.desc}</div>
                      </div>
                      <div style={{ marginLeft:"auto", width:18, height:18, borderRadius:4, border:`1.5px solid ${selected ? T.mint : "rgba(13,148,136,0.3)"}`, background: selected ? T.mint : "transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        {selected && <span style={{ color:T.dark, fontSize:12, fontWeight:800 }}>✓</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Analyze button / progress */}
            <div className="fade-up-4">
              {!done ? (
                <>
                  <button
                    className="btn-primary"
                    style={{ width:"100%", fontSize:16, padding:16, opacity: file ? 1 : 0.4, cursor: file ? "pointer" : "not-allowed" }}
                    onClick={handleAnalyze}
                    disabled={!file || parsing}
                  >
                    {parsing
                      ? <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
                          <span style={{ display:"inline-block", width:16, height:16, border:`2px solid ${T.dark}`, borderTopColor:"transparent", borderRadius:"50%", animation:"spin 0.7s linear infinite" }} />
                          Analyzing… {Math.min(100, Math.round(progress))}%
                        </span>
                      : `Run Analysis (${selectedAnalyses.length} selected) →`
                    }
                  </button>
                  {parsing && (
                    <div className="progress-bar" style={{ marginTop:12 }}>
                      <div className="progress-fill" style={{ width:`${progress}%` }} />
                    </div>
                  )}
                </>
              ) : (
                <div style={{ background:"rgba(2,195,154,0.1)", border:"1.5px solid rgba(2,195,154,0.4)", borderRadius:12, padding:20, textAlign:"center", animation:"drop-in 0.4s ease both" }}>
                  <div style={{ fontSize:32, marginBottom:8 }}>✅</div>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:17, color:T.mint, marginBottom:6 }}>Analysis Complete!</div>
                  <div style={{ color:T.muted, fontSize:14, marginBottom:16 }}>Your dashboard is ready with {selectedAnalyses.length} analyses.</div>
                  <button className="btn-primary" onClick={() => navigate("/dashboard")}>View Dashboard →</button>
                </div>
              )}
            </div>
          </div>

          {/* SIDEBAR COLUMN */}
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {/* Recent uploads */}
            <div className="glass-card fade-up-1" style={{ padding:0, overflow:"hidden" }}>
              <div style={{ padding:"14px 18px", borderBottom:"1px solid rgba(13,148,136,0.12)" }}>
                <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:14, color:T.white }}>Recent Uploads</span>
              </div>
              {recentFiles.map((f, i) => (
                <div key={i} style={{ padding:"12px 18px", borderBottom: i < recentFiles.length - 1 ? "1px solid rgba(13,148,136,0.08)" : "none", cursor:"pointer", transition:"background 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.background="rgba(2,195,154,0.04)")}
                  onMouseLeave={e => (e.currentTarget.style.background="transparent")}
                >
                  <div style={{ fontSize:13, color:T.light, marginBottom:3 }}>📄 {f.name}</div>
                  <div style={{ fontSize:11, color:T.muted, fontFamily:"'DM Mono',monospace" }}>{f.size} · {f.date}</div>
                </div>
              ))}
            </div>

            {/* Tips */}
            <div className="glass-card fade-up-2" style={{ padding:18 }}>
              <h4 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:13, color:T.white, marginBottom:14, display:"flex", alignItems:"center", gap:8 }}>
                💡 Tips
              </h4>
              {[
                "Use snake_case column names for best auto-detection.",
                "Include a date column for time-series charts.",
                "Numeric columns trigger automatic histograms.",
                "First row should be headers, not data.",
              ].map((tip, i) => (
                <div key={i} style={{ fontSize:12, color:T.muted, lineHeight:1.5, padding:"8px 0", borderBottom: i < 3 ? "1px solid rgba(13,148,136,0.08)" : "none" }}>
                  {tip}
                </div>
              ))}
            </div>

            {/* Supported formats */}
            <div className="glass-card fade-up-3" style={{ padding:18 }}>
              <h4 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:13, color:T.white, marginBottom:14 }}>Supported Formats</h4>
              {[
                { fmt:"CSV", note:"All encodings", ok:true },
                { fmt:"TSV", note:"Tab-separated", ok:true },
                { fmt:"XLSX", note:"Coming soon", ok:false },
                { fmt:"JSON", note:"Coming soon", ok:false },
              ].map(f => (
                <div key={f.fmt} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"6px 0", borderBottom:"1px solid rgba(13,148,136,0.07)" }}>
                  <span style={{ fontFamily:"'DM Mono',monospace", fontSize:13, color: f.ok ? T.light : T.gray }}>{f.fmt}</span>
                  <span className={`badge ${f.ok ? "badge-success" : "badge-pending"}`}>{f.note}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   DASHBOARD PAGE
═══════════════════════════════════════════════════════════ */
function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("8M");

  const stats = [
    { num:"89,012", label:"Total Rows",       delta:"+12.4%", up:true },
    { num:"14",     label:"Columns",           delta:"—",       up:true },
    { num:"0.3%",   label:"Missing Values",    delta:"-0.8%",  up:true },
    { num:"3",      label:"Outliers Flagged",  delta:"+1",      up:false },
  ];

  return (
    <div style={{ minHeight:"100vh", paddingLeft:220, background:T.navy }}>
      <Sidebar />

      {/* TOP BAR */}
      <div style={{ position:"fixed", top:0, left:220, right:0, zIndex:40, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 32px", background:"rgba(2,27,44,0.9)", backdropFilter:"blur(12px)", borderBottom:"1px solid rgba(13,148,136,0.15)" }}>
        <div style={{ display:"flex", flexDirection:"column" }}>
          <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:18, color:T.white }}>user_events_march.csv</span>
          <span style={{ fontSize:12, color:T.muted, fontFamily:"'DM Mono',monospace" }}>89,012 rows · 14 columns · Analyzed Mar 9, 2025</span>
        </div>
        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
          <div className="chip" style={{ padding:"4px 12px", fontSize:11 }}>
            <span className="dot" />
            Live
          </div>
          <button className="btn-ghost btn-sm" onClick={() => navigate("/upload")}>+ New</button>
          <button className="btn-primary btn-sm">Export PDF</button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ padding:"80px 32px 48px" }}>
        {/* TABS */}
        <div style={{ display:"flex", gap:4, marginBottom:28, background:"rgba(10,58,82,0.4)", padding:4, borderRadius:12, width:"fit-content" }}>
          {["overview","data","charts"].map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              style={{ padding:"8px 20px", borderRadius:9, border:"none", cursor:"pointer", fontFamily:"'Outfit',sans-serif", fontWeight:500, fontSize:14, transition:"all 0.2s",
                background: activeTab===t ? "rgba(2,195,154,0.15)" : "transparent",
                color: activeTab===t ? T.mint : T.muted,
                outline: activeTab===t ? "1px solid rgba(2,195,154,0.3)" : "none",
              }}
            >
              {t.charAt(0).toUpperCase()+t.slice(1)}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW TAB ── */}
        {activeTab === "overview" && (
          <div style={{ animation:"fadeIn 0.3s ease" }}>
            {/* Stat cards */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:24 }}>
              {stats.map((s,i) => (
                <div key={i} className="stat-card fade-up" style={{ animationDelay:`${i*0.08}s` }}>
                  <div className="stat-num">{s.num}</div>
                  <div className="stat-label">{s.label}</div>
                  <div className={`stat-delta ${s.up ? "delta-up" : "delta-down"}`} style={{ marginTop:8 }}>
                    {s.delta}
                  </div>
                </div>
              ))}
            </div>

            {/* Charts row */}
            <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:16, marginBottom:16 }}>
              {/* Area chart */}
              <div className="glass-card" style={{ padding:"20px 20px 10px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                  <div>
                    <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:15, color:T.white }}>Value & Volume Trend</h3>
                    <p style={{ fontSize:12, color:T.muted, fontFamily:"'DM Mono',monospace", marginTop:3 }}>Monthly performance</p>
                  </div>
                  <div style={{ display:"flex", gap:6 }}>
                    {["3M","6M","8M"].map(r => (
                      <button key={r} onClick={() => setTimeRange(r)}
                        style={{ padding:"4px 10px", borderRadius:6, border:"none", cursor:"pointer", fontSize:11, fontFamily:"'DM Mono',monospace", transition:"all 0.2s",
                          background: timeRange===r ? "rgba(2,195,154,0.2)" : "transparent",
                          color: timeRange===r ? T.mint : T.muted,
                        }}
                      >{r}</button>
                    ))}
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={mockTrend} margin={{ top:5, right:10, left:-10, bottom:0 }}>
                    <defs>
                      <linearGradient id="gradV" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={T.mint}  stopOpacity={0.3} />
                        <stop offset="95%" stopColor={T.mint}  stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gradVol" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={T.teal}  stopOpacity={0.2} />
                        <stop offset="95%" stopColor={T.teal}  stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="value"  stroke={T.mint} fill="url(#gradV)"   strokeWidth={2} name="Value" />
                    <Area type="monotone" dataKey="volume" stroke={T.teal} fill="url(#gradVol)" strokeWidth={2} name="Volume" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Pie chart */}
              <div className="glass-card" style={{ padding:"20px 20px 10px" }}>
                <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:15, color:T.white, marginBottom:4 }}>Category Split</h3>
                <p style={{ fontSize:12, color:T.muted, fontFamily:"'DM Mono',monospace", marginBottom:12 }}>By event type</p>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={mockCategories} cx="50%" cy="50%" innerRadius={45} outerRadius={72} paddingAngle={3} dataKey="value">
                      {mockCategories.map((entry, index) => (
                        <Cell key={index} fill={entry.fill} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                  {mockCategories.map((c, i) => (
                    <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <div style={{ width:8, height:8, borderRadius:2, background:c.fill, flexShrink:0 }} />
                        <span style={{ fontSize:12, color:T.muted }}>{c.name}</span>
                      </div>
                      <span style={{ fontSize:12, fontFamily:"'DM Mono',monospace", color:T.light }}>{c.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bar chart + Insights row */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
              {/* Bar chart */}
              <div className="glass-card" style={{ padding:"20px 20px 10px" }}>
                <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:15, color:T.white, marginBottom:4 }}>Quarterly Comparison</h3>
                <p style={{ fontSize:12, color:T.muted, fontFamily:"'DM Mono',monospace", marginBottom:16 }}>Current vs Previous year</p>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={mockBar} margin={{ top:5, right:10, left:-10, bottom:0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="current"  fill={T.mint} radius={[4,4,0,0]} name="2024" />
                    <Bar dataKey="previous" fill={T.primary} radius={[4,4,0,0]} name="2023" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* AI Insights panel */}
              <div className="glass-card" style={{ padding:20 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
                  <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:15, color:T.white }}>AI Insights</h3>
                  <span className="badge badge-info">GPT-4</span>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {insightItems.map((item, i) => (
                    <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"10px 12px", borderRadius:10, background:"rgba(10,58,82,0.5)", border:"1px solid rgba(13,148,136,0.1)", animation:`slide-in-right 0.4s ${i*0.1}s both` }}>
                      <span style={{ fontSize:16, flexShrink:0 }}>{item.icon}</span>
                      <span style={{ fontSize:13, color: item.type==="positive" ? T.mint : item.type==="warning" ? "#EAB308" : T.muted, lineHeight:1.5 }}>{item.text}</span>
                    </div>
                  ))}
                </div>
                <button className="btn-ghost btn-sm" style={{ marginTop:16, width:"100%" }}>
                  Generate Full Report
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── DATA TAB ── */}
        {activeTab === "data" && (
          <div style={{ animation:"fadeIn 0.3s ease" }}>
            {/* Column info cards */}
            <div style={{ marginBottom:24 }}>
              <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:16, color:T.white, marginBottom:16 }}>Column Summary</h3>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
                {[
                  { name:"user_id",    type:"integer",  nulls:0,   unique:"89,012" },
                  { name:"event_type", type:"string",   nulls:23,  unique:"4" },
                  { name:"timestamp",  type:"datetime", nulls:0,   unique:"88,745" },
                  { name:"revenue",    type:"float",    nulls:412, unique:"1,024" },
                  { name:"session_id", type:"string",   nulls:5,   unique:"14,332" },
                  { name:"page_url",   type:"string",   nulls:89,  unique:"221" },
                  { name:"duration_s", type:"float",    nulls:0,   unique:"4,201" },
                  { name:"country",    type:"string",   nulls:0,   unique:"47" },
                ].map((col, i) => (
                  <div key={i} className="stat-card" style={{ padding:"14px 16px" }}>
                    <div style={{ fontSize:12, fontFamily:"'DM Mono',monospace", color:T.mint, marginBottom:4, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{col.name}</div>
                    <div style={{ fontSize:11, color:T.gray, marginBottom:8, fontFamily:"'DM Mono',monospace" }}>{col.type}</div>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:T.muted }}>
                      <span>Nulls: <span style={{ color: col.nulls > 0 ? "#EAB308" : T.mint }}>{col.nulls}</span></span>
                      <span>Uniq: {col.unique}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Data table */}
            <div className="glass-card" style={{ padding:0, overflow:"hidden" }}>
              <div style={{ padding:"14px 20px", borderBottom:"1px solid rgba(13,148,136,0.15)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:14, color:T.white }}>Dataset Files</span>
                  <span style={{ marginLeft:10, fontSize:12, color:T.muted, fontFamily:"'DM Mono',monospace" }}>5 uploads</span>
                </div>
                <button className="btn-primary btn-sm" onClick={() => navigate("/upload")}>+ Upload</button>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th><th>Filename</th><th>Rows</th><th>Cols</th><th>Size</th><th>Status</th><th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {mockRows.map(row => (
                    <tr key={row.id}>
                      <td><span style={{ fontFamily:"'DM Mono',monospace", fontSize:12, color:T.muted }}>{row.id}</span></td>
                      <td><span style={{ fontFamily:"'DM Mono',monospace" }}>📄 {row.name}</span></td>
                      <td>{row.rows}</td>
                      <td>{row.cols}</td>
                      <td>{row.size}</td>
                      <td><span className={`badge badge-${row.status}`}>{row.status}</span></td>
                      <td style={{ color:T.muted }}>{row.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── CHARTS TAB ── */}
        {activeTab === "charts" && (
          <div style={{ animation:"fadeIn 0.3s ease" }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
              {/* Full area chart */}
              <div className="glass-card" style={{ padding:"20px 20px 10px", gridColumn:"1/-1" }}>
                <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:15, color:T.white, marginBottom:4 }}>Monthly Revenue & Volume — Full View</h3>
                <p style={{ fontSize:12, color:T.muted, fontFamily:"'DM Mono',monospace", marginBottom:16 }}>8-month period</p>
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={mockTrend}>
                    <defs>
                      <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={T.mint} stopOpacity={0.35} />
                        <stop offset="95%" stopColor={T.mint} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#60A5FA" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#60A5FA" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontFamily:"'DM Mono',monospace", fontSize:12, color:T.muted }} />
                    <Area type="monotone" dataKey="value"  stroke={T.mint}   fill="url(#g1)" strokeWidth={2.5} name="Revenue" />
                    <Area type="monotone" dataKey="volume" stroke="#60A5FA"  fill="url(#g2)" strokeWidth={2.5} name="Volume" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Bar chart */}
              <div className="glass-card" style={{ padding:"20px 20px 10px" }}>
                <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:15, color:T.white, marginBottom:4 }}>Quarterly Bar Chart</h3>
                <p style={{ fontSize:12, color:T.muted, fontFamily:"'DM Mono',monospace", marginBottom:16 }}>YoY comparison</p>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={mockBar}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontFamily:"'DM Mono',monospace", fontSize:12, color:T.muted }} />
                    <Bar dataKey="current"  fill={T.mint}    radius={[4,4,0,0]} name="2024" />
                    <Bar dataKey="previous" fill={T.primary} radius={[4,4,0,0]} name="2023" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Pie + donut */}
              <div className="glass-card" style={{ padding:"20px 20px 10px" }}>
                <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:15, color:T.white, marginBottom:4 }}>Category Distribution</h3>
                <p style={{ fontSize:12, color:T.muted, fontFamily:"'DM Mono',monospace", marginBottom:16 }}>Event type breakdown</p>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={mockCategories} cx="50%" cy="50%" outerRadius={85} paddingAngle={2} dataKey="value" label={({ name, value }) => `${name}: ${value}%`} labelLine={false}>
                      {mockCategories.map((entry, index) => (
                        <Cell key={index} fill={entry.fill} stroke="rgba(2,27,44,0.5)" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── EXPORT APP ────────────────────────────────────────── */
function AppInner() {
  const location = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [location.pathname]);

  return (
    <>
      <GlobalStyle />
      {location.pathname === "/" && <Nav />}
      <Routes>
        <Route path="/"          element={<Landing />} />
        <Route path="/upload"    element={<Upload />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*"          element={<Landing />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}