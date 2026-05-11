
import { useState } from "react";
import { loginUser } from "../api/api";

const EyeOn = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const EyeOff = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);
const Spin = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeWidth="2.5"
    style={{ animation: "lSpin 0.7s linear infinite", flexShrink: 0 }}>
    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)"/>
    <path d="M12 2a10 10 0 0110 10" stroke="white"/>
  </svg>
);
const CarSvg = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
  </svg>
);

function ParkingViz() {
  const spots = [
    {x:50,y:72,occ:false,id:"A1"},{x:128,y:72,occ:true,id:"A2"},{x:206,y:72,occ:false,id:"A3"},{x:284,y:72,occ:true,id:"A4"},
    {x:50,y:168,occ:true,id:"B1"},{x:128,y:168,occ:false,id:"B2"},{x:206,y:168,occ:false,id:"B3"},{x:284,y:168,occ:true,id:"B4"},
    {x:50,y:264,occ:false,id:"C1"},{x:128,y:264,occ:true,id:"C2"},{x:206,y:264,occ:false,id:"C3"},{x:284,y:264,occ:false,id:"C4"},
  ];
  return (
    <svg viewBox="0 0 370 360" width="100%" style={{maxWidth:340,display:"block"}}>
      <rect x="28" y="48" width="316" height="282" rx="14" fill="#111827" opacity="0.97"/>
      <line x1="186" y1="60" x2="186" y2="322" stroke="white" strokeWidth="1.5" strokeDasharray="12,8" opacity="0.1"/>
      {[140,236].map(y=><line key={y} x1="28" y1={y} x2="344" y2={y} stroke="white" strokeWidth="1" strokeDasharray="12,8" opacity="0.09"/>)}
      {spots.map((s,i)=>(
        <g key={s.id} style={{animation:`sf 0.35s ${i*0.04}s both`}}>
          <rect x={s.x} y={s.y} width="58" height="76" rx="7"
            fill={s.occ?"rgba(239,68,68,0.1)":"rgba(52,211,153,0.1)"}
            stroke={s.occ?"rgba(239,68,68,0.45)":"rgba(52,211,153,0.45)"} strokeWidth="1.5"/>
          <text x={s.x+29} y={s.y+14} textAnchor="middle" fill="rgba(255,255,255,0.3)"
            fontSize="8.5" fontFamily="monospace">{s.id}</text>
          {s.occ?(
            <g>
              <rect x={s.x+6} y={s.y+20} width="46" height="44" rx="8" fill="#1f2937" stroke="rgba(239,68,68,0.5)" strokeWidth="1"/>
              <rect x={s.x+10} y={s.y+25} width="38" height="14" rx="3" fill="#374151"/>
              <rect x={s.x+12} y={s.y+27} width="15" height="10" rx="2" fill="rgba(148,163,184,0.4)"/>
              <rect x={s.x+31} y={s.y+27} width="15" height="10" rx="2" fill="rgba(148,163,184,0.4)"/>
              <circle cx={s.x+15} cy={s.y+59} r="5" fill="#111827" stroke="#4b5563" strokeWidth="1.5"/>
              <circle cx={s.x+43} cy={s.y+59} r="5" fill="#111827" stroke="#4b5563" strokeWidth="1.5"/>
              <rect x={s.x+9} y={s.y+51} width="8" height="4" rx="1" fill="rgba(251,191,36,0.7)"/>
              <rect x={s.x+41} y={s.y+51} width="8" height="4" rx="1" fill="rgba(239,68,68,0.8)"/>
            </g>
          ):(
            <g>
              <text x={s.x+29} y={s.y+50} textAnchor="middle" fill="rgba(52,211,153,0.55)" fontSize="18" fontFamily="monospace" fontWeight="700">P</text>
              <circle cx={s.x+29} cy={s.y+62} r="2.5" fill="rgba(52,211,153,0.4)"/>
            </g>
          )}
        </g>
      ))}
      <rect x="152" y="328" width="66" height="16" rx="4" fill="rgba(250,204,21,0.15)" stroke="rgba(250,204,21,0.4)" strokeWidth="1"/>
      <text x="185" y="340" textAnchor="middle" fill="rgba(250,204,21,0.7)" fontSize="8" fontFamily="monospace" fontWeight="700">ENTRANCE</text>
      <circle cx="336" cy="62" r="5" fill="#34d399"><animate attributeName="opacity" values="1;0.2;1" dur="1.8s" repeatCount="indefinite"/></circle>
      <text x="327" y="59" textAnchor="end" fill="rgba(52,211,153,0.6)" fontSize="8.5" fontFamily="monospace">LIVE</text>
      <text x="50" y="42" fill="rgba(255,255,255,0.2)" fontSize="9" fontFamily="monospace">ZONE A</text>
      <text x="50" y="160" fill="rgba(255,255,255,0.2)" fontSize="9" fontFamily="monospace">ZONE B</text>
      <text x="50" y="256" fill="rgba(255,255,255,0.2)" fontSize="9" fontFamily="monospace">ZONE C</text>
    </svg>
  );
}

