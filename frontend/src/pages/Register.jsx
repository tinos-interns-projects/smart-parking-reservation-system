

import { useState } from "react";
import { registerUser } from "../api/api";

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
    style={{ animation: "rSpin 0.7s linear infinite", flexShrink: 0 }}>
    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)"/>
    <path d="M12 2a10 10 0 0110 10" stroke="white"/>
  </svg>
);
const CarSvg = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
  </svg>
);
const CheckMark = () => (
  <svg width="11" height="11" viewBox="0 0 12 12">
    <polyline points="2,6 5,9 10,3" stroke="white" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

function PasswordStrength({ password }) {
  const calc = () => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 6) s++;
    if (password.length >= 10) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return Math.min(s, 4);
  };
  const level = calc();
  const meta = [null,
    { label: "Weak",   color: "#ef4444", bg: "rgba(239,68,68,0.12)"   },
    { label: "Fair",   color: "#f97316", bg: "rgba(249,115,22,0.12)"  },
    { label: "Good",   color: "#3b82f6", bg: "rgba(59,130,246,0.12)"  },
    { label: "Strong", color: "#10b981", bg: "rgba(16,185,129,0.12)"  },
  ];
  if (!password) return null;
  const m = meta[level];
  return (
    <div style={{ marginTop: 9 }}>
      <div style={{ display: "flex", gap: 5, marginBottom: 6 }}>
        {[1,2,3,4].map(i => (
          <div key={i} style={{
            flex: 1, height: 4, borderRadius: 4,
            background: i <= level ? m.color : "#e8edf2",
            transition: "background 0.3s ease",
          }}/>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          background: m.bg, borderRadius: 20,
          padding: "2px 9px",
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: m.color, flexShrink: 0 }}/>
          <span style={{ fontSize: 11.5, fontWeight: 600, color: m.color, fontFamily: "'DM Mono', monospace", letterSpacing: "0.3px" }}>
            {m.label} password
          </span>
        </div>
      </div>
    </div>
  );
}

