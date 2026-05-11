import { useState, useEffect, useRef } from "react";
import api from "../api/api";

/* ═══════════ TOAST ═══════════ */
function Toast({ message, type, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3500); return () => clearTimeout(t); }, []);
  return (
    <div style={{
      position:"fixed", bottom:28, left:"50%", transform:"translateX(-50%)",
      display:"flex", alignItems:"center", gap:10,
      padding:"13px 22px", borderRadius:14, zIndex:999,
      fontSize:14, fontWeight:600, fontFamily:"'Plus Jakarta Sans',sans-serif",
      boxShadow:"0 8px 32px rgba(0,0,0,0.18)", whiteSpace:"nowrap",
      animation:"pf_toast 3.5s ease forwards",
      background: type==="success" ? "#0f172a" : "#fff1f2",
      color: type==="success" ? "#fff" : "#be123c",
      border: type==="success" ? "1px solid rgba(255,255,255,0.1)" : "1.5px solid #fecdd3",
    }}>
      <span>{type==="success" ? "✓" : "⚠"}</span> {message}
    </div>
  );
}

/* ═══════════ EDIT MODAL ═══════════ */
function EditModal({ profile, form, onChange, onSave, onCancel, saving, error, avatarPreview, onAvatarChange, fileRef, avatarFile }) {
  return (
    <div style={{
      position:"fixed", inset:0, zIndex:200,
      background:"rgba(15,23,42,0.55)", backdropFilter:"blur(8px)",
      display:"flex", alignItems:"center", justifyContent:"center", padding:20,
      animation:"pf_fade .2s ease both",
    }} onClick={onCancel}>
      <div style={{
        background:"#fff", borderRadius:22, width:"100%", maxWidth:460,
        boxShadow:"0 24px 80px rgba(0,0,0,0.25)",
        animation:"pf_pop .35s cubic-bezier(.22,1,.36,1) both",
        overflow:"hidden",
      }} onClick={e=>e.stopPropagation()}>

        {/* Modal header */}
        <div style={{
          background:"linear-gradient(135deg,#f97316,#ec4899,#6366f1,#06b6d4)",
          height:70, position:"relative",
        }}>
          <button onClick={onCancel} style={{
            position:"absolute", top:12, right:12,
            width:32, height:32, borderRadius:"50%",
            background:"rgba(255,255,255,0.25)", border:"none", cursor:"pointer",
            color:"#fff", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center",
          }}>✕</button>
        </div>

        <div style={{ padding:"24px 28px 28px" }}>
          <div style={{ fontSize:18, fontWeight:800, color:"#0f172a", marginBottom:4 }}>Edit Profile</div>
          <div style={{ fontSize:13, color:"#94a3b8", marginBottom:24 }}>Update your personal information</div>

          {error && (
            <div style={{
              background:"#fff1f2", border:"1.5px solid #fecdd3", borderRadius:10,
              padding:"10px 14px", color:"#be123c", fontSize:13.5, fontWeight:500,
              marginBottom:16, display:"flex", gap:8, alignItems:"center",
            }}>⚠ {error}</div>
          )}

          {/* Avatar upload */}
          <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:20 }}>
            <div style={{
              width:60, height:60, borderRadius:"50%", overflow:"hidden", flexShrink:0,
              background:"linear-gradient(135deg,#6366f1,#818cf8)",
              display:"flex", alignItems:"center", justifyContent:"center",
              cursor:"pointer", border:"3px solid #e2e8f0",
            }} onClick={() => fileRef.current?.click()}>
              {avatarPreview
                ? <img src={avatarPreview} alt="avatar" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                : <span style={{fontSize:18,fontWeight:800,color:"white"}}>{profile.username?.slice(0,2).toUpperCase()}</span>}
            </div>
            <div>
              <button onClick={() => fileRef.current?.click()} style={{
                padding:"7px 14px", borderRadius:9, border:"1.5px solid #e2e8f0",
                background:"#fff", fontSize:13, fontWeight:600, color:"#374151",
                cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif", display:"block",
                marginBottom:4,
              }}>📷 Change Photo</button>
              <div style={{fontSize:11,color:"#94a3b8",fontFamily:"monospace"}}>
                {avatarFile ? `✓ ${avatarFile.name}` : "JPG, PNG · max 5MB"}
              </div>
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={onAvatarChange}/>

          {/* Fields */}
          {[
            { label:"Username", name:"username", value:profile.username||"", readOnly:true, icon:"👤" },
            { label:"Email Address", name:"email", value:form.email, readOnly:false, icon:"✉️", type:"email" },
            { label:"Phone Number", name:"phone", value:form.phone, readOnly:false, icon:"📱", type:"tel" },
          ].map(f => (
            <div key={f.name} style={{ marginBottom:14 }}>
              <label style={{ fontSize:12.5, fontWeight:600, color:"#475569", display:"block", marginBottom:6 }}>
                {f.icon} {f.label}
              </label>
              <input
                type={f.type||"text"} name={f.name} value={f.value}
                readOnly={f.readOnly} onChange={onChange}
                style={{
                  width:"100%", height:46, padding:"0 14px",
                  border:"1.5px solid", borderColor: f.readOnly ? "#f1f5f9" : "#e2e8f0",
                  borderRadius:11, fontSize:15, color: f.readOnly ? "#94a3b8" : "#0f172a",
                  background: f.readOnly ? "#f8fafc" : "#fff",
                  fontFamily:"'Plus Jakarta Sans',sans-serif", outline:"none",
                  transition:"border-color .18s, box-shadow .18s",
                }}
                onFocus={e => { if(!f.readOnly) { e.target.style.borderColor="#6366f1"; e.target.style.boxShadow="0 0 0 4px rgba(99,102,241,0.1)"; }}}
                onBlur={e => { e.target.style.borderColor=f.readOnly?"#f1f5f9":"#e2e8f0"; e.target.style.boxShadow="none"; }}
              />
            </div>
          ))}

          {/* Buttons */}
          <div style={{ display:"flex", gap:10, marginTop:20 }}>
            <button onClick={onSave} disabled={saving} style={{
              flex:1, height:48, borderRadius:12, border:"none",
              background:"linear-gradient(135deg,#5b5ef4,#7c3aed)",
              color:"#fff", fontSize:15, fontWeight:700,
              fontFamily:"'Plus Jakarta Sans',sans-serif", cursor:"pointer",
              boxShadow:"0 4px 14px rgba(99,102,241,0.4)",
              opacity: saving ? 0.65 : 1, display:"flex", alignItems:"center", justifyContent:"center", gap:8,
            }}>
              {saving ? "Saving…" : "✓ Save Changes"}
            </button>
            <button onClick={onCancel} style={{
              padding:"0 20px", height:48, borderRadius:12,
              border:"1.5px solid #e2e8f0", background:"#fff",
              fontSize:14, fontWeight:600, color:"#64748b",
              fontFamily:"'Plus Jakarta Sans',sans-serif", cursor:"pointer",
            }}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════ SKILL CHIP ═══════════ */
