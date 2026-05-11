

// src/pages/Dashboard.jsx - Updated with History Tab Removed
import { useState, useEffect, useRef, useMemo } from "react";
import api from "../api/api";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadarChart,
  Radar, PolarGrid, PolarAngleAxis
} from "recharts";

/* ═══════════════ ANIMATED COUNTER ═══════════════ */
function AnimCount({ to, prefix = "", suffix = "", duration = 1400 }) {
  const [val, setVal] = useState(0);
  const raf = useRef(null);
  useEffect(() => {
    if (!to) return;
    const t0 = performance.now();
    const tick = now => {
      const p = Math.min((now - t0) / duration, 1);
      setVal(Math.round((1 - Math.pow(1 - p, 3)) * to));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [to]);
  return <>{prefix}{val.toLocaleString()}{suffix}</>;
}

/* ═══════════════ LIVE PARKING MAP ═══════════════ */
function LiveParkingMap({ history, theme }) {
  const [frame, setFrame] = useState(0);
  const isDark = theme === "dark";

  const lots = useMemo(() => {
    const base = [
      { id:"A", name:"Lot Alpha", total:20, x:1, y:1 },
      { id:"B", name:"Lot Beta",  total:20, x:3, y:1 },
      { id:"C", name:"Lot Gamma", total:20, x:5, y:1 },
      { id:"D", name:"Lot Delta", total:20, x:2, y:3 },
      { id:"E", name:"Lot Echo",  total:20, x:4, y:3 },
      { id:"F", name:"Lot Foxt",  total:20, x:6, y:3 },
    ];
    const map = {};
    history.forEach(h => {
      const key = String(h.parking_lot || "").toUpperCase().trim();
      const match = base.find(b => key.includes(b.id) || key.includes(b.name.split(" ")[1].toUpperCase()));
      if (match) map[match.id] = (map[match.id] || 0) + 1;
    });
    return base.map(b => ({ ...b, used: Math.min(map[b.id] || Math.floor(Math.random() * 14), b.total) }));
  }, [history, frame]);

  useEffect(() => {
    const id = setInterval(() => setFrame(f => f + 1), 3000);
    return () => clearInterval(id);
  }, []);

  const getColor = pct => {
    if (pct > 0.8) return { fill: "rgba(239,68,68,0.18)", stroke: "#ef4444", text: "#ef4444" };
    if (pct > 0.5) return { fill: "rgba(251,191,36,0.14)", stroke: "#fbbf24", text: "#f59e0b" };
    return { fill: "rgba(52,211,153,0.14)", stroke: "#34d399", text: "#10b981" };
  };

  const bgColor = isDark ? "rgba(15,18,35,0.6)" : "rgba(240,242,255,0.9)";
  const textColor = isDark ? "rgba(255,255,255,0.7)" : "rgba(30,41,59,0.8)";
  const subTextColor = isDark ? "rgba(255,255,255,0.25)" : "rgba(100,116,139,0.6)";
  const gridColor = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.06)";

  return (
    <div style={{ position:"relative" }}>
      <svg viewBox="0 0 420 240" style={{ width:"100%", borderRadius:12, background:bgColor }}>
        {[70,140,210].map(x => <line key={x} x1={x} y1="0" x2={x} y2="240" stroke={gridColor} strokeWidth="1"/>)}
        {[80,160].map(y  => <line key={y} x1="0" y1={y} x2="420" y2={y} stroke={gridColor} strokeWidth="1"/>)}
        <rect x="0" y="0" width="420" height="240" rx="12" fill="none" stroke={gridColor} strokeWidth="1"/>

        {lots.map(lot => {
          const cx = lot.x * 60;
          const cy = lot.y * 72;
          const pct = lot.used / lot.total;
          const c = getColor(pct);
          return (
            <g key={lot.id}>
              <rect x={cx-28} y={cy-32} width={56} height={60} rx={8}
                fill={c.fill} stroke={c.stroke} strokeWidth={1.5} opacity={0.9}/>
              <text x={cx} y={cy-14} textAnchor="middle" fill={textColor} fontSize={9} fontFamily="monospace" fontWeight="700">
                {lot.id}
              </text>
              <text x={cx} y={cy+2} textAnchor="middle" fill={c.text} fontSize={14} fontFamily="monospace" fontWeight="800">
                {lot.used}
              </text>
              <text x={cx} y={cy+16} textAnchor="middle" fill={subTextColor} fontSize={8} fontFamily="monospace">
                /{lot.total}
              </text>
              <rect x={cx-20} y={cy+22} width={40} height={4} rx={2} fill={isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.1)"}/>
              <rect x={cx-20} y={cy+22} width={40*pct} height={4} rx={2} fill={c.stroke}/>
            </g>
          );
        })}

        <circle cx="10" cy="10" r="4" fill="#34d399" opacity={0.85}>
          <animate attributeName="opacity" values="0.85;0.2;0.85" dur="1.8s" repeatCount="indefinite"/>
        </circle>
        <text x="18" y="14" fill={isDark ? "rgba(52,211,153,0.7)" : "#059669"} fontSize="8" fontFamily="monospace">LIVE</text>
      </svg>

      <div style={{ display:"flex", gap:16, marginTop:12 }}>
        {[["#34d399","Available"],["#fbbf24","Moderate"],["#ef4444","Busy"]].map(([c,l]) => (
          <div key={l} style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:isDark ? "rgba(255,255,255,0.4)" : "#64748b", fontFamily:"monospace" }}>
            <div style={{ width:8, height:8, borderRadius:2, background:c }}/>
            {l}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════ CUSTOM TOOLTIP ═══════════════ */
const Tip = ({ active, payload, label, theme }) => {
  const isDark = theme === "dark";
  if (!active || !payload?.length) return null;
  const bg = isDark ? "rgba(10,14,28,0.95)" : "rgba(255,255,255,0.98)";
  const border = isDark ? "1px solid rgba(99,102,241,0.3)" : "1px solid rgba(99,102,241,0.2)";
  const shadow = isDark ? "0 16px 40px rgba(0,0,0,0.6)" : "0 16px 40px rgba(0,0,0,0.1)";
  const textColor = isDark ? "rgba(148,163,184,0.7)" : "#64748b";
  const valueColor = isDark ? "#818cf8" : "#4f46e5";
  return (
    <div style={{
      background:bg, border:border,
      borderRadius:10, padding:"10px 14px",
      fontFamily:"'DM Mono',monospace", boxShadow:shadow,
    }}>
      <div style={{ fontSize:10, color:textColor, marginBottom:5, letterSpacing:"0.5px" }}>{label}</div>
      {payload.map((p,i) => (
        <div key={i} style={{ fontSize:13, fontWeight:700, color:p.color||valueColor, display:"flex", alignItems:"center", gap:6 }}>
          <div style={{ width:7, height:7, borderRadius:"50%", background:p.color||valueColor }}/>
          {p.name==="fee" ? `₹${p.value?.toLocaleString()}` : p.value}
          <span style={{ fontSize:10, color:textColor, fontWeight:400 }}>{p.name}</span>
        </div>
      ))}
    </div>
  );
};

/* ═══════════════ ICONS ═══════════════ */
const Ico = ({ d, size=20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d}/>
  </svg>
);
const IcoCar  = ({size=20,color="currentColor"}) => <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>;
const IcoGrid = () => <Ico d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z"/>;
const IcoHist = () => <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polyline points="12 8 12 12 14.5 14.5"/><path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5"/></svg>;
const IcoBook = () => <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const IcoUser = () => <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>;
const IcoOut  = () => <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const IcoWallet = () => <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M21 12V7H5a2 2 0 010-4h11v4"/><path d="M3 7v13a2 2 0 002 2h16v-5"/><circle cx="18" cy="12" r="1" fill="currentColor" stroke="none"/></svg>;
const IcoTrend= () => <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>;
const IcoClock= () => <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const IcoMap  = () => <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="12" r="3"/></svg>;
const IcoSpin = () => <svg width={32} height={32} viewBox="0 0 24 24" fill="none" strokeWidth="2.5" style={{animation:"db_spin .75s linear infinite"}}><circle cx="12" cy="12" r="10" stroke="rgba(99,102,241,0.15)"/><path d="M12 2a10 10 0 0110 10" stroke="#6366f1"/></svg>;
const IcoChev = () => <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>;
const IcoNotif= () => <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>;
const IcoSun   = () => <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>;
const IcoMoon  = () => <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;

/* ═══════════════ STAT CARD ═══════════════ */
function StatCard({ icon, label, value, sub, gradient, glow, prefix="", suffix="", delay=0, isNumber=true, theme }) {
  const [vis, setVis] = useState(false);
  const isDark = theme === "dark";
  useEffect(() => { const t = setTimeout(() => setVis(true), delay); return () => clearTimeout(t); }, []);

  const cardBg = isDark ? "rgba(10,13,26,0.92)" : "rgba(255,255,255,0.96)";
  const borderColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const textColor = isDark ? "#fff" : "#0f172a";
  const labelColor = isDark ? "rgba(148,163,184,0.6)" : "#64748b";

  return (
    <div className={`db-stat ${isDark ? "" : "db-stat-light"}`} style={{ animationDelay:`${delay}ms` }}>
      <div className="db-stat-glow" style={{ background:gradient, opacity:0.18, filter:"blur(28px)" }}/>
      <div className="db-stat-border" style={{ background:`linear-gradient(135deg, ${glow}22, transparent 60%)` }}/>
      <div className="db-stat-content" style={{ background:cardBg, border:`1px solid ${borderColor}` }}>
        <div className="db-stat-top">
          <div className="db-stat-icon" style={{ background:`${glow}18`, color:glow, border:`1px solid ${glow}30` }}>
            {icon}
          </div>
          <div className="db-stat-spark" style={{ background:gradient }}/>
        </div>
        <div className="db-stat-val" style={{ color:textColor }}>
          {isNumber && vis ? <AnimCount to={typeof value==="number"?value:0} prefix={prefix} suffix={suffix}/> : `${prefix}${value}${suffix}`}
        </div>
        <div className="db-stat-label" style={{ color:labelColor }}>{label}</div>
        <div className="db-stat-sub" style={{ color:isDark ? "rgba(148,163,184,0.35)" : "#94a3b8" }}>{sub}</div>
      </div>
    </div>
  );
}

/* ═══════════════ NAV ITEM ═══════════════ */
function NavItem({ icon, label, active, badge, onClick, theme }) {
  const isDark = theme === "dark";
  const activeBg = isDark ? "rgba(99,102,241,0.1)" : "rgba(79,70,229,0.08)";
  const activeColor = isDark ? "#a5b4fc" : "#4f46e5";
  const hoverBg = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)";
  const textColor = isDark ? "rgba(148,163,184,0.6)" : "#475569";
  const activeTextColor = isDark ? "#a5b4fc" : "#4f46e5";

  return (
    <button 
      className={`db-nav-item${active?" db-nav-active":""}`} 
      onClick={onClick}
      style={{
        background: active ? activeBg : "transparent",
        color: active ? activeTextColor : textColor,
      }}
      onMouseEnter={e => { if(!active) e.currentTarget.style.background = hoverBg }}
      onMouseLeave={e => { if(!active) e.currentTarget.style.background = "transparent" }}
    >
      {active && <div className="db-nav-glow" style={{ background: `linear-gradient(90deg, ${activeBg}, transparent)` }}/>}
      <span className="db-nav-icon">{icon}</span>
      <span className="db-nav-label">{label}</span>
      {badge && <span className="db-nav-badge" style={{ background: isDark ? "rgba(99,102,241,0.22)" : "rgba(79,70,229,0.1)", color: isDark ? "#a5b4fc" : "#4f46e5" }}>{badge}</span>}
      {active && <span className="db-nav-indicator" style={{ background: "linear-gradient(180deg,#818cf8,#6366f1)" }}/>}
    </button>
  );
}

/* ═══════════════ MAIN DASHBOARD ═══════════════ */
export default function Dashboard({ onNavigate, avatarUrl="" }) {
  const username = localStorage.getItem("parking_user") || "User";
  const initials = username.slice(0,2).toUpperCase();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [chartType, setChartType] = useState("fee");
  const [time, setTime]       = useState(new Date());
  const [theme, setTheme]     = useState(() => localStorage.getItem("parking_theme") || "light");

  useEffect(() => {
    localStorage.setItem("parking_theme", theme);
    document.body.style.backgroundColor = theme === "dark" ? "#06091a" : "#f1f5f9";
    document.body.style.color = theme === "dark" ? "#e2e8f0" : "#0f172a";
  }, [theme]);

  const hour = new Date().getHours();
  const greeting = hour<12?"Good morning":hour<17?"Good afternoon":"Good evening";

  useEffect(() => {
    const tick = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await api.get("history/");
        setHistory(Array.isArray(res.data) ? res.data : []);
      } catch(e) {
        setError(e.response?.data?.error || e.response?.data?.detail || "Failed to load data.");
      } finally { setLoading(false); }
    })();
  }, []);

  /* derived stats */
  const totalBookings = history.length;
  const totalSpent    = history.reduce((s,h)=>s+(Number(h.predicted_fee)||0),0);
  const totalHours    = history.reduce((s,h)=>s+(Number(h.duration)||0),0);
  const avgFee        = totalBookings ? Math.round(totalSpent/totalBookings) : 0;

  /* lot grouping */
  const lotMap = useMemo(()=>{
    const m={};
    history.forEach(h=>{
      const k=h.parking_lot||"Other";
      if(!m[k]) m[k]={lot:k,bookings:0,fee:0,hours:0};
      m[k].bookings++; m[k].fee+=Number(h.predicted_fee)||0; m[k].hours+=Number(h.duration)||0;
    });
    return Object.values(m).slice(0,8);
  },[history]);

  /* trend data */
  const trendData = useMemo(()=>{
    const size = Math.max(1,Math.ceil(history.length/8));
    return Array.from({length:Math.min(8,Math.ceil(history.length/size))},(_, i)=>{
      const sl = history.slice(i*size,(i+1)*size);
      return {
        name:`#${i*size+1}`,
        fee:sl.reduce((s,h)=>s+(Number(h.predicted_fee)||0),0),
        bookings:sl.length,
        hours:sl.reduce((s,h)=>s+(Number(h.duration)||0),0),
      };
    });
  },[history]);

  const logout = () => {
    localStorage.removeItem("parking_token");
    localStorage.removeItem("parking_user");
    localStorage.removeItem("parking_avatar");
    localStorage.removeItem("parking_theme");
    onNavigate?.("login");
  };

  const toggleTheme = () => {
    setTheme(prev => prev === "dark" ? "light" : "dark");
  };

  const isDark = theme === "dark";
  const rootBg = isDark ? "#06091a" : "#f1f5f9";
  const sidebarBg = isDark ? "rgba(12,15,30,0.98)" : "rgba(255,255,255,0.98)";
  const cardBg = isDark ? "rgba(12,15,30,0.8)" : "rgba(255,255,255,0.95)";
  const topbarBg = isDark ? "rgba(12,15,30,0.85)" : "rgba(255,255,255,0.9)";
  const textPrimary = isDark ? "#fff" : "#0f172a";
  const textSecondary = isDark ? "rgba(148,163,184,0.6)" : "#475569";
  const borderColor = isDark ? "rgba(99,102,241,0.08)" : "rgba(0,0,0,0.06)";
  const heroBg = isDark 
    ? "linear-gradient(135deg,#12163a 0%,#1a1f4a 40%,#0f2a40 100%)"
    : "linear-gradient(135deg,#eef2ff 0%,#e0e7ff 40%,#f5f3ff 100%)";
  const heroText = isDark ? "#fff" : "#0f172a";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@400;500;700;800;900&family=DM+Mono:wght@400;500&display=swap');
        @keyframes db_spin  { to{transform:rotate(360deg)} }
        @keyframes db_in    { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes db_fade  { from{opacity:0} to{opacity:1} }
        @keyframes db_slide { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:translateX(0)} }
        @keyframes db_glow  { 0%,100%{opacity:.18} 50%{opacity:.32} }
        @keyframes db_pulse { 0%{box-shadow:0 0 0 0 rgba(52,211,153,.5)} 100%{box-shadow:0 0 0 8px rgba(52,211,153,0)} }
        @keyframes db_row   { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:translateX(0)} }

        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html,body{height:100%;background:${rootBg};transition:background 0.2s ease}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:${isDark ? "rgba(99,102,241,0.2)" : "rgba(0,0,0,0.15)"};border-radius:4px}

        .db-root{display:flex;min-height:100vh;background:${rootBg};font-family:'Cabinet Grotesk',sans-serif;color:${textPrimary};transition:background 0.2s ease}
        .db-sidebar{
          width:220px;min-height:100vh;flex-shrink:0;
          background:${sidebarBg};
          border-right:1px solid ${borderColor};
          display:flex;flex-direction:column;position:sticky;top:0;height:100vh;
          padding:0;overflow:hidden;transition:all 0.2s ease;
        }
        .db-sidebar::after{
          content:'';position:absolute;inset:0;pointer-events:none;
          background:${isDark ? "radial-gradient(ellipse 100% 40% at 50% 0%,rgba(99,102,241,0.06) 0%,transparent 70%)" : "none"};
        }
        .db-brand{
          padding:24px 18px 20px;border-bottom:1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.06)"};
          display:flex;align-items:center;gap:10px;position:relative;z-index:1;
        }
        .db-brand-mark{
          width:36px;height:36px;border-radius:10px;flex-shrink:0;
          background:linear-gradient(135deg,#6366f1,#818cf8);
          display:flex;align-items:center;justify-content:center;
          box-shadow:0 4px 16px rgba(99,102,241,0.45);
        }
        .db-brand-name{font-size:16px;font-weight:900;color:${textPrimary};letter-spacing:-.4px}
        .db-brand-ver{font-size:9.5px;color:${isDark ? "rgba(255,255,255,0.25)" : "#94a3b8"};font-family:'DM Mono',monospace;letter-spacing:.5px}
        .db-nav{padding:14px 10px;flex:1;display:flex;flex-direction:column;gap:2px;position:relative;z-index:1;overflow-y:auto}
        .db-nav-sect{font-size:9.5px;font-weight:600;color:${isDark ? "rgba(255,255,255,0.18)" : "#94a3b8"};letter-spacing:1.3px;text-transform:uppercase;font-family:'DM Mono',monospace;padding:10px 8px 5px}
        .db-nav-item{
          width:100%;display:flex;align-items:center;gap:9px;padding:9px 10px;
          border-radius:9px;border:none;background:transparent;
          cursor:pointer;font-family:'Cabinet Grotesk',sans-serif;font-size:13px;font-weight:500;
          transition:all .16s;position:relative;overflow:hidden;text-align:left;
        }
        .db-nav-glow{position:absolute;inset:0;pointer-events:none}
        .db-nav-icon{width:18px;height:18px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .db-nav-label{flex:1}
        .db-nav-badge{font-size:10px;font-weight:700;padding:2px 6px;border-radius:20px;font-family:'DM Mono',monospace}
        .db-nav-indicator{position:absolute;right:0;top:50%;transform:translateY(-50%);width:3px;height:18px;border-radius:2px}
        .db-sidebar-foot{padding:14px 14px 18px;border-top:1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.06)"};position:relative;z-index:1}
        .db-user-pill{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:12px;background:${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)"};border:1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"}}
        .db-user-av{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#818cf8);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;color:#fff;flex-shrink:0;overflow:hidden}
        .db-user-av img{width:100%;height:100%;object-fit:cover}
        .db-user-name{font-size:12.5px;font-weight:700;color:${textPrimary};flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .db-user-role{font-size:10px;color:${isDark ? "rgba(148,163,184,0.4)" : "#94a3b8"};font-family:'DM Mono',monospace}
        .db-logout-sm{width:28px;height:28px;border-radius:8px;border:none;background:rgba(239,68,68,0.07);color:rgba(239,68,68,0.55);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .15s;flex-shrink:0}
        .db-logout-sm:hover{background:rgba(239,68,68,0.15);color:#f87171}

        .db-main{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0}
        .db-topbar{
          height:60px;background:${topbarBg};backdrop-filter:blur(20px);
          border-bottom:1px solid ${borderColor};
          display:flex;align-items:center;padding:0 28px;gap:14px;
          position:sticky;top:0;z-index:50;flex-shrink:0;
        }
        .db-topbar-left{flex:1}
        .db-topbar-title{font-size:17px;font-weight:900;color:${textPrimary};letter-spacing:-.4px}
        .db-topbar-sub{font-size:11.5px;color:${isDark ? "rgba(148,163,184,0.5)" : "#94a3b8"};font-family:'DM Mono',monospace;margin-top:1px}
        .db-clock{font-size:12px;font-weight:600;color:${isDark ? "rgba(148,163,184,0.5)" : "#94a3b8"};font-family:'DM Mono',monospace;letter-spacing:.5px}
        .db-notif-btn{width:36px;height:36px;border-radius:9px;border:1px solid ${borderColor};background:${isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)"};display:flex;align-items:center;justify-content:center;cursor:pointer;color:${isDark ? "rgba(148,163,184,0.6)" : "#64748b"};position:relative;transition:all .15s}
        .db-notif-btn:hover{background:${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)"};color:${textPrimary}}
        .db-notif-pip{position:absolute;top:8px;right:8px;width:6px;height:6px;border-radius:50%;background:#34d399;border:1.5px solid ${isDark ? "rgba(12,15,30,.9)" : "white"};animation:db_pulse 2s ease infinite}
        .db-topbar-av{width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#818cf8);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;color:#fff;box-shadow:0 3px 12px rgba(99,102,241,0.4);flex-shrink:0;overflow:hidden;cursor:pointer}
        
        .db-body{flex:1;padding:24px 28px 36px;overflow-y:auto}
        .db-hero{
          border-radius:18px;padding:26px 32px;
          background:${heroBg};
          border:1px solid ${isDark ? "rgba(99,102,241,0.15)" : "rgba(99,102,241,0.1)"};
          display:flex;align-items:center;justify-content:space-between;
          margin-bottom:22px;position:relative;overflow:hidden;
          animation:db_in .5s ease both;
          box-shadow:${isDark ? "0 8px 40px rgba(0,0,0,0.4),inset 0 1px 0 rgba(255,255,255,0.06)" : "0 8px 30px rgba(0,0,0,0.05)"};
        }
        .db-hero-dots{position:absolute;inset:0;background-image:radial-gradient(${isDark ? "rgba(255,255,255,0.035)" : "rgba(0,0,0,0.03)"} 1px,transparent 1px);background-size:20px 20px;pointer-events:none}
        .db-hero-left{position:relative;z-index:1}
        .db-hero-tag{display:inline-flex;align-items:center;gap:6px;background:rgba(52,211,153,0.1);border:1px solid rgba(52,211,153,0.2);color:#059669;border-radius:20px;padding:4px 11px;font-size:10px;font-weight:700;font-family:'DM Mono',monospace;letter-spacing:.5px;margin-bottom:10px}
        .db-hero-tag-dot{width:5px;height:5px;border-radius:50%;background:#34d399;animation:db_pulse 2s ease infinite}
        .db-hero-greeting{font-size:11px;color:${isDark ? "rgba(165,180,252,0.65)" : "#6366f1"};font-family:'DM Mono',monospace;letter-spacing:.7px;text-transform:uppercase;margin-bottom:5px}
        .db-hero-name{font-size:26px;font-weight:900;color:${heroText};letter-spacing:-.7px;margin-bottom:6px}
        .db-hero-sub{font-size:13.5px;color:${isDark ? "rgba(255,255,255,0.38)" : "#475569"};font-weight:400;max-width:400px;line-height:1.5}
        .db-hero-right{display:flex;gap:12px;position:relative;z-index:1;flex-shrink:0}
        .db-hero-kpi{background:${isDark ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.8)"};border:1px solid ${isDark ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.06)"};border-radius:14px;padding:14px 20px;text-align:center;min-width:100px;backdrop-filter:blur(10px);transition:all .18s}
        .db-hero-kpi:hover{background:${isDark ? "rgba(255,255,255,0.11)" : "white"};transform:translateY(-2px)}
        .db-hero-kpi-val{font-size:22px;font-weight:900;color:${heroText};letter-spacing:-.5px;font-family:'DM Mono',monospace}
        .db-hero-kpi-lbl{font-size:9.5px;color:${isDark ? "rgba(255,255,255,0.32)" : "#64748b"};font-family:'DM Mono',monospace;letter-spacing:.4px;margin-top:3px}

        .db-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:20px}
        .db-stat{border-radius:16px;padding:1.5px;position:relative;overflow:hidden;animation:db_in .5s ease both;transition:transform .18s,box-shadow .18s}
        .db-stat:hover{transform:translateY(-3px);box-shadow:0 14px 36px rgba(0,0,0,0.4)}
        .db-stat-light:hover{box-shadow:0 14px 36px rgba(0,0,0,0.1)}
        .db-stat-glow{position:absolute;width:100px;height:100px;border-radius:50%;top:-20px;right:-20px;animation:db_glow 4s ease infinite;pointer-events:none}
        .db-stat-border{position:absolute;inset:0;border-radius:15px;pointer-events:none}
        .db-stat-content{border-radius:15px;padding:20px;position:relative;z-index:1}
        .db-stat-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}
        .db-stat-icon{width:40px;height:40px;border-radius:11px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .db-stat-spark{width:40px;height:20px;border-radius:4px;opacity:.3}
        .db-stat-val{font-size:26px;font-weight:900;letter-spacing:-.8px;margin-bottom:3px;font-family:'DM Mono',monospace}
        .db-stat-label{font-size:12px;font-weight:700;margin-bottom:2px}
        .db-stat-sub{font-size:10.5px;font-family:'DM Mono',monospace}

        .db-row{display:grid;gap:16px;margin-bottom:16px}
        .db-cols-3-2{grid-template-columns:3fr 2fr}
        .db-cols-2-1{grid-template-columns:2fr 1fr}
        .db-cols-1-1{grid-template-columns:1fr 1fr}
        .db-cols-1-1-1{grid-template-columns:1fr 1fr 1fr}

        .db-card{
          background:${cardBg};border:1px solid ${borderColor};
          border-radius:16px;padding:22px;backdrop-filter:blur(16px);
          animation:db_in .5s ease both;
          box-shadow:${isDark ? "0 4px 20px rgba(0,0,0,0.3)" : "0 2px 12px rgba(0,0,0,0.04)"};transition:box-shadow .2s;
        }
        .db-card-title{font-size:14px;font-weight:800;color:${textPrimary};letter-spacing:-.2px}
        .db-card-sub{font-size:11.5px;color:${isDark ? "rgba(148,163,184,0.45)" : "#94a3b8"};margin-top:3px;font-weight:400}
        .db-chip-row{display:flex;gap:5px;flex-wrap:wrap}
        .db-chip{padding:3px 10px;border-radius:20px;font-size:10.5px;font-weight:700;border:1px solid ${borderColor};background:transparent;color:${isDark ? "rgba(148,163,184,0.55)" : "#64748b"};cursor:pointer;transition:all .14s;font-family:'DM Mono',monospace}
        .db-chip.on{background:${isDark ? "rgba(99,102,241,0.15)" : "rgba(79,70,229,0.1)"};border-color:${isDark ? "rgba(99,102,241,0.35)" : "rgba(79,70,229,0.3)"};color:${isDark ? "#a5b4fc" : "#4f46e5"}}

        .db-action-btn{
          width:100%;display:flex;align-items:center;gap:12px;padding:13px 14px;
          border-radius:12px;border:1px solid ${borderColor};background:${isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)"};
          cursor:pointer;text-align:left;transition:all .16s;
          font-family:'Cabinet Grotesk',sans-serif;color:${textPrimary};margin-bottom:7px;
        }
        .db-action-btn:hover{background:${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.04)"};border-color:${isDark ? "rgba(255,255,255,0.11)" : "rgba(0,0,0,0.1)"};transform:translateX(4px)}
        .db-act-ico{width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .db-act-lbl{font-size:13.5px;font-weight:700;color:${textPrimary}}
        .db-act-sub{font-size:11.5px;color:${isDark ? "rgba(148,163,184,0.4)" : "#94a3b8"};margin-top:1px}

        .db-center{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 20px;gap:12px}
        .db-err{background:rgba(239,68,68,0.07);border:1px solid rgba(239,68,68,0.2);border-radius:11px;padding:12px 16px;color:#fca5a5;font-size:13.5px;font-weight:500;margin-bottom:18px;display:flex;gap:8px;align-items:center}

        .db-lot-row{display:flex;align-items:center;gap:10px;margin-bottom:10px}
        .db-lot-rank{width:22px;height:22px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;font-family:'DM Mono',monospace;flex-shrink:0}
        .db-lot-name{font-size:12.5px;font-weight:700;color:${textPrimary};flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .db-lot-bar-wrap{flex:1.4;height:5px;background:${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"};border-radius:3px;overflow:hidden}
        .db-lot-bar{height:100%;border-radius:3px;transition:width .6s cubic-bezier(.22,1,.36,1)}
        .db-lot-fee{font-size:11px;font-weight:700;color:${isDark ? "rgba(255,255,255,0.5)" : "#64748b"};font-family:'DM Mono',monospace;white-space:nowrap}

        .theme-toggle-btn{
          width:36px;height:36px;border-radius:9px;border:1px solid ${borderColor};
          background:${isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)"};
          display:flex;align-items:center;justify-content:center;cursor:pointer;
          color:${isDark ? "rgba(148,163,184,0.6)" : "#64748b"};
          transition:all .15s;
        }
        .theme-toggle-btn:hover{background:${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)"};color:${textPrimary}}

        @media(max-width:1200px){.db-stats{grid-template-columns:repeat(2,1fr)}.db-cols-3-2,.db-cols-2-1,.db-cols-1-1,.db-cols-1-1-1{grid-template-columns:1fr}}
        @media(max-width:860px){.db-sidebar{display:none}.db-body{padding:16px}.db-topbar{padding:0 16px}.db-hero{flex-direction:column;gap:16px;align-items:flex-start}.db-hero-right{width:100%}.db-hero-kpi{flex:1;min-width:0}}
      `}</style>

      <div className="db-root">
        {/* ════════ SIDEBAR ════════ */}
        <aside className="db-sidebar">
          <div className="db-brand">
            <div className="db-brand-mark"><IcoCar size={18} color="white"/></div>
            <div>
              <div className="db-brand-name">ParkSense</div>
              <div className="db-brand-ver">SMART PARKING OS</div>
            </div>
          </div>

          <nav className="db-nav">
            <div className="db-nav-sect">Main</div>
            <NavItem icon={<IcoGrid/>}    label="Overview"     active={true} badge={totalBookings||undefined} onClick={()=>{}} theme={theme}/>
            <NavItem icon={<IcoHist/>}    label="History"      active={false} onClick={()=>onNavigate?.("history")} theme={theme}/>
            <NavItem icon={<IcoBook/>}    label="Book Parking" active={false} onClick={()=>onNavigate?.("booking")} theme={theme}/>
            <div className="db-nav-sect">Account</div>
            <NavItem icon={<IcoUser/>}    label="Profile"      active={false} onClick={()=>onNavigate?.("profile")} theme={theme}/>
          </nav>

          <div className="db-sidebar-foot">
            <div className="db-user-pill">
              <div className="db-user-av">
                {avatarUrl ? <img src={avatarUrl} alt="av"/> : initials}
              </div>
              <div style={{flex:1,overflow:"hidden"}}>
                <div className="db-user-name">{username}</div>
                <div className="db-user-role">DRIVER</div>
              </div>
              <button className="db-logout-sm" onClick={logout} title="Sign out"><IcoOut/></button>
            </div>
          </div>
        </aside>

        {/* ════════ MAIN ═══════════ */}
        <div className="db-main">
          {/* TOPBAR with Theme Toggle */}
          <header className="db-topbar">
            <div className="db-topbar-left">
              <div className="db-topbar-title">Dashboard</div>
              <div className="db-topbar-sub">Real-time parking analytics & insights</div>
            </div>
            <div className="db-clock">
              {time.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}
            </div>
            <button className="theme-toggle-btn" onClick={toggleTheme} title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}>
              {isDark ? <IcoSun/> : <IcoMoon/>}
            </button>
            <button className="db-notif-btn"><IcoNotif/><div className="db-notif-pip"/></button>
            <div className="db-topbar-av" onClick={()=>onNavigate?.("profile")}>
              {avatarUrl ? <img src={avatarUrl} alt="av"/> : initials}
            </div>
          </header>

          {/* ════════ BODY ════════ */}
          <main className="db-body">
            {error && <div className="db-err">⚠ {error}</div>}

            {/* HERO */}
            <div className="db-hero">
              <div className="db-hero-dots"/>
              <div className="db-hero-left">
                <div className="db-hero-tag"><div className="db-hero-tag-dot"/>LIVE MONITORING</div>
                <div className="db-hero-greeting">{greeting}</div>
                <div className="db-hero-name">{username} 👋</div>
                <div className="db-hero-sub">
                  {loading?"Loading analytics…":totalBookings===0?"No bookings yet — reserve your first spot to get started!"
                    :`${totalBookings} booking${totalBookings>1?"s":""} across ${lotMap.length} lot${lotMap.length!==1?"s":""} · ₹${totalSpent.toLocaleString()} total`}
                </div>
              </div>
              <div className="db-hero-right">
                {[["Bookings",totalBookings,""],[`₹${(totalSpent/100).toFixed(1)}k`,"Spent",""],[`${totalHours}h`,"Parked",""]].map(([v,l])=>(
                  <div key={l} className="db-hero-kpi">
                    <div className="db-hero-kpi-val">{loading?"—":v}</div>
                    <div className="db-hero-kpi-lbl">{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* STAT CARDS */}
            <div className="db-stats">
              <StatCard icon={<IcoCar size={18} color="#818cf8"/>} label="Total Bookings" value={totalBookings}
                gradient="linear-gradient(135deg,#6366f1,#818cf8)" glow="#818cf8" sub="All-time reservations" delay={60} suffix="" theme={theme}/>
              <StatCard icon={<IcoWallet/>} label="Total Spent" value={totalSpent}
                gradient="linear-gradient(135deg,#10b981,#34d399)" glow="#34d399" sub="Cumulative fees" prefix="₹" delay={120} theme={theme}/>
              <StatCard icon={<IcoTrend/>} label="Avg per Booking" value={avgFee}
                gradient="linear-gradient(135deg,#f97316,#fb923c)" glow="#fb923c" sub="Mean fee" prefix="₹" delay={180} theme={theme}/>
              <StatCard icon={<IcoClock/>} label="Hours Parked" value={totalHours}
                gradient="linear-gradient(135deg,#3b82f6,#60a5fa)" glow="#60a5fa" sub="Total duration" suffix="h" delay={240} theme={theme}/>
            </div>

            {/* ROW: Trend chart + Lot map */}
            <div className="db-row db-cols-3-2" style={{animationDelay:"0.2s"}}>
              <div className="db-card">
                <div className="db-card-hd">
                  <div>
                    <div className="db-card-title">Performance Trend</div>
                    <div className="db-card-sub">Fee & booking progression over time</div>
                  </div>
                  <div className="db-chip-row">
                    {["fee","bookings","hours"].map(m=>(
                      <button key={m} className={`db-chip${chartType===m?" on":""}`} onClick={()=>setChartType(m)}>
                        {m[0].toUpperCase()+m.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                {loading ? <div className="db-center"><IcoSpin/></div> : trendData.length===0 ? (
                  <div className="db-center" style={{color: isDark ? "rgba(148,163,184,0.4)" : "#94a3b8",fontSize:13}}>📈 Book more to see trends</div>
                ) : (
                  <ResponsiveContainer width="100%" height={210}>
                    <AreaChart data={trendData} margin={{top:4,right:4,left:-16,bottom:0}}>
                      <defs>
                        <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={chartType==="fee"?"#818cf8":chartType==="bookings"?"#34d399":"#60a5fa"} stopOpacity={isDark ? 0.28 : 0.12}/>
                          <stop offset="100%" stopColor={chartType==="fee"?"#818cf8":chartType==="bookings"?"#34d399":"#60a5fa"} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.06)"} vertical={false}/>
                      <XAxis dataKey="name" tick={{fontSize:10,fill: isDark ? "rgba(148,163,184,0.4)" : "#94a3b8",fontFamily:"'DM Mono',monospace"}} axisLine={false} tickLine={false}/>
                      <YAxis tick={{fontSize:10,fill: isDark ? "rgba(148,163,184,0.4)" : "#94a3b8",fontFamily:"'DM Mono',monospace"}} axisLine={false} tickLine={false}/>
                      <Tooltip content={<Tip theme={theme}/>}/>
                      <Area type="monotone" dataKey={chartType} name={chartType}
                        stroke={chartType==="fee"?"#818cf8":chartType==="bookings"?"#34d399":"#60a5fa"}
                        strokeWidth={2.5} fill="url(#ag)"
                        dot={{r:4,fill:chartType==="fee"?"#818cf8":chartType==="bookings"?"#34d399":"#60a5fa",stroke: isDark ? "rgba(10,13,26,.9)" : "white",strokeWidth:2}}
                        activeDot={{r:6,stroke: isDark ? "rgba(10,13,26,.9)" : "white",strokeWidth:2}}/>
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="db-card">
                <div className="db-card-hd">
                  <div>
                    <div className="db-card-title">Lot Occupancy Map</div>
                    <div className="db-card-sub">Live sensor data</div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:5,fontSize:10,color:"#34d399",fontFamily:"'DM Mono',monospace",fontWeight:700}}>
                    <div style={{width:5,height:5,borderRadius:"50%",background:"#34d399",animation:"db_pulse 2s ease infinite"}}/>LIVE
                  </div>
                </div>
                <LiveParkingMap history={history} theme={theme}/>
              </div>
            </div>

            {/* ROW: Lot Leaderboard */}
            <div className="db-row">
              <div className="db-card">
                <div className="db-card-hd">
                  <div>
                    <div className="db-card-title">Lot Leaderboard</div>
                    <div className="db-card-sub">Ranked by total spend</div>
                  </div>
                </div>
                {loading ? <div className="db-center"><IcoSpin/></div> : lotMap.length===0 ? (
                  <div className="db-center" style={{color: isDark ? "rgba(148,163,184,0.4)" : "#94a3b8",fontSize:13}}>No data yet</div>
                ) : (
                  [...lotMap].sort((a,b)=>b.fee-a.fee).slice(0,6).map((lot,i)=>{
                    const maxFee = Math.max(...lotMap.map(l=>l.fee));
                    const colors = ["#818cf8","#34d399","#fb923c","#60a5fa","#f472b6","#2dd4bf","#fbbf24","#a78bfa"];
                    const c = colors[i%colors.length];
                    return (
                      <div key={lot.lot} className="db-lot-row">
                        <div className="db-lot-rank" style={{background:`${c}15`,color:c}}>#{i+1}</div>
                        <div className="db-lot-name">{lot.lot}</div>
                        <div className="db-lot-bar-wrap">
                          <div className="db-lot-bar" style={{width:`${(lot.fee/maxFee)*100}%`,background:c}}/>
                        </div>
                        <div className="db-lot-fee">₹{lot.fee.toLocaleString()}</div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Quick Actions Row */}
            <div className="db-row db-cols-1-1-1">
              <div className="db-card">
                <div className="db-card-hd">
                  <div><div className="db-card-title">Quick Actions</div></div>
                </div>
                {[
                  {icon:<IcoBook/>,lbl:"Book Parking",sub:"Reserve a spot now",c:"#818cf8",bg: isDark ? "rgba(99,102,241,0.1)" : "rgba(79,70,229,0.08)",fn:()=>onNavigate?.("booking")},
                  {icon:<IcoHist/>,lbl:"View History", sub:"See all your bookings",  c:"#34d399",bg: isDark ? "rgba(16,185,129,0.1)" : "rgba(16,185,129,0.06)",fn:()=>onNavigate?.("history")},
                  {icon:<IcoUser/>,lbl:"My Profile",  sub:"Account settings",   c:"#fb923c",bg: isDark ? "rgba(249,115,22,0.1)" : "rgba(249,115,22,0.06)", fn:()=>onNavigate?.("profile")},
                ].map(a=>(
                  <button key={a.lbl} className="db-action-btn" onClick={a.fn}>
                    <div className="db-act-ico" style={{background:a.bg,color:a.c}}>{a.icon}</div>
                    <div style={{flex:1}}>
                      <div className="db-act-lbl">{a.lbl}</div>
                      <div className="db-act-sub">{a.sub}</div>
                    </div>
                    <IcoChev/>
                  </button>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}