/* Left panel — inverted colour scheme vs Login (teal accent) */
function LeftPanel({ onNavigate }) {
  const perks = [
    { icon: "⚡", title: "Real-time availability", desc: "Live spot count updated every 5 seconds" },
    { icon: "📱", title: "Instant reservations",   desc: "Book a spot in under 10 seconds"          },
    { icon: "🔔", title: "Smart notifications",    desc: "Get alerted when your lot opens up"        },
    { icon: "📊", title: "Usage analytics",        desc: "Track your parking habits over time"       },
  ];
  return (
    <div className="rLeft">
      <div className="rDots"/>
      {/* Brand */}
      <div className="rBrand">
        <div className="rBrandIcon"><CarSvg/></div>
        <div>
          <div className="rBrandName">ParkSense</div>
          <div className="rBrandSub">SMART PARKING OS</div>
        </div>
      </div>

      {/* Mid content */}
      <div className="rMid">
        <div className="rTag"><div className="rTagDot"/>FREE FOREVER · NO CARD NEEDED</div>
        <h2 className="rH1">Everything you need<br/><em>to park smarter</em></h2>
        <p className="rDesc">Join thousands of drivers who save time and money with intelligent parking management.</p>

        {/* Perk cards */}
        <div className="rPerks">
          {perks.map((p, i) => (
            <div className="rPerk" key={p.title} style={{ animationDelay: `${0.08 * i}s` }}>
              <div className="rPerkIcon">{p.icon}</div>
              <div>
                <div className="rPerkTitle">{p.title}</div>
                <div className="rPerkDesc">{p.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="rStats">
        {[["2,400+","ACTIVE USERS"],["500+","LOTS MANAGED"],["98%","UPTIME SLA"]].map(([v,l],i,a) => (
          <>
            <div className="rStat" key={l}>
              <div className="rStatVal"><span>{v}</span></div>
              <div className="rStatLbl">{l}</div>
            </div>
            {i < a.length - 1 && <div className="rStatDiv" key={l+"d"}/>}
          </>
        ))}
      </div>
    </div>
  );
}

export default function Register({ onNavigate }) {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [agreed, setAgreed] = useState(false);

  const onChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setFieldErrors(fe => ({ ...fe, [e.target.name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.username.trim())          errs.username = "Username is required";
    if (!form.email.trim())             errs.email    = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                                        errs.email    = "Enter a valid email address";
    if (!form.password)                 errs.password = "Password is required";
    else if (form.password.length < 6)  errs.password = "Minimum 6 characters required";
    return errs;
  };

  const submit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }
    setLoading(true); setError("");
    try {
      const d = await registerUser(form.username, form.email, form.password);
      localStorage.setItem("parking_token", d.token);
      localStorage.setItem("parking_user", form.username);
      setSuccess("Account created! Redirecting you now…");
      setTimeout(() => onNavigate?.("dashboard"), 1200);
    } catch (e) {
      const data = e.response?.data;
      if (data && typeof data === "object") {
        const key = Object.keys(data)[0];
        const msg = Array.isArray(data[key]) ? data[key][0] : data[key];
        setError(msg || "Registration failed. Please try again.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally { setLoading(false); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=DM+Mono:wght@400;500&display=swap');
        @keyframes rSpin  { to { transform: rotate(360deg); } }
        @keyframes rUp    { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        @keyframes rFade  { from{opacity:0} to{opacity:1} }
        @keyframes rShake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-5px)} 40%,80%{transform:translateX(5px)} }
        @keyframes rPulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.15);opacity:0.6} }
        @keyframes rPerk  { from{opacity:0;transform:translateX(-10px)} to{opacity:1;transform:translateX(0)} }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; width: 100%; }

        .rRoot {
          display: flex; min-height: 100vh; width: 100%;
          font-family: 'Bricolage Grotesque', sans-serif;
          background: #f8fafc;
        }

        /* ── LEFT ── */
        .rLeft {
          width: 52%; min-height: 100vh;
          background: linear-gradient(155deg, #0c1f1a 0%, #0f2d24 55%, #0c1e30 100%);
          display: flex; flex-direction: column;
          padding: 40px 48px; position: relative; overflow: hidden;
        }
        .rLeft::before {
          content: ''; position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 70% 50% at 15% 10%, rgba(16,185,129,0.2) 0%, transparent 65%),
            radial-gradient(ellipse 55% 65% at 88% 88%, rgba(99,102,241,0.14) 0%, transparent 65%);
        }
        .rDots {
          position: absolute; inset: 0; pointer-events: none;
          background-image: radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: 26px 26px;
        }
        .rBrand {
          display: flex; align-items: center; gap: 11px;
          position: relative; z-index: 2;
          animation: rFade 0.6s ease both;
        }
        .rBrandIcon {
          width: 40px; height: 40px; border-radius: 11px;
          background: linear-gradient(135deg, #10b981, #059669);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 14px rgba(16,185,129,0.45); flex-shrink: 0;
        }
        .rBrandName { font-size: 17px; font-weight: 800; color: #fff; letter-spacing: -0.3px; }
        .rBrandSub  { font-size: 10.5px; color: rgba(255,255,255,0.38); font-family: 'DM Mono', monospace; letter-spacing: 0.6px; margin-top: 1px; }

        .rMid {
          flex: 1; display: flex; flex-direction: column; justify-content: center;
          padding: 28px 0; position: relative; z-index: 2;
          animation: rUp 0.6s 0.1s ease both;
        }
        .rTag {
          display: inline-flex; align-items: center; gap: 7px;
          background: rgba(16,185,129,0.14); border: 1px solid rgba(16,185,129,0.28);
          color: rgba(110,231,183,0.9); border-radius: 20px;
          padding: 5px 13px; font-size: 11px; font-weight: 600; letter-spacing: 0.5px;
          margin-bottom: 22px; font-family: 'DM Mono', monospace; width: fit-content;
        }
        .rTagDot {
          width: 6px; height: 6px; border-radius: 50%; background: #34d399;
          animation: rPulse 2.2s ease infinite;
        }
        .rH1 {
          font-size: 38px; font-weight: 800; color: #fff;
          line-height: 1.12; letter-spacing: -1.1px; margin-bottom: 14px;
        }
        .rH1 em {
          font-style: normal;
          background: linear-gradient(135deg, #6ee7b7 20%, #34d399 80%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .rDesc {
          font-size: 15px; color: rgba(255,255,255,0.46); line-height: 1.65;
          max-width: 340px; margin-bottom: 32px; font-weight: 400;
        }
        .rPerks { display: flex; flex-direction: column; gap: 12px; }
        .rPerk {
          display: flex; align-items: flex-start; gap: 14px;
          background: rgba(255,255,255,0.045); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px; padding: 14px 16px;
          animation: rPerk 0.4s ease both;
          transition: background 0.2s;
        }
        .rPerk:hover { background: rgba(255,255,255,0.07); }
        .rPerkIcon { font-size: 20px; flex-shrink: 0; margin-top: 1px; }
        .rPerkTitle { font-size: 14px; font-weight: 700; color: rgba(255,255,255,0.88); margin-bottom: 3px; }
        .rPerkDesc  { font-size: 12.5px; color: rgba(255,255,255,0.38); line-height: 1.45; }

        .rStats {
          display: flex; gap: 0; position: relative; z-index: 2;
          border-top: 1px solid rgba(255,255,255,0.08);
          padding-top: 26px; margin-top: 4px;
          animation: rFade 0.6s 0.25s ease both;
        }
        .rStat  { flex: 1; padding: 0 20px 0 0; }
        .rStat:first-child { padding-left: 0; }
        .rStatVal { font-size: 23px; font-weight: 800; letter-spacing: -0.6px; margin-bottom: 3px; }
        .rStatVal span {
          background: linear-gradient(135deg, #34d399, #10b981);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .rStatLbl { font-size: 10.5px; color: rgba(255,255,255,0.3); font-family: 'DM Mono', monospace; letter-spacing: 0.4px; }
        .rStatDiv { width: 1px; background: rgba(255,255,255,0.09); margin: 0 4px; align-self: stretch; }

        /* ── RIGHT ── */
        .rRight {
          flex: 1; display: flex; align-items: center; justify-content: center;
          padding: 40px 32px; min-height: 100vh; background: #f8fafc;
        }
        .rForm {
          width: 100%; max-width: 410px;
          animation: rUp 0.55s 0.06s cubic-bezier(0.22,1,0.36,1) both;
        }
        .rEye   { font-size: 11px; font-weight: 700; color: #10b981; letter-spacing: 1.3px; text-transform: uppercase; font-family: 'DM Mono', monospace; margin-bottom: 10px; }
        .rTitle { font-size: 31px; font-weight: 800; color: #0f172a; letter-spacing: -0.9px; line-height: 1.12; margin-bottom: 7px; }
        .rSub   { font-size: 14px; color: #94a3b8; font-weight: 400; line-height: 1.55; margin-bottom: 30px; }

        .rAlert { border-radius: 10px; padding: 12px 15px; font-size: 13.5px; font-weight: 500; line-height: 1.45; margin-bottom: 20px; display: flex; align-items: flex-start; gap: 10px; }
        .rErr   { background: #fff1f2; border: 1.5px solid #fecdd3; color: #be123c; animation: rShake 0.35s ease; }
        .rSuc   { background: #f0fdf4; border: 1.5px solid #bbf7d0; color: #166534; }

        .rFld     { margin-bottom: 17px; }
        .rLblRow  { display: flex; align-items: center; justify-content: space-between; margin-bottom: 7px; }
        .rLbl     { font-size: 13px; font-weight: 600; color: #1e293b; }
        .rInpWrap { position: relative; }
        .rInp {
          width: 100%; height: 50px; padding: 0 50px 0 16px;
          background: #fff; border: 1.5px solid #e2e8f0; border-radius: 12px;
          font-size: 15px; color: #0f172a; font-family: 'Bricolage Grotesque', sans-serif;
          outline: none; transition: border-color 0.18s, box-shadow 0.18s; -webkit-appearance: none;
        }
        .rInp::placeholder { color: #c4cdd9; }
        .rInp:hover  { border-color: #a7f3d0; }
        .rInp:focus  { border-color: #10b981; box-shadow: 0 0 0 4px rgba(16,185,129,0.1); }
        .rInpErr     { border-color: #f87171 !important; box-shadow: 0 0 0 4px rgba(248,113,113,0.1) !important; }
        .rFldErr     { font-size: 12.5px; color: #dc2626; font-weight: 500; margin-top: 6px; display: flex; align-items: center; gap: 5px; }
        .rToggle {
          position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer; color: #94a3b8;
          display: flex; align-items: center; padding: 4px; transition: color 0.15s;
        }
        .rToggle:hover { color: #475569; }

        /* Terms row */
        .rTermsRow  { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 22px; cursor: pointer; user-select: none; }
        .rBox       { width: 18px; height: 18px; border-radius: 5px; border: 2px solid #e2e8f0; background: #fff; display: flex; align-items: center; justify-content: center; transition: all 0.15s; flex-shrink: 0; margin-top: 1px; }
        .rBoxOn     { background: #10b981; border-color: #10b981; }
        .rTermsTxt  { font-size: 13px; color: #64748b; font-weight: 500; line-height: 1.5; }
        .rTermsLink { color: #10b981; font-weight: 600; cursor: pointer; }
        .rTermsLink:hover { text-decoration: underline; }

        .rBtn {
          width: 100%; height: 52px; border: none; border-radius: 13px;
          background: linear-gradient(135deg, #059669 0%, #10b981 100%);
          color: #fff; font-size: 15.5px; font-weight: 700;
          font-family: 'Bricolage Grotesque', sans-serif;
          cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 9px;
          box-shadow: 0 4px 20px rgba(16,185,129,0.42), inset 0 1px 0 rgba(255,255,255,0.15);
          transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
          letter-spacing: -0.1px; margin-bottom: 22px; position: relative; overflow: hidden;
        }
        .rBtn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(16,185,129,0.48), inset 0 1px 0 rgba(255,255,255,0.15); }
        .rBtn:active:not(:disabled){ transform: translateY(0); box-shadow: 0 2px 10px rgba(16,185,129,0.3); }
        .rBtn:disabled { opacity: 0.6; cursor: not-allowed; }

        .rDiv     { display: flex; align-items: center; gap: 12px; margin-bottom: 18px; }
        .rDivLine { flex: 1; height: 1px; background: #e8edf2; }
        .rDivTxt  { font-size: 12.5px; color: #94a3b8; white-space: nowrap; font-weight: 500; }

        .rLoginLink { text-align: center; font-size: 14px; color: #64748b; font-weight: 500; }
        .rLoginLink button { color: #10b981; font-weight: 700; background: none; border: none; cursor: pointer; font-size: 14px; font-family: 'Bricolage Grotesque', sans-serif; padding: 0; }
        .rLoginLink button:hover { text-decoration: underline; color: #059669; }

        .rTrust      { display: flex; align-items: center; justify-content: center; gap: 16px; margin-top: 28px; padding-top: 24px; border-top: 1px solid #e8edf2; flex-wrap: wrap; }
        .rTrustItem  { display: flex; align-items: center; gap: 5px; font-size: 11.5px; color: #94a3b8; font-weight: 500; }

        @media (max-width: 860px) { .rLeft { display: none; } .rRight { width: 100%; } }
      `}</style>

      <div className="rRoot">
        {/* ── LEFT PANEL ── */}
        <LeftPanel onNavigate={onNavigate}/>

        {/* ── RIGHT PANEL ── */}
        <div className="rRight">
          <div className="rForm">
            <div className="rEye">Get started free</div>
            <div className="rTitle">Create your<br/>account</div>
            <div className="rSub">Join thousands of smart parking users today.</div>

            {error   && <div className="rAlert rErr"><span>⚠</span><span>{error}</span></div>}
            {success && <div className="rAlert rSuc"><span>✓</span><span>{success}</span></div>}

            {/* Username */}
            <div className="rFld">
              <div className="rLblRow"><span className="rLbl">Username</span></div>
              <div className="rInpWrap">
                <input className={`rInp${fieldErrors.username ? " rInpErr" : ""}`}
                  type="text" name="username" placeholder="Choose a username"
                  value={form.username} onChange={onChange}
                  onKeyDown={e => e.key === "Enter" && submit()} autoComplete="username"/>
              </div>
              {fieldErrors.username && <div className="rFldErr">⚠ {fieldErrors.username}</div>}
            </div>

            {/* Email */}
            <div className="rFld">
              <div className="rLblRow"><span className="rLbl">Email address</span></div>
              <div className="rInpWrap">
                <input className={`rInp${fieldErrors.email ? " rInpErr" : ""}`}
                  type="email" name="email" placeholder="you@example.com"
                  value={form.email} onChange={onChange}
                  onKeyDown={e => e.key === "Enter" && submit()} autoComplete="email"/>
              </div>
              {fieldErrors.email && <div className="rFldErr">⚠ {fieldErrors.email}</div>}
            </div>

            {/* Password */}
            <div className="rFld">
              <div className="rLblRow"><span className="rLbl">Password</span></div>
              <div className="rInpWrap">
                <input className={`rInp${fieldErrors.password ? " rInpErr" : ""}`}
                  type={showPw ? "text" : "password"} name="password" placeholder="Min. 6 characters"
                  value={form.password} onChange={onChange}
                  onKeyDown={e => e.key === "Enter" && submit()} autoComplete="new-password"/>
                <button className="rToggle" type="button" onClick={() => setShowPw(!showPw)} tabIndex={-1}>
                  {showPw ? <EyeOn/> : <EyeOff/>}
                </button>
              </div>
              <PasswordStrength password={form.password}/>
              {fieldErrors.password && <div className="rFldErr" style={{marginTop:8}}>⚠ {fieldErrors.password}</div>}
            </div>

            {/* Terms */}
            <div className="rTermsRow" onClick={() => setAgreed(!agreed)}>
              <div className={`rBox${agreed ? " rBoxOn" : ""}`}>
                {agreed && <CheckMark/>}
              </div>
              <span className="rTermsTxt">
                I agree to the{" "}
                <span className="rTermsLink" onClick={e => e.stopPropagation()}>Terms of Service</span>
                {" "}and{" "}
                <span className="rTermsLink" onClick={e => e.stopPropagation()}>Privacy Policy</span>
              </span>
            </div>

            <button className="rBtn" onClick={submit} disabled={loading}>
              {loading ? <><Spin/>Creating account…</> : "Create Account →"}
            </button>

            <div className="rDiv">
              <div className="rDivLine"/>
              <span className="rDivTxt">Already have an account?</span>
              <div className="rDivLine"/>
            </div>

            <div className="rLoginLink">
              <button onClick={() => onNavigate?.("login")}>Sign in instead →</button>
            </div>

            <div className="rTrust">
              <div className="rTrustItem">🔒 SSL Encrypted</div>
              <div className="rTrustItem">✅ GDPR Compliant</div>
              <div className="rTrustItem">⚡ 99.9% Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}