// src/pages/Booking.jsx - Complete Updated Booking Page with 4 Lots (Zone A Closed)
import React, { useState, useEffect } from "react";
import { predictFee, bookParking, getRecommendedSlot } from "../api/api";

/* ═══════════════════ ICONS ═══════════════════ */
const IcoBack = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);
const IcoCarSolid = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
  </svg>
);
const IcoBot = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="10" rx="2"/>
    <path d="M12 11V7"/><circle cx="12" cy="5" r="2"/>
    <line x1="8" y1="15" x2="8" y2="15" strokeWidth="2.5"/>
    <line x1="12" y1="15" x2="12" y2="15" strokeWidth="2.5"/>
    <line x1="16" y1="15" x2="16" y2="15" strokeWidth="2.5"/>
  </svg>
);
const IcoRecommend = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z"/>
  </svg>
);
const IcoCheck = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IcoClock = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const IcoMap = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const IcoDownload = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);
const IcoWifi = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M5 12.55a11 11 0 0114.08 0"/><path d="M1.42 9a16 16 0 0121.16 0"/>
    <path d="M8.53 16.11a6 6 0 016.95 0"/><line x1="12" y1="20" x2="12.01" y2="20" strokeWidth="3"/>
  </svg>
);
const IcoStar = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const IcoSpark = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M12 2L15 9H22L16 14L18 21L12 16.5L6 21L8 14L2 9H9L12 2Z"/>
  </svg>
);
const IcoMapMarker = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);
const IcoWarning = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const Spinner = ({ size = 17, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth="2.5"
    style={{ animation: "bk_spin 0.7s linear infinite", flexShrink: 0 }}>
    <circle cx="12" cy="12" r="10" stroke={color === "#fff" ? "rgba(255,255,255,0.25)" : "rgba(99,102,241,0.2)"}/>
    <path d="M12 2a10 10 0 0110 10" stroke={color}/>
  </svg>
);

/* ═══════════════════ LOT CONFIG ═══════════════════ */
const LOTS = {
  1: {
    id: 1,
    name: "Flexi Pass",
    zone: "Zone A — Business Suite",
    slots: 20,
    // All slots occupied = closed
    occupied: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
    closed: true,   // ← ZONE A CLOSED
    color: "#6366f1",
    rate: 120,
    spec: "⚠ Zone A is temporarily closed for maintenance. Please select another zone.",
  },
  2: {
    id: 2,
    name: "Executive Reserve",
    zone: "Zone B — Express Bay",
    slots: 20,
    occupied: [1, 3, 6, 9, 12, 15, 18],
    closed: false,
    color: "#10b981",
    rate: 90,
    spec: "Standard 2.5m spacing, Level 2 AC Charging (22kW), CCTV monitored.",
  },
  3: {
    id: 3,
    name: "Prime Access",
    zone: "Zone C — Premium Access",
    slots: 20,
    occupied: [4, 7, 10, 13, 16, 19, 20],
    closed: false,
    color: "#f97316",
    rate: 150,
    spec: "VIP 3.8m spacing, Valet available, Climate-controlled bay, 24/7 security.",
  },
  4: {
    id: 4,
    name: "Smart Saver",
    zone: "Zone D — Eco Friendly",
    slots: 20,
    occupied: [3, 8, 12, 15, 18],
    closed: false,
    color: "#14b8a6",
    rate: 80,
    spec: "Eco-friendly zone, Solar-powered lighting, EV charging stations, Green certified.",
  },
};

/* ═══════════════════ SLOT GRID ═══════════════════ */
function SlotGrid({ lotId, selected, onSelect, color }) {
  const lot = LOTS[lotId];
  if (!lot) return null;

  // If lot is closed, show a closed banner instead of grid
  if (lot.closed) {
    return (
      <div style={{
        background: "linear-gradient(135deg,#fff1f2,#fef2f2)",
        border: "1.5px dashed #fca5a5",
        borderRadius: 14,
        padding: "28px 20px",
        textAlign: "center",
        marginBottom: 14,
      }}>
        <div style={{ fontSize: 36, marginBottom: 10 }}>🚧</div>
        <div style={{ fontWeight: 800, fontSize: 16, color: "#b91c1c", marginBottom: 6 }}>Zone A Closed</div>
        <div style={{ fontSize: 13, color: "#ef4444", fontWeight: 500 }}>
          This zone is temporarily closed for maintenance.<br/>Please choose Zone B, C, or D.
        </div>
      </div>
    );
  }

  const slots = Array.from({ length: lot.slots }, (_, i) => i + 1);
  const prefix = lot.name.split(" ")[1]?.[0] || "S";

  return (
    <div className="sg-root">
      <div className="sg-legend">
        <div className="sg-legend-item">
          <div className="sg-dot" style={{ background: "#e2e8f0" }}/> Occupied
        </div>
        <div className="sg-legend-item">
          <div className="sg-dot" style={{ background: "#d1fae5" }}/> Available
        </div>
        <div className="sg-legend-item">
          <div className="sg-dot" style={{ background: color }}/> Selected
        </div>
      </div>

      <div className="sg-grid">
        {slots.map(n => {
          const isOcc = lot.occupied.includes(n);
          const isSel = selected === n;
          const label = `${prefix}${String(n).padStart(2, "0")}`;
          return (
            <button
              key={n}
              className={`sg-slot${isOcc ? " sg-occ" : " sg-avail"}${isSel ? " sg-sel" : ""}`}
              style={isSel ? { "--sc": color, borderColor: color, background: color + "18" } : {}}
              disabled={isOcc}
              onClick={() => !isOcc && onSelect(isSel ? null : n)}
              title={isOcc ? `${label} — Occupied` : `${label} — Available`}
            >
              <span className="sg-slot-label">{label}</span>
              {isSel && <div className="sg-sel-dot" style={{ background: color }}/>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════ LOT TABS ═══════════════════ */
function LotTabs({ active, onChange }) {
  return (
    <div className="lt-wrap">
      {Object.entries(LOTS).map(([id, l]) => (
        <button
          key={id}
          className={`lt-btn${Number(id) === active ? " lt-active" : ""}${l.closed ? " lt-closed" : ""}`}
          style={Number(id) === active ? { "--tc": l.color } : {}}
          disabled={l.closed}
          onClick={() => onChange(Number(id))}
          title={l.closed ? "Zone A is temporarily closed" : l.zone}
        >
          <span className="lt-name">
            {l.name}
            {l.closed && <span className="lt-closed-tag">CLOSED</span>}
          </span>
          <span className="lt-zone">{l.zone.split("—")[0].trim()}</span>
        </button>
      ))}
    </div>
  );
}

/* ═══════════════════ MAIN BOOKING PAGE ═══════════════════ */
export default function Booking({ onNavigate, avatarUrl = "", preSelectedLotId, preSelectedSlotNumber }) {
  const username = localStorage.getItem("parking_user") || "U";
  const initials = username.charAt(0).toUpperCase();

  // Default to lot 2 (Zone B) since Zone A is closed
  const defaultLot = preSelectedLotId && !LOTS[preSelectedLotId]?.closed ? preSelectedLotId : 2;

  const [lotId, setLotId] = useState(defaultLot);
  const [slotNumber, setSlotNumber] = useState(preSelectedSlotNumber || null);
  const [duration, setDuration] = useState("");

  const [predictedFee, setPredictedFee] = useState(null);
  const [predicting, setPredicting] = useState(false);
  const [booking, setBooking] = useState(false);
  const [qr, setQr] = useState("");
  const [bookingId, setBookingId] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [recommendedSlot, setRecommendedSlot] = useState(null);
  const [availableCount, setAvailableCount] = useState(null);
  const [recommendLoading, setRecommendLoading] = useState(false);
  const [recommendError, setRecommendError] = useState("");

  const lot = LOTS[lotId];

  useEffect(() => {
    setPredictedFee(null);
    setError("");
  }, [lotId, duration, slotNumber]);

  useEffect(() => {
    if (preSelectedSlotNumber && preSelectedLotId) setError("");
  }, [preSelectedSlotNumber, preSelectedLotId]);

  const validate = () => {
    if (!slotNumber) { setError("Please select a parking slot from the grid."); return false; }
    if (!duration || Number(duration) < 1 || Number(duration) > 24) {
      setError("Please enter a valid duration between 1 and 24 hours."); return false;
    }
    return true;
  };

  const handleRecommendSlot = async () => {
    if (!lotId) { setRecommendError("Please select a parking lot first"); return; }
    setRecommendLoading(true); setRecommendError(""); setRecommendedSlot(null); setAvailableCount(null);
    try {
      const data = await getRecommendedSlot(lotId);
      setRecommendedSlot(data.recommended_slot);
      setAvailableCount(data.available_count);
      setSlotNumber(data.recommended_slot);
    } catch (err) {
      setRecommendError(err.response?.data?.error || err.response?.data?.detail || "Failed to get slot recommendation. Please try again.");
    } finally { setRecommendLoading(false); }
  };

  const handlePredict = async () => {
    if (!validate()) return;
    setPredicting(true); setError(""); setPredictedFee(null);
    try {
      const data = await predictFee(duration, lotId);
      setPredictedFee(data.predicted_fee);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.detail || "Fee prediction failed. Please try again.");
    } finally { setPredicting(false); }
  };

  const handleBooking = async () => {
    if (!validate()) return;
    if (predictedFee === null) { setError("Please calculate the fee before booking."); return; }
    setBooking(true); setError("");
    try {
      const data = await bookParking(duration, lotId, slotNumber);
      setQr(data.qr_code || ""); setBookingId(data.booking_id); setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.detail || "Booking failed. Please try again.");
    } finally { setBooking(false); }
  };

  const downloadQR = () => {
    if (!qr) return;
    const link = document.createElement("a");
    link.href = `data:image/png;base64,${qr}`;
    link.download = `ParkSense_QR_${bookingId || "booking"}.png`;
    link.click();
  };

  const handleReset = () => {
    setLotId(2); setSlotNumber(null); setDuration("");
    setPredictedFee(null); setQr(""); setBookingId(null);
    setSuccess(false); setError(""); setRecommendedSlot(null);
    setAvailableCount(null); setRecommendError("");
  };

  const lotPrefix = lot.name.split(" ")[1]?.[0] || "S";
  const slotLabel = slotNumber ? `${lotPrefix}${String(slotNumber).padStart(2, "0")}` : null;
  const estimatedFee = duration ? lot.rate * Number(duration) : 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');

        @keyframes bk_spin { to { transform: rotate(360deg); } }
        @keyframes bk_up { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes bk_pop { 0%{transform:scale(0.88);opacity:0} 60%{transform:scale(1.03)} 100%{transform:scale(1);opacity:1} }
        @keyframes bk_qrin { 0%{transform:scale(0.75) rotate(-4deg);opacity:0} 70%{transform:scale(1.04) rotate(1deg)} 100%{transform:scale(1) rotate(0deg);opacity:1} }
        @keyframes bk_success { 0%{transform:scale(0);opacity:0} 60%{transform:scale(1.18)} 100%{transform:scale(1);opacity:1} }
        @keyframes bk_live { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(1.3)} }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { min-height: 100%; background: #f1f5f9; }

        .bk-root { min-height: 100vh; background: #f1f5f9; font-family: 'Plus Jakarta Sans', sans-serif; }

        .bk-topbar {
          height: 62px; background: #fff; border-bottom: 1px solid #e8edf2;
          display: flex; align-items: center; padding: 0 32px; gap: 14px;
          position: sticky; top: 0; z-index: 100;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        }
        .bk-back {
          display: flex; align-items: center; gap: 6px; padding: 7px 13px;
          border-radius: 9px; border: 1.5px solid #e2e8f0; background: #fff;
          font-size: 13px; font-weight: 600; color: #64748b;
          cursor: pointer; transition: all 0.15s;
        }
        .bk-back:hover { border-color: #c7d2fe; color: #6366f1; background: #f5f3ff; }
        .bk-topbar-logo {
          width: 34px; height: 34px; border-radius: 9px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 3px 10px rgba(99,102,241,0.35);
        }
        .bk-topbar-name { font-size: 15px; font-weight: 800; color: #0f172a; letter-spacing: -0.3px; }
        .bk-topbar-sub { font-size: 10px; color: #94a3b8; font-family: 'DM Mono', monospace; letter-spacing: 0.5px; }
        .bk-avatar {
          width: 34px; height: 34px; border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          display: flex; align-items: center; justify-content: center;
          color: white; font-size: 12px; font-weight: 800; margin-left: auto; cursor: pointer;
        }

        .bk-breadcrumb {
          display: flex; align-items: center; gap: 8px;
          font-size: 11.5px; font-family: 'DM Mono', monospace;
          color: #94a3b8; padding: 18px 32px 0; font-weight: 500;
        }
        .bk-breadcrumb span { color: #6366f1; font-weight: 700; }
        .bk-breadcrumb-sep { color: #cbd5e1; }

        .bk-body { padding: 20px 32px 40px; max-width: 1200px; margin: 0 auto; }
        .bk-grid { display: grid; grid-template-columns: 1fr 360px; gap: 24px; align-items: start; }
        @media(max-width:960px) { .bk-grid { grid-template-columns: 1fr; } }

        .bk-heading { margin-bottom: 22px; animation: bk_up 0.4s ease both; }
        .bk-heading-title { font-size: 27px; font-weight: 800; color: #0f172a; letter-spacing: -0.8px; margin-bottom: 5px; }
        .bk-heading-sub { font-size: 14px; color: #64748b; font-weight: 500; max-width: 480px; line-height: 1.55; }

        /* Zone A closed notice banner */
        .bk-zone-closed-notice {
          display: flex; align-items: flex-start; gap: 12px;
          background: linear-gradient(135deg, #fff1f2, #fef2f2);
          border: 1.5px solid #fca5a5; border-radius: 14px;
          padding: 14px 18px; margin-bottom: 18px;
          animation: bk_up 0.4s ease both;
        }
        .bk-zone-closed-notice-icon {
          width: 36px; height: 36px; border-radius: 10px;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          display: flex; align-items: center; justify-content: center;
          color: #fff; flex-shrink: 0;
        }
        .bk-zone-closed-notice-title { font-size: 14px; font-weight: 800; color: #b91c1c; margin-bottom: 3px; }
        .bk-zone-closed-notice-sub { font-size: 12.5px; color: #ef4444; font-weight: 500; line-height: 1.5; }

        .bk-card {
          background: #fff; border-radius: 18px; padding: 24px;
          border: 1px solid #e8edf2;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 6px 20px rgba(0,0,0,0.04);
          margin-bottom: 18px; animation: bk_up 0.45s ease both;
        }
        .bk-card:last-child { margin-bottom: 0; }
        .bk-card-hd { display: flex; align-items: center; justify-content: space-between; margin-bottom: 5px; }
        .bk-card-title { font-size: 16px; font-weight: 800; color: #0f172a; letter-spacing: -0.3px; display: flex; align-items: center; gap: 8px; }
        .bk-card-sub { font-size: 13px; color: #94a3b8; margin-bottom: 20px; font-weight: 500; }

        .bk-recommend-card {
          background: linear-gradient(135deg, #f5f3ff, #ede9fe);
          border: 1.5px solid #c4b5fd;
        }
        .rec-result {
          background: white; border-radius: 14px; padding: 16px 20px;
          margin-top: 16px; animation: bk_pop 0.4s ease both; border: 1px solid #e8edf2;
        }
        .rec-slot-badge {
          display: inline-flex; align-items: baseline; gap: 6px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          padding: 8px 20px; border-radius: 60px; color: white; margin-bottom: 12px;
        }
        .rec-slot-number { font-size: 28px; font-weight: 800; letter-spacing: -0.5px; }
        .rec-slot-label { font-size: 12px; font-weight: 600; opacity: 0.85; }
        .rec-stats { display: flex; gap: 24px; margin-top: 12px; padding-top: 12px; border-top: 1px solid #e8edf2; }
        .rec-stat { flex: 1; }
        .rec-stat-value { font-size: 20px; font-weight: 800; color: #0f172a; }
        .rec-stat-label { font-size: 10px; color: #94a3b8; font-family: 'DM Mono', monospace; letter-spacing: 0.3px; }
        .rec-badge {
          display: inline-flex; align-items: center; gap: 5px;
          background: #6366f1; color: white; font-size: 10px; font-weight: 700;
          padding: 3px 8px; border-radius: 20px; font-family: 'DM Mono', monospace;
        }

        /* Lot tabs */
        .lt-wrap { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
        .lt-btn {
          display: flex; flex-direction: column; align-items: flex-start;
          padding: 10px 16px; border-radius: 12px; border: 1.5px solid #e2e8f0;
          background: #fafafa; cursor: pointer; transition: all 0.18s; text-align: left;
          min-width: 130px;
        }
        .lt-btn:hover:not(:disabled) { border-color: #c7d2fe; background: #f5f3ff; }
        .lt-active {
          border-color: var(--tc) !important;
          background: color-mix(in srgb, var(--tc) 8%, white) !important;
          box-shadow: 0 3px 12px color-mix(in srgb, var(--tc) 18%, transparent) !important;
        }
        /* ── CLOSED TAB STYLES ── */
        .lt-closed {
          opacity: 0.45;
          cursor: not-allowed !important;
          filter: grayscale(0.6);
        }
        .lt-closed-tag {
          display: inline-block;
          font-size: 9px; font-weight: 800; letter-spacing: 0.8px;
          background: #fef2f2; color: #ef4444;
          border: 1px solid #fecaca; border-radius: 4px;
          padding: 1px 5px; margin-left: 6px; vertical-align: middle;
        }
        .lt-name { font-size: 13px; font-weight: 800; color: #0f172a; margin-bottom: 2px; }
        .lt-zone { font-size: 11px; color: #94a3b8; font-family: 'DM Mono', monospace; letter-spacing: 0.2px; }

        .bk-sensor-bar {
          display: flex; align-items: center; gap: 10px;
          background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px;
          padding: 9px 14px; margin-bottom: 16px; font-size: 12px;
          font-family: 'DM Mono', monospace; font-weight: 600; color: #475569;
        }
        .bk-live-dot { width: 8px; height: 8px; border-radius: 50%; background: #10b981; animation: bk_live 1.8s ease infinite; }
        .bk-sensor-right { margin-left: auto; display: flex; gap: 14px; }
        .bk-sensor-item { display: flex; align-items: center; gap: 5px; font-size: 11.5px; }
        .bk-sensor-dot { width: 10px; height: 10px; border-radius: 2px; }

        .sg-legend { display: flex; gap: 16px; margin-bottom: 14px; flex-wrap: wrap; }
        .sg-legend-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #64748b; font-weight: 600; }
        .sg-dot { width: 12px; height: 12px; border-radius: 3px; }
        .sg-grid { display: grid; grid-template-columns: repeat(10, 1fr); gap: 7px; margin-bottom: 14px; }
        @media(max-width:600px) { .sg-grid { grid-template-columns: repeat(5, 1fr); } }
        .sg-slot {
          aspect-ratio: 1; border-radius: 9px; border: 1.5px solid #e2e8f0;
          background: #f8fafc; cursor: pointer; transition: all 0.16s;
          display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative;
        }
        .sg-slot:hover:not(:disabled):not(.sg-sel) { border-color: #a5b4fc; background: #eef2ff; transform: translateY(-1px); }
        .sg-avail { background: #f0fdf4; border-color: #bbf7d0; }
        .sg-occ { background: #f1f5f9; border-color: #e2e8f0; cursor: not-allowed; opacity: 0.55; }
        .sg-sel { border-color: var(--sc) !important; box-shadow: 0 0 0 3px color-mix(in srgb, var(--sc) 18%, transparent); transform: translateY(-2px) scale(1.05); }
        .sg-slot-label { font-size: 9.5px; font-weight: 700; color: #475569; font-family: 'DM Mono', monospace; }
        .sg-sel-dot { position: absolute; top: 4px; right: 4px; width: 5px; height: 5px; border-radius: 50%; }

        .bk-dur-row { display: flex; align-items: center; gap: 12px; }
        .bk-dur-input {
          flex: 1; height: 48px; padding: 0 16px; border: 1.5px solid #e2e8f0; border-radius: 12px;
          font-size: 16px; font-weight: 700; color: #0f172a; background: #fafafa;
          outline: none; transition: all 0.18s;
        }
        .bk-dur-input:focus { border-color: #6366f1; background: #fff; box-shadow: 0 0 0 4px rgba(99,102,241,0.1); }
        .bk-dur-input.bk-inp-err { border-color: #f87171; box-shadow: 0 0 0 4px rgba(248,113,113,0.1); }
        .bk-dur-hint { font-size: 12px; color: #94a3b8; font-family: 'DM Mono', monospace; margin-top: 6px; }
        .bk-dur-stepper { display: flex; flex-direction: column; gap: 4px; }
        .bk-step-btn {
          width: 34px; height: 21px; border: 1.5px solid #e2e8f0; border-radius: 7px;
          background: #f8fafc; cursor: pointer; font-size: 14px; color: #64748b; transition: all 0.15s; font-weight: 700;
        }
        .bk-step-btn:hover { border-color: #6366f1; color: #6366f1; background: #eef2ff; }

        .bk-alert { border-radius: 11px; padding: 12px 15px; font-size: 13.5px; font-weight: 500; margin-bottom: 16px; display: flex; align-items: flex-start; gap: 9px; }
        .bk-err { background: #fff1f2; border: 1.5px solid #fecdd3; color: #be123c; }
        .bk-suc { background: #f0fdf4; border: 1.5px solid #bbf7d0; color: #166534; }

        .bk-btn-predict {
          width: 100%; height: 48px; border: 1.5px solid #c4b5fd; border-radius: 12px;
          background: linear-gradient(135deg, #f5f3ff, #ede9fe); color: #6d28d9;
          font-size: 14.5px; font-weight: 700; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: all 0.15s; margin-bottom: 10px;
        }
        .bk-btn-predict:hover:not(:disabled) { background: linear-gradient(135deg,#ede9fe,#ddd6fe); transform: translateY(-1px); box-shadow: 0 4px 14px rgba(124,58,237,0.2); }
        .bk-btn-predict:disabled { opacity: 0.6; cursor: not-allowed; }

        .bk-btn-recommend {
          width: 100%; height: 48px; border: none; border-radius: 12px;
          background: linear-gradient(135deg, #8b5cf6, #6366f1); color: white;
          font-size: 14.5px; font-weight: 700; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: all 0.15s; margin-bottom: 8px;
          box-shadow: 0 2px 8px rgba(99,102,241,0.3);
        }
        .bk-btn-recommend:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(99,102,241,0.4); }
        .bk-btn-recommend:disabled { opacity: 0.6; cursor: not-allowed; }

        .bk-btn-book {
          width: 100%; height: 52px; border: none; border-radius: 13px;
          background: linear-gradient(135deg, #5b5ef4 0%, #7c3aed 100%); color: white;
          font-size: 15px; font-weight: 700; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 9px;
          box-shadow: 0 4px 20px rgba(99,102,241,0.42); transition: all 0.15s;
        }
        .bk-btn-book:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(99,102,241,0.48); }
        .bk-btn-book:disabled { opacity: 0.58; cursor: not-allowed; }

        .bk-fee-badge {
          background: linear-gradient(135deg, #f5f3ff, #ede9fe); border: 1.5px solid #c4b5fd;
          border-radius: 14px; padding: 16px 20px; margin-bottom: 16px;
          display: flex; align-items: center; justify-content: space-between; animation: bk_pop 0.4s ease both;
        }
        .bk-fee-lbl { font-size: 11.5px; font-weight: 700; color: #7c3aed; font-family: 'DM Mono', monospace; margin-bottom: 5px; display: flex; align-items: center; gap: 5px; }
        .bk-fee-val { font-size: 28px; font-weight: 800; color: #4c1d95; letter-spacing: -1px; }
        .bk-fee-icon { width: 48px; height: 48px; border-radius: 13px; background: linear-gradient(135deg,#7c3aed,#a78bfa); display: flex; align-items: center; justify-content: center; color: #fff; box-shadow: 0 4px 14px rgba(124,58,237,0.35); }

        .bk-summary-card {
          background: #fff; border-radius: 18px; border: 1px solid #e8edf2;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
          overflow: hidden; margin-bottom: 16px; animation: bk_up 0.45s 0.05s ease both;
        }
        .bk-sum-hero {
          background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e3a5f 100%);
          padding: 20px 22px; position: relative; overflow: hidden;
        }
        .bk-sum-hero::before {
          content:''; position:absolute; inset:0;
          background: radial-gradient(ellipse 70% 60% at 70% 40%, rgba(99,102,241,0.3) 0%, transparent 70%);
          pointer-events: none;
        }
        .bk-sum-hdots {
          position: absolute; inset: 0;
          background-image: radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 18px 18px;
        }
        .bk-sum-title { font-size: 16px; font-weight: 800; color: #fff; letter-spacing: -0.3px; margin-bottom: 4px; position: relative; z-index: 1; display: flex; align-items: center; justify-content: space-between; }
        .bk-confirmed-tag { background: rgba(52,211,153,0.2); border: 1px solid rgba(52,211,153,0.35); color: #6ee7b7; font-size: 10.5px; font-weight: 700; padding: 3px 9px; border-radius: 20px; font-family: 'DM Mono', monospace; }
        .bk-pending-tag { background: rgba(251,191,36,0.15); border: 1px solid rgba(251,191,36,0.3); color: #fde68a; font-size: 10.5px; font-weight: 700; padding: 3px 9px; border-radius: 20px; }
        .bk-sum-body { padding: 18px 22px; }
        .bk-sum-row { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 14px; }
        .bk-sum-icon { width: 30px; height: 30px; border-radius: 8px; background: #f1f5f9; display: flex; align-items: center; justify-content: center; color: #64748b; flex-shrink: 0; }
        .bk-sum-key { font-size: 10.5px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.6px; font-family: 'DM Mono', monospace; margin-bottom: 3px; }
        .bk-sum-val { font-size: 14px; font-weight: 700; color: #0f172a; }

        .bk-qr-success { background: #fff; border-radius: 18px; padding: 24px; border: 1px solid #e8edf2; box-shadow: 0 1px 3px rgba(0,0,0,0.04); animation: bk_up 0.5s ease both; }
        .bk-qr-header { background: linear-gradient(135deg, #f0fdf4, #dcfce7); border: 1.5px solid #bbf7d0; border-radius: 14px; padding: 18px 20px; margin-bottom: 20px; text-align: center; animation: bk_success 0.5s 0.1s ease both; }
        .bk-qr-check { width: 52px; height: 52px; border-radius: 50%; background: linear-gradient(135deg,#10b981,#34d399); display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; color: white; box-shadow: 0 6px 20px rgba(16,185,129,0.4); }
        .bk-qr-title { font-size: 18px; font-weight: 800; color: #14532d; letter-spacing: -0.4px; margin-bottom: 4px; }
        .bk-qr-sub { font-size: 13px; color: #166534; font-weight: 500; }
        .bk-qr-id { display: inline-flex; align-items: center; gap: 5px; background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.25); border-radius: 20px; padding: 4px 12px; font-size: 12px; font-weight: 700; color: #166534; font-family: 'DM Mono', monospace; margin-top: 8px; }
        .bk-qr-box { background: #fff; border: 1px solid #e8edf2; border-radius: 16px; padding: 22px; text-align: center; margin-bottom: 16px; animation: bk_qrin 0.6s 0.2s ease both; }
        .bk-qr-label { font-size: 10.5px; font-weight: 700; color: #94a3b8; letter-spacing: 1.2px; text-transform: uppercase; font-family: 'DM Mono', monospace; margin-bottom: 14px; display: flex; align-items: center; justify-content: center; gap: 5px; }
        .bk-qr-img { width: 170px; height: 170px; object-fit: contain; border-radius: 10px; display: block; margin: 0 auto 12px; }
        .bk-qr-placeholder { width: 170px; height: 170px; background: repeating-conic-gradient(#f1f5f9 0% 25%, #fff 0% 50%) 0 0 / 14px 14px; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; font-size: 36px; }
        .bk-qr-hint { font-size: 12px; color: #94a3b8; font-weight: 500; }
        .bk-btn-row { display: flex; gap: 10px; margin-bottom: 12px; }
        .bk-btn-dl { flex: 1; height: 46px; border: none; border-radius: 11px; background: linear-gradient(135deg,#5b5ef4,#7c3aed); color: #fff; font-size: 14px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 7px; box-shadow: 0 4px 14px rgba(99,102,241,0.4); transition: all 0.15s; }
        .bk-btn-dl:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(99,102,241,0.45); }
        .bk-btn-dl:disabled { opacity: 0.5; cursor: not-allowed; }
        .bk-btn-new { height: 46px; padding: 0 16px; border: 1.5px solid #e2e8f0; border-radius: 11px; background: #fff; color: #64748b; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.15s; display: flex; align-items: center; justify-content: center; gap: 6px; }
        .bk-btn-new:hover { border-color: #6366f1; color: #6366f1; background: #f5f3ff; }
        .bk-chips { display: flex; flex-wrap: wrap; gap: 7px; }
        .bk-chip { display: flex; align-items: center; gap: 5px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 20px; padding: 5px 12px; font-size: 11.5px; font-weight: 600; color: #475569; font-family: 'DM Mono', monospace; }
        .bk-chip-d { width: 6px; height: 6px; border-radius: 50%; }

        @media(max-width:768px) {
          .bk-body { padding: 16px; }
          .bk-topbar { padding: 0 16px; }
          .bk-breadcrumb { padding: 14px 16px 0; }
        }
      `}</style>

      <div className="bk-root">
        <header className="bk-topbar">
          <button className="bk-back" onClick={() => onNavigate?.("dashboard")}>
            <IcoBack/> Dashboard
          </button>
          <div style={{ display:"flex", alignItems:"center", gap:9 }}>
            <div className="bk-topbar-logo"><IcoCarSolid/></div>
            <div>
              <div className="bk-topbar-name">ParkSense</div>
              <div className="bk-topbar-sub">RESERVATION SYSTEM</div>
            </div>
          </div>
          <div className="bk-avatar" onClick={() => onNavigate?.("profile")}>
            {avatarUrl ? <img src={avatarUrl} alt="avatar" style={{ width:"100%", height:"100%", objectFit:"cover", borderRadius:"50%" }}/> : initials}
          </div>
        </header>

        <div className="bk-breadcrumb">
          DASHBOARD
          <span className="bk-breadcrumb-sep">›</span>
          <span>BOOK PARKING</span>
          {lotId && <><span className="bk-breadcrumb-sep">›</span><span>{lot.zone.toUpperCase()}</span></>}
        </div>

        <div className="bk-body">
          {success ? (
            <div className="bk-grid">
              <div>
                <div className="bk-heading">
                  <div className="bk-heading-title">Booking Confirmed! 🎉</div>
                  <div className="bk-heading-sub">Your parking reservation is confirmed. Show the QR code at the entrance.</div>
                </div>
                <div className="bk-qr-success">
                  <div className="bk-qr-header">
                    <div className="bk-qr-check"><IcoCheck size={24}/></div>
                    <div className="bk-qr-title">Booking Successful</div>
                    <div className="bk-qr-sub">Slot {slotLabel} · {lot.name} · {duration}h</div>
                    {bookingId && <div className="bk-qr-id">Booking #{bookingId}</div>}
                  </div>
                  <div className="bk-qr-box">
                    <div className="bk-qr-label"><IcoStar/> SCAN TO ENTER</div>
                    {qr
                      ? <img className="bk-qr-img" src={`data:image/png;base64,${qr}`} alt="Parking QR Code"/>
                      : <div className="bk-qr-placeholder">🔳</div>
                    }
                    <div className="bk-qr-hint">Present at barrier · Valid for {duration}h</div>
                  </div>
                  <div className="bk-btn-row">
                    <button className="bk-btn-dl" onClick={downloadQR} disabled={!qr}><IcoDownload/> Download QR</button>
                    <button className="bk-btn-new" onClick={handleReset}>+ New</button>
                    <button className="bk-btn-new" onClick={() => onNavigate?.("dashboard")}>← Back</button>
                  </div>
                  <div className="bk-chips">
                    <div className="bk-chip"><div className="bk-chip-d" style={{background:"#10b981"}}/>Confirmed</div>
                    <div className="bk-chip"><div className="bk-chip-d" style={{background:"#6366f1"}}/>Smart Priced</div>
                    <div className="bk-chip"><div className="bk-chip-d" style={{background:"#f97316"}}/>Secure</div>
                  </div>
                </div>
              </div>
              <div>
                <div className="bk-summary-card">
                  <div className="bk-sum-hero">
                    <div className="bk-sum-hdots"/>
                    <div className="bk-sum-title">Reservation Summary <span className="bk-confirmed-tag">CONFIRMED</span></div>
                  </div>
                  <div className="bk-sum-body">
                    <div className="bk-sum-row">
                      <div className="bk-sum-icon"><IcoMap size={14}/></div>
                      <div><div className="bk-sum-key">Location</div><div className="bk-sum-val">{slotLabel} · {lot.zone}</div></div>
                    </div>
                    <div className="bk-sum-row">
                      <div className="bk-sum-icon"><IcoClock size={14}/></div>
                      <div><div className="bk-sum-key">Duration</div><div className="bk-sum-val">{duration} hour{Number(duration)>1?"s":""}</div></div>
                    </div>
                  </div>
                </div>
                {predictedFee !== null && (
                  <div className="bk-summary-card" style={{ marginTop: 16 }}>
                    <div className="bk-sum-hero" style={{ background: "linear-gradient(135deg, #065f46, #047857)" }}>
                      <div className="bk-sum-title">Payment Summary</div>
                    </div>
                    <div className="bk-sum-body">
                      <div className="bk-sum-row">
                        <div className="bk-sum-icon">💰</div>
                        <div><div className="bk-sum-key">Total Paid</div><div className="bk-sum-val" style={{ fontSize: 20, color: "#065f46" }}>₹{predictedFee}</div></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bk-grid">
              <div>
                <div className="bk-heading">
                  <div className="bk-heading-title">{lot.zone.split("—")[1]?.trim() || lot.name} Reservation</div>
                  <div className="bk-heading-sub">{lot.closed ? "Please choose an open zone below." : lot.spec}</div>
                </div>

                {/* ── ZONE A CLOSED NOTICE BANNER ── */}
                <div className="bk-zone-closed-notice">
                  <div className="bk-zone-closed-notice-icon"><IcoWarning/></div>
                  <div>
                    <div className="bk-zone-closed-notice-title">Zone A — Temporarily Closed</div>
                    <div className="bk-zone-closed-notice-sub">
                      Zone A (Flexi Pass) is currently closed for scheduled maintenance.<br/>
                      Zones B, C, and D are fully operational. Please select one below.
                    </div>
                  </div>
                </div>

                {error && <div className="bk-alert bk-err">⚠ {error}</div>}
                {preSelectedSlotNumber && (
                  <div className="bk-alert bk-suc" style={{ marginBottom: 16 }}>
                    <IcoCheck size={16}/> Slot automatically selected from map: {lot.name} • Bay {String(preSelectedSlotNumber).padStart(2, "0")}
                  </div>
                )}

                {/* SMART SLOT RECOMMENDATION */}
                <div className="bk-card bk-recommend-card">
                  <div className="bk-card-hd">
                    <div className="bk-card-title"><IcoRecommend/> Smart Slot Recommendation</div>
                    <span className="rec-badge"><IcoSpark/></span>
                  </div>
                  <div className="bk-card-sub">Get the best available slot optimized for your vehicle type</div>
                  <button className="bk-btn-recommend" onClick={handleRecommendSlot} disabled={recommendLoading}>
                    {recommendLoading
                      ? <><Spinner size={16} color="#fff"/> Finding best slot...</>
                      : <><IcoRecommend/> Recommend Best Slot</>}
                  </button>
                  {recommendError && (
                    <div className="bk-alert bk-err" style={{ marginTop: 12, marginBottom: 0, padding: "10px 14px", fontSize: 12 }}>
                      ⚠ {recommendError}
                    </div>
                  )}
                  {recommendedSlot !== null && availableCount !== null && !recommendError && (
                    <div className="rec-result">
                      <div className="rec-slot-badge">
                        <span className="rec-slot-label">Recommended Bay</span>
                        <span className="rec-slot-number">{lotPrefix}{String(recommendedSlot).padStart(2, "0")}</span>
                      </div>
                      <div className="rec-stats">
                        <div className="rec-stat"><div className="rec-stat-value">{availableCount}</div><div className="rec-stat-label">Available Slots</div></div>
                        <div className="rec-stat"><div className="rec-stat-value">{lot.name}</div><div className="rec-stat-label">Lot Status</div></div>
                      </div>
                      <div style={{ fontSize: 11, color: "#10b981", marginTop: 8, display: "flex", alignItems: "center", gap: 4 }}>
                        <IcoCheck size={12}/> Slot auto-filled below
                      </div>
                    </div>
                  )}
                </div>

                {/* LOT TABS */}
                <div className="bk-card">
                  <div className="bk-card-hd">
                    <div className="bk-card-title"><IcoMap size={17}/> Select Parking Lot</div>
                  </div>
                  <div className="bk-card-sub">Zone A is closed · Choose from Zones B, C, or D</div>
                  <LotTabs active={lotId} onChange={id => {
                    setLotId(id); setSlotNumber(null); setRecommendedSlot(null);
                    setAvailableCount(null); setRecommendError(""); setPredictedFee(null);
                  }}/>

                  <div className="bk-sensor-bar">
                    <div className="bk-live-dot"/>
                    <IcoWifi/>
                    <span>LIVE DATA: OCCUPANCY SENSORS ACTIVE</span>
                    <div className="bk-sensor-right">
                      <div className="bk-sensor-item"><div className="bk-sensor-dot" style={{background:"#e2e8f0",borderRadius:2}}/> Occupied</div>
                      <div className="bk-sensor-item"><div className="bk-sensor-dot" style={{background:"#bbf7d0",borderRadius:2}}/> Available</div>
                      <div className="bk-sensor-item"><div className="bk-sensor-dot" style={{background:lot.color,borderRadius:2}}/> Selected</div>
                    </div>
                  </div>

                  <SlotGrid lotId={lotId} selected={slotNumber} onSelect={setSlotNumber} color={lot.color}/>
                </div>

                {/* DURATION */}
                <div className="bk-card">
                  <div className="bk-card-hd">
                    <div className="bk-card-title"><IcoClock size={17}/> Parking Duration</div>
                  </div>
                  <div className="bk-card-sub">How many hours do you need the spot?</div>
                  <div className="bk-dur-row">
                    <input
                      className={`bk-dur-input${error && (!duration || Number(duration)<1) ? " bk-inp-err":""}`}
                      type="number" min="1" max="24"
                      placeholder="Enter hours (e.g. 2)"
                      value={duration}
                      onChange={e => setDuration(e.target.value)}
                    />
                    <div className="bk-dur-stepper">
                      <button className="bk-step-btn" onClick={() => setDuration(d => String(Math.min(24, Number(d||0)+1)))}>▲</button>
                      <button className="bk-step-btn" onClick={() => setDuration(d => String(Math.max(1, Number(d||2)-1)))}>▼</button>
                    </div>
                  </div>
                  <div className="bk-dur-hint">Max 24 hours · Min 1 hour · Rate: ₹{lot.rate}/hour</div>
                </div>

                {/* FEE CALCULATOR + BOOK */}
                <div className="bk-card">
                  <div className="bk-card-hd">
                    <div className="bk-card-title"><IcoBot/> Fee Calculator</div>
                  </div>
                  <div className="bk-card-sub">Get an instant price estimate</div>
                  {predictedFee !== null && (
                    <div className="bk-fee-badge">
                      <div>
                        <div className="bk-fee-lbl"><IcoBot/> TOTAL FEE</div>
                        <div className="bk-fee-val">₹{predictedFee}</div>
                      </div>
                      <div className="bk-fee-icon"><IcoBot/></div>
                    </div>
                  )}
                  <button className="bk-btn-predict" onClick={handlePredict} disabled={predicting || booking}>
                    {predicting ? <><Spinner size={16} color="#6d28d9"/> Calculating...</> : <><IcoBot/> Calculate Fee</>}
                  </button>
                  <button
                    className="bk-btn-book"
                    onClick={handleBooking}
                    disabled={booking || predicting || predictedFee === null}
                  >
                    {booking
                      ? <><Spinner/> Booking…</>
                      : predictedFee === null
                        ? "Calculate Fee First →"
                        : `Book Now · ₹${predictedFee} →`}
                  </button>
                  {predictedFee === null && duration && slotNumber && (
                    <div style={{ textAlign:"center", fontSize:12, color:"#94a3b8", marginTop:10, fontFamily:"'DM Mono',monospace" }}>
                      Estimated: ₹{estimatedFee} · Click Calculate to confirm
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT PANEL */}
              <div>
                <div className="bk-summary-card">
                  <div className="bk-sum-hero">
                    <div className="bk-sum-hdots"/>
                    <div className="bk-sum-title">
                      Your Booking
                      <span className={slotNumber && duration ? "bk-confirmed-tag" : "bk-pending-tag"}>
                        {slotNumber && duration ? "READY" : "PENDING"}
                      </span>
                    </div>
                  </div>
                  <div className="bk-sum-body">
                    <div className="bk-sum-row">
                      <div className="bk-sum-icon"><IcoMap size={14}/></div>
                      <div>
                        <div className="bk-sum-key">LOCATION</div>
                        <div className="bk-sum-val">{slotLabel ? `${slotLabel} · ${lot.zone}` : `${lot.name} · Select a slot`}</div>
                      </div>
                    </div>
                    <div className="bk-sum-row">
                      <div className="bk-sum-icon"><IcoClock size={14}/></div>
                      <div>
                        <div className="bk-sum-key">DURATION</div>
                        <div className="bk-sum-val">{duration ? `${duration} hour${Number(duration)>1?"s":""}` : "Not set"}</div>
                      </div>
                    </div>
                    {recommendedSlot && (
                      <div className="bk-sum-row">
                        <div className="bk-sum-icon"><IcoStar/></div>
                        <div>
                          <div className="bk-sum-key">AI SUGGESTION</div>
                          <div className="bk-sum-val" style={{ color: "#6366f1" }}>Bay {lotPrefix}{String(recommendedSlot).padStart(2, "0")} · Auto-filled</div>
                        </div>
                      </div>
                    )}
                    {preSelectedSlotNumber && (
                      <div className="bk-sum-row">
                        <div className="bk-sum-icon"><IcoMapMarker/></div>
                        <div>
                          <div className="bk-sum-key">FROM MAP</div>
                          <div className="bk-sum-val" style={{ color: "#10b981" }}>Bay {String(preSelectedSlotNumber).padStart(2, "0")} selected</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="bk-chips">
                  <div className="bk-chip"><div className="bk-chip-d" style={{background:"#10b981"}}/>Sensor-verified</div>
                  <div className="bk-chip"><div className="bk-chip-d" style={{background:"#6366f1"}}/>AI-recommended</div>
                  <div className="bk-chip"><div className="bk-chip-d" style={{background:"#f97316"}}/>QR entry</div>
                  <div className="bk-chip"><div className="bk-chip-d" style={{background:"#14b8a6"}}/>Eco-friendly</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}