const SKILL_COLORS = [
  { bg:"#fff3e0", color:"#e65100" },
  { bg:"#e3f2fd", color:"#1565c0" },
  { bg:"#f3e5f5", color:"#6a1b9a" },
  { bg:"#e8f5e9", color:"#2e7d32" },
  { bg:"#fce4ec", color:"#880e4f" },
  { bg:"#e0f7fa", color:"#006064" },
];

/* ═══════════ ACTION CARD ═══════════ */
function ActionCard({ icon, title, desc, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        flex:1, background: hov ? "#f8fafc" : "#f9fafb",
        border:"1.5px solid", borderColor: hov ? "#e2e8f0" : "#f1f5f9",
        borderRadius:16, padding:"18px 16px 16px",
        cursor:"pointer", transition:"all .18s",
        transform: hov ? "translateY(-2px)" : "none",
        boxShadow: hov ? "0 4px 16px rgba(0,0,0,0.07)" : "none",
      }}
    >
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:8 }}>
        <div>
          <div style={{ fontSize:20, marginBottom:8 }}>{icon}</div>
          <div style={{ fontSize:14, fontWeight:800, color:"#0f172a", marginBottom:6 }}>{title}</div>
          <div style={{ fontSize:12.5, color:"#64748b", lineHeight:1.5, fontWeight:500 }}>{desc}</div>
        </div>
        <div style={{
          width:34, height:34, borderRadius:"50%", border:"1.5px solid #e2e8f0",
          display:"flex", alignItems:"center", justifyContent:"center",
          color:"#6366f1", flexShrink:0, marginTop:2,
          background: hov ? "#eef2ff" : "#fff", transition:"all .18s",
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ═══════════ MAIN PROFILE ═══════════ */
export default function Profile({ onNavigate, avatarUrl = "", onAvatarUpdate }) {
  const fileRef = useRef(null);

  const [profile, setProfile]         = useState({ username:"", email:"", phone:"", avatar:"" });
  const [form, setForm]               = useState({ email:"", phone:"" });
  const [avatarFile, setAvatarFile]   = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(avatarUrl);

  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [error, setError]       = useState("");
  const [toast, setToast]       = useState(null);

  const initials = profile.username
    ? profile.username.slice(0,2).toUpperCase()
    : (localStorage.getItem("parking_user")||"U").slice(0,2).toUpperCase();

  /* ── GET profile ── */
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await api.get("profile/");
        const d   = res.data;
        setProfile(d);
        setForm({ email: d.email||"", phone: d.phone||"" });
        const resolved = avatarUrl || d.avatar || "";
        if (resolved) setAvatarPreview(resolved);
      } catch (e) {
        setError(e.response?.data?.error || e.response?.data?.detail || "Failed to load profile.");
      } finally { setLoading(false); }
    })();
  }, []);

  /* ── field change ── */
  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  };

  /* ── avatar select ── */
  const handleAvatarChange = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("Please select a valid image."); return; }
    if (file.size > 5*1024*1024) { setError("Image must be under 5MB."); return; }
    setAvatarFile(file);
    setError("");
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
  };

  /* ── PUT profile ── */
  const handleSave = async () => {
    if (!form.email.trim()) { setError("Email is required."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setError("Enter a valid email."); return; }
    setSaving(true); setError("");
    try {
      let body, headers = {};
      if (avatarFile) {
        body = new FormData();
        body.append("email", form.email);
        body.append("phone", form.phone);
        body.append("avatar", avatarFile);
      } else {
        body = { email: form.email, phone: form.phone };
        headers["Content-Type"] = "application/json";
      }
      await api.put("profile/", body, { headers });
      setProfile(p => ({ ...p, email: form.email, phone: form.phone }));
      localStorage.setItem("parking_user", profile.username);
      if (avatarFile && avatarPreview) {
        onAvatarUpdate?.(avatarPreview);
        localStorage.setItem("parking_avatar", avatarPreview);
      }
      setAvatarFile(null);
      setEditMode(false);
      setToast({ message:"Profile updated successfully!", type:"success" });
    } catch (e) {
      const data = e.response?.data;
      if (data && typeof data === "object") {
        const key = Object.keys(data)[0];
        setError(Array.isArray(data[key]) ? data[key][0] : (data[key]||"Update failed."));
      } else { setError("Update failed. Please try again."); }
    } finally { setSaving(false); }
  };

  const handleCancel = () => {
    setForm({ email: profile.email||"", phone: profile.phone||"" });
    setAvatarFile(null);
    setAvatarPreview(avatarUrl || profile.avatar || "");
    setError(""); setEditMode(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("parking_token");
    localStorage.removeItem("parking_user");
    localStorage.removeItem("parking_avatar");
    onNavigate?.("login");
  };

  const skills = ["Smart Parking","AI Booking","QR Entry","Real-time","Analytics"];
  const avatarSrc = avatarPreview || null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes pf_fade { from{opacity:0} to{opacity:1} }
        @keyframes pf_up   { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pf_pop  { 0%{transform:scale(0.9);opacity:0} 60%{transform:scale(1.02)} 100%{transform:scale(1);opacity:1} }
        @keyframes pf_toast{ 0%{transform:translateX(-50%) translateY(80px);opacity:0} 15%{transform:translateX(-50%) translateY(0);opacity:1} 80%{transform:translateX(-50%) translateY(0);opacity:1} 100%{transform:translateX(-50%) translateY(80px);opacity:0} }
        @keyframes pf_skel { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        * { box-sizing:border-box; margin:0; padding:0; }
        html,body { min-height:100%; background:#eef2f7; }
        .pf-root { min-height:100vh; background:#eef2f7; font-family:'Plus Jakarta Sans',sans-serif; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:40px 20px; }
        .pf-card { width:100%; max-width:840px; background:#fff; border-radius:24px; overflow:hidden; box-shadow:0 4px 6px -1px rgba(0,0,0,0.06),0 20px 60px -10px rgba(0,0,0,0.12); animation:pf_up .5s ease both; }

        /* gradient banner */
        .pf-banner { height:160px; position:relative; background:linear-gradient(135deg,#f97316 0%,#ec4899 30%,#6366f1 60%,#06b6d4 85%,#10b981 100%); overflow:hidden; }
        .pf-banner-noise { position:absolute; inset:0; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.18'/%3E%3C/svg%3E"); opacity:.5; }
        .pf-edit-icon-btn { position:absolute; top:16px; right:16px; width:38px; height:38px; border-radius:50%; background:rgba(255,255,255,0.22); border:1.5px solid rgba(255,255,255,0.35); backdrop-filter:blur(8px); display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all .15s; color:#fff; }
        .pf-edit-icon-btn:hover { background:rgba(255,255,255,0.35); }

        /* body */
        .pf-body { padding:0 28px 28px; }

        /* avatar */
        .pf-avatar-wrap { margin-top:-52px; margin-bottom:14px; }
        .pf-avatar { width:100px; height:100px; border-radius:50%; border:4px solid #fff; overflow:hidden; background:linear-gradient(135deg,#6366f1,#818cf8); display:flex; align-items:center; justify-content:center; box-shadow:0 4px 16px rgba(0,0,0,0.12); cursor:pointer; position:relative; }
        .pf-avatar img { width:100%; height:100%; object-fit:cover; }
        .pf-avatar-initials { font-size:30px; font-weight:800; color:#fff; }
        .pf-avatar-cam-overlay { position:absolute; inset:0; border-radius:50%; background:rgba(0,0,0,0.4); display:flex; align-items:center; justify-content:center; opacity:0; transition:opacity .18s; }
        .pf-avatar:hover .pf-avatar-cam-overlay { opacity:1; }

        /* info row */
        .pf-info-row { display:grid; grid-template-columns:1fr auto; gap:16px; align-items:flex-start; margin-bottom:24px; }
        .pf-name { font-size:26px; font-weight:800; color:#0f172a; letter-spacing:-.6px; margin-bottom:4px; }
        .pf-role-text { font-size:14px; color:#64748b; font-weight:500; margin-bottom:3px; }
        .pf-location { font-size:14px; color:#94a3b8; font-weight:500; margin-bottom:16px; }
        .pf-btn-row { display:flex; gap:10px; flex-wrap:wrap; }
        .pf-btn-dark {
          padding:10px 22px; border-radius:50px; border:none;
          background:#0f172a; color:#fff; font-size:14px; font-weight:700;
          cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:all .15s;
        }
        .pf-btn-dark:hover { background:#1e293b; transform:translateY(-1px); }
        .pf-btn-outline {
          padding:10px 22px; border-radius:50px;
          border:1.5px solid #e2e8f0; background:#fff;
          color:#0f172a; font-size:14px; font-weight:700;
          cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:all .15s;
        }
        .pf-btn-outline:hover { border-color:#94a3b8; background:#f8fafc; }

        /* right side */
        .pf-right { display:flex; flex-direction:column; gap:12px; align-items:flex-end; }
        .pf-role-section { text-align:right; }
        .pf-section-label { font-size:12px; color:#94a3b8; font-weight:600; letter-spacing:.3px; margin-bottom:7px; display:flex; align-items:center; justify-content:flex-end; gap:5px; }
        .pf-role-badge { background:#f1f5f9; border-radius:50px; padding:8px 16px; font-size:13.5px; font-weight:700; color:#0f172a; border:1px solid #e2e8f0; }

        /* skills */
        .pf-skills-section { text-align:right; }
        .pf-skill-chips { display:flex; gap:8px; flex-wrap:wrap; justify-content:flex-end; }
        .pf-chip { padding:6px 14px; border-radius:50px; font-size:12.5px; font-weight:700; }

        /* divider */
        .pf-divider { height:1px; background:#f1f5f9; margin:0 0 20px; }

        /* action cards */
        .pf-actions { display:flex; gap:12px; }

        /* skeleton */
        .pf-skel { height:18px; background:linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%); background-size:200% 100%; animation:pf_skel 1.4s ease infinite; border-radius:8px; margin-bottom:12px; }

        /* topbar */
        .pf-topbar { width:100%; max-width:840px; display:flex; align-items:center; gap:12px; margin-bottom:20px; animation:pf_fade .4s ease both; }
        .pf-back { display:flex; align-items:center; gap:6px; padding:8px 14px; border-radius:10px; border:1.5px solid rgba(0,0,0,0.1); background:rgba(255,255,255,0.7); backdrop-filter:blur(8px); font-size:13px; font-weight:600; color:#374151; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:all .15s; }
        .pf-back:hover { background:#fff; border-color:#6366f1; color:#6366f1; }
        .pf-topbar-title { font-size:15px; font-weight:800; color:#0f172a; }
        .pf-logout-btn { margin-left:auto; display:flex; align-items:center; gap:6px; padding:8px 14px; border-radius:10px; border:1.5px solid rgba(239,68,68,0.2); background:rgba(255,255,255,0.7); font-size:13px; font-weight:600; color:#dc2626; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:all .15s; }
        .pf-logout-btn:hover { background:#fff5f5; border-color:#fca5a5; }

        /* email/phone pills */
        .pf-contact-pills { display:flex; gap:8px; margin-bottom:0; flex-wrap:wrap; }
        .pf-contact-pill { display:flex; align-items:center; gap:6px; padding:5px 12px; border-radius:20px; background:#f8fafc; border:1px solid #e8edf2; font-size:12.5px; color:#475569; font-weight:500; }

        @media(max-width:640px) {
          .pf-info-row { grid-template-columns:1fr; }
          .pf-right { align-items:flex-start; }
          .pf-skill-chips { justify-content:flex-start; }
          .pf-section-label { justify-content:flex-start; }
          .pf-actions { flex-direction:column; }
          .pf-topbar { padding:0 4px; }
        }
      `}</style>

      <div className="pf-root">
        {/* TOP BAR */}
        <div className="pf-topbar">
          <button className="pf-back" onClick={() => onNavigate?.("dashboard")}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
            Dashboard
          </button>
          <span className="pf-topbar-title">My Profile</span>
          <button className="pf-logout-btn" onClick={handleLogout}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Sign Out
          </button>
        </div>

        {/* CARD */}
        <div className="pf-card">

          {/* GRADIENT BANNER */}
          <div className="pf-banner">
            <div className="pf-banner-noise"/>
            {/* Edit pencil icon */}
            <button className="pf-edit-icon-btn" onClick={() => setEditMode(true)} title="Edit profile">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
          </div>

          {/* BODY */}
          <div className="pf-body">

            {loading ? (
              <div style={{ padding:"60px 0 20px" }}>
                {[80,60,100,60,80].map((w,i)=>
                  <div key={i} className="pf-skel" style={{width:`${w}%`,height:i===0?28:16}}/>
                )}
              </div>
            ) : (
              <>
                {/* AVATAR */}
                <div className="pf-avatar-wrap">
                  <div className="pf-avatar" onClick={() => setEditMode(true)}>
                    {avatarSrc
                      ? <img src={avatarSrc} alt={profile.username}/>
                      : <div className="pf-avatar-initials">{initials}</div>}
                    <div className="pf-avatar-cam-overlay">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                        <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
                        <circle cx="12" cy="13" r="4"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* INFO ROW */}
                <div className="pf-info-row">
                  <div>
                    <div className="pf-name">{profile.username || "—"}</div>
                    <div className="pf-role-text">Smart Parking User</div>
                    <div className="pf-location">
                      📍 {profile.phone ? `+91 ${profile.phone}` : "Location not set"}
                    </div>

                    {/* Contact pills */}
                    <div className="pf-contact-pills" style={{marginBottom:16}}>
                      {profile.email && (
                        <div className="pf-contact-pill">✉️ {profile.email}</div>
                      )}
                      {profile.phone && (
                        <div className="pf-contact-pill">📱 {profile.phone}</div>
                      )}
                    </div>

                    <div className="pf-btn-row">
                      <button className="pf-btn-dark" onClick={() => setEditMode(true)}>Edit Profile</button>
                      <button className="pf-btn-outline" onClick={() => onNavigate?.("booking")}>Book Parking</button>
                    </div>
                  </div>

                  {/* RIGHT: role + skills */}
                  <div className="pf-right">
                    <div className="pf-role-section">
                      <div className="pf-section-label">
                        Current role
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>
                      </div>
                      <div className="pf-role-badge">ParkSense Driver</div>
                    </div>

                    <div className="pf-skills-section">
                      <div className="pf-section-label">
                        Features
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                      </div>
                      <div className="pf-skill-chips">
                        {skills.map((s, i) => (
                          <div key={s} className="pf-chip" style={{
                            background: SKILL_COLORS[i % SKILL_COLORS.length].bg,
                            color: SKILL_COLORS[i % SKILL_COLORS.length].color,
                          }}>{s}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* DIVIDER */}
                <div className="pf-divider"/>

                {/* ACTION CARDS */}
                <div className="pf-actions">
                  <ActionCard
                    icon="🚗" title="Book Parking"
                    desc="Find and reserve available parking spots instantly."
                    onClick={() => onNavigate?.("booking")}
                  />
                  <ActionCard
                    icon="📋" title="View History"
                    desc="Check all your past bookings and QR codes."
                    onClick={() => onNavigate?.("history")}
                  />
                  <ActionCard
                    icon="✏️" title="Update Profile"
                    desc="Keep your info updated for a better experience."
                    onClick={() => setEditMode(true)}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      {editMode && (
        <EditModal
          profile={profile} form={form}
          onChange={handleChange}
          onSave={handleSave} onCancel={handleCancel}
          saving={saving} error={error}
          avatarPreview={avatarPreview}
          onAvatarChange={handleAvatarChange}
          fileRef={fileRef} avatarFile={avatarFile}
        />
      )}

      {/* TOAST */}
      {toast && <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)}/>}
    </>
  );
}