export default function Login({ onNavigate }) {
  const [form, setForm] = useState({ username:"", password:"" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [checked, setChecked] = useState(false);

  const onChange = e => { setForm({...form,[e.target.name]:e.target.value}); setError(""); };

  const submit = async () => {
    if (!form.username.trim()||!form.password.trim()) { setError("Both fields are required."); return; }
    setLoading(true); setError("");
    try {
      const d = await loginUser(form.username, form.password);
      localStorage.setItem("parking_token", d.token);
      localStorage.setItem("parking_user", d.username||form.username);
      setSuccess(`Welcome back, ${d.username||form.username}!`);
      setTimeout(() => onNavigate?.("dashboard"), 1200);
    } catch(e) {
      setError(e.response?.data?.error||e.response?.data?.detail||"Invalid credentials. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=DM+Mono:wght@400;500&display=swap');
        @keyframes lSpin{to{transform:rotate(360deg)}}
        @keyframes sf{from{opacity:0;transform:scale(0.85)}to{opacity:1;transform:scale(1)}}
        @keyframes lUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
        @keyframes lFade{from{opacity:0}to{opacity:1}}
        @keyframes lShake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-5px)}40%,80%{transform:translateX(5px)}}
        @keyframes lPulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.15);opacity:0.6}}
        *{box-sizing:border-box;margin:0;padding:0}
        html,body{height:100%;width:100%}
        .lRoot{display:flex;min-height:100vh;width:100%;font-family:'Bricolage Grotesque',sans-serif;background:#f8fafc}
        /* LEFT */
        .lLeft{
          width:54%;min-height:100vh;
          background:linear-gradient(155deg,#0c1528 0%,#162035 55%,#0d1e3f 100%);
          display:flex;flex-direction:column;position:relative;overflow:hidden;
          padding:40px 48px 40px;
        }
        .lLeft::before{
          content:'';position:absolute;inset:0;pointer-events:none;
          background:radial-gradient(ellipse 70% 50% at 20% 15%,rgba(99,102,241,0.22) 0%,transparent 65%),
                     radial-gradient(ellipse 50% 70% at 85% 85%,rgba(16,185,129,0.12) 0%,transparent 65%);
        }
        .lDots{position:absolute;inset:0;pointer-events:none;background-image:radial-gradient(rgba(255,255,255,0.055) 1px,transparent 1px);background-size:26px 26px}
        .lBrand{display:flex;align-items:center;gap:11px;position:relative;z-index:2;animation:lFade .6s ease both}
        .lBrandIcon{width:40px;height:40px;border-radius:11px;background:linear-gradient(135deg,#6366f1,#8b5cf6);display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(99,102,241,0.45);flex-shrink:0}
        .lBrandName{font-size:17px;font-weight:800;color:#fff;letter-spacing:-.3px}
        .lBrandSub{font-size:10.5px;color:rgba(255,255,255,0.38);font-family:'DM Mono',monospace;letter-spacing:.6px;margin-top:1px}
        .lMid{flex:1;display:flex;flex-direction:column;justify-content:center;padding:28px 0;position:relative;z-index:2;animation:lUp .6s .1s ease both}
        .lTag{display:inline-flex;align-items:center;gap:7px;background:rgba(99,102,241,0.14);border:1px solid rgba(99,102,241,0.28);color:rgba(165,180,252,0.9);border-radius:20px;padding:5px 13px;font-size:11px;font-weight:600;letter-spacing:.5px;margin-bottom:22px;font-family:'DM Mono',monospace;width:fit-content}
        .lTagDot{width:6px;height:6px;border-radius:50%;background:#818cf8;animation:lPulse 2.2s ease infinite}
        .lH1{font-size:40px;font-weight:800;color:#fff;line-height:1.12;letter-spacing:-1.2px;margin-bottom:15px}
        .lH1 em{font-style:normal;background:linear-gradient(135deg,#a5f3fc 20%,#818cf8 80%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .lDesc{font-size:15px;color:rgba(255,255,255,0.48);line-height:1.65;max-width:340px;margin-bottom:34px;font-weight:400}
        .lViz{width:100%}
        .lStats{display:flex;gap:0;position:relative;z-index:2;animation:lFade .6s .25s ease both;border-top:1px solid rgba(255,255,255,0.08);padding-top:28px;margin-top:4px}
        .lStat{flex:1;padding:0 20px 0 0}
        .lStat:first-child{padding-left:0}
        .lStatVal{font-size:24px;font-weight:800;letter-spacing:-.6px;margin-bottom:3px}
        .lStatVal span{background:linear-gradient(135deg,#34d399,#6366f1);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .lStatLbl{font-size:10.5px;color:rgba(255,255,255,0.32);font-family:'DM Mono',monospace;letter-spacing:.4px}
        .lStatDiv{width:1px;background:rgba(255,255,255,0.09);margin:0 4px;align-self:stretch}
        /* RIGHT */
        .lRight{flex:1;display:flex;align-items:center;justify-content:center;padding:40px 32px;min-height:100vh;background:#f8fafc}
        .lForm{width:100%;max-width:400px;animation:lUp .55s .06s cubic-bezier(.22,1,.36,1) both}
        .lEye{font-size:11px;font-weight:700;color:#6366f1;letter-spacing:1.3px;text-transform:uppercase;font-family:'DM Mono',monospace;margin-bottom:10px}
        .lTitle{font-size:31px;font-weight:800;color:#0f172a;letter-spacing:-.9px;line-height:1.12;margin-bottom:7px}
        .lSub{font-size:14px;color:#94a3b8;font-weight:400;line-height:1.55;margin-bottom:32px}
        .lAlert{border-radius:10px;padding:12px 15px;font-size:13.5px;font-weight:500;line-height:1.45;margin-bottom:20px;display:flex;align-items:flex-start;gap:10px}
        .lErr{background:#fff1f2;border:1.5px solid #fecdd3;color:#be123c;animation:lShake .35s ease}
        .lSuc{background:#f0fdf4;border:1.5px solid #bbf7d0;color:#166534}
        .lFld{margin-bottom:18px}
        .lLblRow{display:flex;align-items:center;justify-content:space-between;margin-bottom:7px}
        .lLbl{font-size:13px;font-weight:600;color:#1e293b}
        .lForgot{font-size:13px;color:#6366f1;font-weight:600;background:none;border:none;cursor:pointer;font-family:'Bricolage Grotesque',sans-serif;padding:0}
        .lForgot:hover{text-decoration:underline;color:#4f46e5}
        .lInpWrap{position:relative}
        .lInp{width:100%;height:50px;padding:0 50px 0 16px;background:#fff;border:1.5px solid #e2e8f0;border-radius:12px;font-size:15px;color:#0f172a;font-family:'Bricolage Grotesque',sans-serif;outline:none;transition:border-color .18s,box-shadow .18s;-webkit-appearance:none}
        .lInp::placeholder{color:#c4cdd9}
        .lInp:hover{border-color:#c7d2fe}
        .lInp:focus{border-color:#6366f1;box-shadow:0 0 0 4px rgba(99,102,241,.1)}
        .lInpErr{border-color:#f87171!important;box-shadow:0 0 0 4px rgba(248,113,113,.1)!important}
        .lToggle{position:absolute;right:14px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:#94a3b8;display:flex;align-items:center;padding:4px;transition:color .15s}
        .lToggle:hover{color:#475569}
        .lRemRow{display:flex;align-items:center;justify-content:space-between;margin-bottom:22px}
        .lCheck{display:flex;align-items:center;gap:8px;cursor:pointer;user-select:none}
        .lBox{width:18px;height:18px;border-radius:5px;border:2px solid #e2e8f0;background:#fff;display:flex;align-items:center;justify-content:center;transition:all .15s;flex-shrink:0}
        .lBoxOn{background:#6366f1;border-color:#6366f1}
        .lCheckTxt{font-size:13.5px;color:#64748b;font-weight:500}
        .lBtn{width:100%;height:52px;border:none;border-radius:13px;background:linear-gradient(135deg,#5b5ef4 0%,#7c3aed 100%);color:#fff;font-size:15.5px;font-weight:700;font-family:'Bricolage Grotesque',sans-serif;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:9px;box-shadow:0 4px 20px rgba(99,102,241,.42),inset 0 1px 0 rgba(255,255,255,.15);transition:transform .15s,box-shadow .15s,opacity .15s;letter-spacing:-.1px;margin-bottom:22px;position:relative;overflow:hidden}
        .lBtn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 28px rgba(99,102,241,.48),inset 0 1px 0 rgba(255,255,255,.15)}
        .lBtn:active:not(:disabled){transform:translateY(0);box-shadow:0 2px 10px rgba(99,102,241,.3)}
        .lBtn:disabled{opacity:.6;cursor:not-allowed}
        .lDiv{display:flex;align-items:center;gap:12px;margin-bottom:18px}
        .lDivLine{flex:1;height:1px;background:#e8edf2}
        .lDivTxt{font-size:12.5px;color:#94a3b8;white-space:nowrap;font-weight:500}
        .lRegLink{text-align:center;font-size:14px;color:#64748b;font-weight:500}
        .lRegLink button{color:#6366f1;font-weight:700;background:none;border:none;cursor:pointer;font-size:14px;font-family:'Bricolage Grotesque',sans-serif;padding:0}
        .lRegLink button:hover{text-decoration:underline;color:#4f46e5}
        .lTrust{display:flex;align-items:center;justify-content:center;gap:16px;margin-top:28px;padding-top:24px;border-top:1px solid #e8edf2;flex-wrap:wrap}
        .lTrustItem{display:flex;align-items:center;gap:5px;font-size:11.5px;color:#94a3b8;font-weight:500}
        @media(max-width:860px){.lLeft{display:none}.lRight{width:100%}}
      `}</style>

      <div className="lRoot">
        {/* LEFT */}
        <div className="lLeft">
          <div className="lDots"/>
          <div className="lBrand">
            <div className="lBrandIcon"><CarSvg/></div>
            <div>
              <div className="lBrandName">ParkSense</div>
              <div className="lBrandSub">SMART PARKING OS</div>
            </div>
          </div>

          <div className="lMid">
            <div className="lTag"><div className="lTagDot"/>LIVE MONITORING ACTIVE</div>
            <h1 className="lH1">Park smarter,<br/><em>every time.</em></h1>
            <p className="lDesc">Real-time availability, instant reservations, and intelligent routing — unified in one platform.</p>
            <div className="lViz"><ParkingViz/></div>
          </div>

          <div className="lStats">
            <div className="lStat">
              <div className="lStatVal"><span>2,400+</span></div>
              <div className="lStatLbl">ACTIVE DRIVERS</div>
            </div>
            <div className="lStatDiv"/>
            <div className="lStat" style={{paddingLeft:20}}>
              <div className="lStatVal"><span>98%</span></div>
              <div className="lStatLbl">UPTIME SLA</div>
            </div>
            <div className="lStatDiv"/>
            <div className="lStat" style={{paddingLeft:20}}>
              <div className="lStatVal"><span>500+</span></div>
              <div className="lStatLbl">LOTS MANAGED</div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="lRight">
          <div className="lForm">
            <div className="lEye">Welcome back</div>
            <div className="lTitle">Sign in to your<br/>account</div>
            <div className="lSub">Manage your parking spaces and reservations.</div>

            {error && <div className="lAlert lErr"><span>⚠</span><span>{error}</span></div>}
            {success && <div className="lAlert lSuc"><span>✓</span><span>{success}</span></div>}

            <div className="lFld">
              <div className="lLblRow"><span className="lLbl">Username</span></div>
              <div className="lInpWrap">
                <input className={`lInp${error?" lInpErr":""}`} type="text" name="username"
                  placeholder="Enter your username" value={form.username}
                  onChange={onChange} onKeyDown={e=>e.key==="Enter"&&submit()} autoComplete="username"/>
              </div>
            </div>

            <div className="lFld">
              <div className="lLblRow">
                <span className="lLbl">Password</span>
                <button className="lForgot">Forgot password?</button>
              </div>
              <div className="lInpWrap">
                <input className={`lInp${error?" lInpErr":""}`} type={showPw?"text":"password"} name="password"
                  placeholder="••••••••••" value={form.password}
                  onChange={onChange} onKeyDown={e=>e.key==="Enter"&&submit()} autoComplete="current-password"/>
                <button className="lToggle" type="button" onClick={()=>setShowPw(!showPw)} tabIndex={-1}>
                  {showPw?<EyeOn/>:<EyeOff/>}
                </button>
              </div>
            </div>

            <div className="lRemRow">
              <div className="lCheck" onClick={()=>setChecked(!checked)}>
                <div className={`lBox${checked?" lBoxOn":""}`}>
                  {checked&&<svg width="10" height="10" viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3" stroke="white" strokeWidth="2.2" fill="none" strokeLinecap="round"/></svg>}
                </div>
                <span className="lCheckTxt">Remember me</span>
              </div>
            </div>

            <button className="lBtn" onClick={submit} disabled={loading}>
              {loading?<><Spin/>Signing in…</>:"Sign In →"}
            </button>

            <div className="lDiv">
              <div className="lDivLine"/><span className="lDivTxt">New to ParkSense?</span><div className="lDivLine"/>
            </div>

            <div className="lRegLink">
              <button onClick={()=>onNavigate?.("register")}>Create a free account →</button>
            </div>

            <div className="lTrust">
              <div className="lTrustItem">🔒 SSL Encrypted</div>
              <div className="lTrustItem">✅ GDPR Compliant</div>
              <div className="lTrustItem">⚡ 99.9% Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}