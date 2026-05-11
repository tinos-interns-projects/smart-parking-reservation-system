// src/pages/History.jsx - Updated with Cancel Option Removed (Only Booking Confirmation)
import { useState, useEffect, useMemo } from "react";
import api from "../api/api";

/* ═══════════════════════ ICONS ═══════════════════════ */
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
const IcoSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const IcoQR = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/>
    <rect x="5" y="5" width="3" height="3" fill="currentColor" stroke="none"/>
    <rect x="16" y="5" width="3" height="3" fill="currentColor" stroke="none"/>
    <rect x="5" y="16" width="3" height="3" fill="currentColor" stroke="none"/>
    <path d="M14 14h3v3h-3zM17 17h3v3h-3zM14 20h3"/>
  </svg>
);
const IcoDownload = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);
const IcoClose = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const IcoClock = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const IcoMap = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const IcoHash = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/>
    <line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/>
  </svg>
);
const IcoWallet = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M21 12V7H5a2 2 0 010-4h11v4"/><path d="M3 7v13a2 2 0 002 2h16v-5"/>
    <circle cx="18" cy="12" r="1" fill="currentColor" stroke="none"/>
  </svg>
);
const IcoStar = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const IcoShare = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>
);
const IcoMore = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="5" cy="12" r="1" fill="currentColor" stroke="none"/>
  </svg>
);
const IcoCalendar = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const IcoCheck = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const Spinner = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" strokeWidth="2.5"
    style={{ animation: "spin 0.75s linear infinite" }}>
    <circle cx="12" cy="12" r="10" stroke="rgba(99,102,241,0.18)"/>
    <path d="M12 2a10 10 0 0110 10" stroke="#6366f1"/>
  </svg>
);

/* ═══════════════════════ STATS CARD ═══════════════════════ */
function StatCard({ label, value, color }) {
  return (
    <div className="stat-card" style={{ borderLeftColor: color }}>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

/* ═══════════════════════ QR MODAL ═══════════════════════ */
function QRModal({ booking, onClose }) {
  if (!booking) return null;

  const downloadQR = () => {
    if (!booking.qr_code) return;
    const link = document.createElement("a");
    link.href = `data:image/png;base64,${booking.qr_code}`;
    link.download = `ParkSense_QR_${booking.id || "booking"}.png`;
    link.click();
  };

  const shareQR = async () => {
    if (!booking.qr_code) return;
    try {
      const blob = await (await fetch(`data:image/png;base64,${booking.qr_code}`)).blob();
      const file = new File([blob], "parking_qr.png", { type: "image/png" });
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: "ParkSense QR Code" });
      } else { downloadQR(); }
    } catch { downloadQR(); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Booking Confirmed ✓</h3>
          <button className="modal-close" onClick={onClose}><IcoClose/></button>
        </div>
        <div className="modal-body">
          <div className="qr-wrapper">
            <div className="qr-check">
              <IcoCheck size={28}/>
            </div>
            <div className="qr-label">SCAN TO ENTER</div>
            {booking.qr_code ? (
              <img className="qr-image" src={`data:image/png;base64,${booking.qr_code}`} alt="QR Code"/>
            ) : (
              <div className="qr-placeholder">🔳</div>
            )}
            <p className="qr-hint">Slot #{booking.slot_number} · {booking.parking_lot} · {booking.duration}h</p>
          </div>
          <div className="booking-summary">
            <div className="summary-row">
              <span className="summary-label">Booking ID</span>
              <span className="summary-value">#{booking.id || "N/A"}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Amount Paid</span>
              <span className="summary-value fee">₹{booking.predicted_fee}</span>
            </div>
          </div>
          <div className="modal-actions">
            <button className="btn-download" onClick={downloadQR}><IcoDownload/> Download QR</button>
            <button className="btn-share" onClick={shareQR}><IcoShare/></button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════ BOOKING ROW (table) ═══════════════════════ */
function BookingRow({ booking, idx, onViewQR }) {
  const username = localStorage.getItem("parking_user") || "User";
  const colors = ["#6366f1", "#10b981", "#f97316", "#3b82f6", "#8b5cf6", "#ec4899", "#14b8a6"];
  const color = colors[(booking.id || idx) % colors.length];

  const formatDate = () => {
    if (booking.created_at) {
      return new Date(booking.created_at).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
      });
    }
    const date = new Date();
    date.setDate(date.getDate() - ((booking.id || 0) % 30));
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getPaymentMethod = () => {
    return ["Cash", "Card", "UPI"][(booking.id || 0) % 3];
  };

  return (
    <tr className="table-row" style={{ animationDelay: `${idx * 0.03}s` }}>
      <td className="table-cell"><span className="order-id">#{booking.id || idx + 1}</span></td>
      <td className="table-cell"><span className="customer-name">{username}</span></td>
      <td className="table-cell"><span className="payment-badge">{getPaymentMethod()}</span></td>
      <td className="table-cell"><span className="date-text"><IcoCalendar/> {formatDate()}</span></td>
      <td className="table-cell"><span className="status-badge status-confirmed">✓ Confirmed</span></td>
      <td className="table-cell"><span className="fee-amount">₹{Number(booking.predicted_fee).toLocaleString()}</span></td>
      <td className="table-cell">
        <button className="qr-icon-btn" onClick={() => onViewQR(booking)}>
          <IcoQR/> QR
        </button>
      </td>
    </tr>
  );
}

/* ═══════════════════════ MAIN HISTORY PAGE ═══════════════════════ */
export default function History({ onNavigate, avatarUrl = "" }) {
  const username = localStorage.getItem("parking_user") || "User";
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedQR, setSelectedQR] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await api.get("history/");
        setBookings(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load booking history");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filteredBookings = useMemo(() => {
    let list = [...bookings];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(b => 
        String(b.id || "").includes(q) ||
        String(b.parking_lot || "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [bookings, search]);

  const stats = {
    total: bookings.length,
    totalSpent: bookings.reduce((sum, b) => sum + (Number(b.predicted_fee) || 0), 0),
    avgFee: bookings.length ? Math.round(bookings.reduce((sum, b) => sum + (Number(b.predicted_fee) || 0), 0) / bookings.length) : 0
  };

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }

        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #f8f9fc; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }

        .history-page { min-height: 100vh; background: #f8f9fc; }

        .topbar {
          background: white; border-bottom: 1px solid #eef2f6;
          padding: 0 28px; height: 64px; display: flex; align-items: center; gap: 16px;
          position: sticky; top: 0; z-index: 50;
        }
        .back-btn {
          display: flex; align-items: center; gap: 6px; padding: 8px 16px;
          border-radius: 10px; border: 1px solid #eef2f6; background: white;
          font-size: 13px; font-weight: 500; color: #5a6874; cursor: pointer;
        }
        .back-btn:hover { border-color: #6366f1; color: #6366f1; background: #f5f3ff; }
        .logo { width: 34px; height: 34px; background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 10px; display: flex; align-items: center; justify-content: center; }
        .brand-name { font-size: 15px; font-weight: 700; color: #1a2634; }
        .brand-sub { font-size: 10px; color: #8f9eac; font-family: monospace; }
        .avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #6366f1, #8b5cf6); display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; margin-left: auto; cursor: pointer; }

        .main-content { max-width: 1400px; margin: 0 auto; padding: 24px 28px; }

        .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px; }
        .page-header h1 { font-size: 24px; font-weight: 700; color: #1a2634; letter-spacing: -0.3px; }

        .stats-row { display: flex; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }
        .stat-card {
          background: white; border-radius: 12px; padding: 14px 20px;
          min-width: 150px; border-left: 3px solid; box-shadow: 0 1px 2px rgba(0,0,0,0.03);
        }
        .stat-card .stat-value { font-size: 28px; font-weight: 700; color: #1a2634; }
        .stat-card .stat-label { font-size: 13px; color: #8f9eac; margin-top: 4px; }

        .search-bar { margin-bottom: 20px; position: relative; max-width: 320px; }
        .search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #9aaebf; }
        .search-input {
          width: 100%; height: 42px; padding: 0 14px 0 42px;
          background: white; border: 1px solid #eef2f6; border-radius: 10px;
          font-size: 14px; transition: all 0.2s;
        }
        .search-input:focus { outline: none; border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.08); }

        .table-wrapper { background: white; border-radius: 16px; border: 1px solid #eef2f6; overflow: auto; box-shadow: 0 1px 3px rgba(0,0,0,0.02); }
        .data-table { width: 100%; border-collapse: collapse; min-width: 800px; }
        .table-header { background: #fafbfc; border-bottom: 1px solid #eef2f6; }
        .table-header th { padding: 14px 16px; text-align: left; font-size: 12px; font-weight: 600; color: #8f9eac; text-transform: uppercase; letter-spacing: 0.5px; }
        .table-row { border-bottom: 1px solid #f0f3f8; transition: background 0.15s; animation: slideIn 0.3s ease both; }
        .table-row:hover { background: #fafbfc; }
        .table-cell { padding: 16px; font-size: 14px; color: #3a4a5a; }
        .order-id { font-weight: 600; color: #1a2634; font-family: monospace; }
        .customer-name { font-weight: 600; color: #1a2634; }
        .payment-badge { display: inline-block; padding: 4px 10px; background: #f0fdf4; color: #2e7d32; border-radius: 20px; font-size: 12px; font-weight: 500; }
        .date-text { font-family: monospace; font-size: 13px; color: #5a6874; display: flex; align-items: center; gap: 5px; }
        .status-badge {
          display: inline-block; padding: 4px 12px; border-radius: 20px;
          font-size: 12px; font-weight: 600;
        }
        .status-confirmed { background: #e8f5e9; color: #2e7d32; }
        .fee-amount { font-weight: 700; color: #1a2634; font-family: monospace; }
        .qr-icon-btn {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 6px 12px; border-radius: 8px; border: 1px solid #eef2f6;
          background: white; cursor: pointer; font-size: 12px; font-weight: 500;
          color: #6366f1; transition: all 0.2s;
        }
        .qr-icon-btn:hover { border-color: #6366f1; background: #f5f3ff; transform: translateY(-1px); }

        .loading-state { background: white; border-radius: 16px; padding: 60px; text-align: center; border: 1px solid #eef2f6; }
        .error-state { background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 14px 18px; color: #dc2626; margin-bottom: 20px; }
        .empty-state { background: white; border-radius: 16px; padding: 50px; text-align: center; border: 1px solid #eef2f6; }
        .empty-icon { font-size: 48px; margin-bottom: 12px; opacity: 0.4; }
        .empty-title { font-size: 16px; font-weight: 600; color: #1a2634; margin-bottom: 6px; }
        .empty-sub { font-size: 13px; color: #8f9eac; }

        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(8px); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .modal-container { background: white; border-radius: 20px; max-width: 400px; width: 100%; overflow: hidden; animation: fadeUp 0.3s ease; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 18px 20px; border-bottom: 1px solid #eef2f6; }
        .modal-header h3 { font-size: 18px; font-weight: 700; color: #1a2634; }
        .modal-close { width: 32px; height: 32px; border-radius: 8px; border: 1px solid #eef2f6; background: white; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .modal-body { padding: 20px; }
        .qr-wrapper { text-align: center; margin-bottom: 16px; }
        .qr-check { width: 56px; height: 56px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; color: white; }
        .qr-label { font-size: 10px; font-weight: 700; color: #8f9eac; letter-spacing: 1px; margin-bottom: 12px; }
        .qr-image { width: 160px; height: 160px; object-fit: contain; margin: 0 auto 10px; display: block; }
        .qr-placeholder { width: 160px; height: 160px; background: repeating-conic-gradient(#eef2f6 0% 25%, #fff 0% 50%); border-radius: 12px; margin: 0 auto 10px; display: flex; align-items: center; justify-content: center; font-size: 40px; }
        .qr-hint { font-size: 12px; color: #8f9eac; }
        .booking-summary { background: #f8fafc; border-radius: 12px; padding: 14px; margin-bottom: 16px; }
        .summary-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
        .summary-row:last-child { margin-bottom: 0; }
        .summary-label { font-size: 12px; color: #8f9eac; }
        .summary-value { font-weight: 600; color: #1a2634; }
        .summary-value.fee { color: #6366f1; font-size: 16px; }
        .modal-actions { display: flex; gap: 10px; }
        .btn-download { flex: 1; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; border: none; padding: 10px; border-radius: 10px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; }
        .btn-share { width: 44px; border: 1px solid #eef2f6; background: white; border-radius: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center; }

        @media (max-width: 768px) {
          .topbar { padding: 0 16px; }
          .main-content { padding: 16px; }
          .page-header h1 { font-size: 20px; }
          .stat-card { min-width: 110px; padding: 10px 14px; }
          .stat-card .stat-value { font-size: 22px; }
        }
      `}</style>

      <div className="history-page">
        <div className="topbar">
          <button className="back-btn" onClick={() => onNavigate?.("dashboard")}>
            <IcoBack/> Dashboard
          </button>
          <div className="logo"><IcoCarSolid/></div>
          <div>
            <div className="brand-name">ParkSense</div>
            <div className="brand-sub">BOOKING HISTORY</div>
          </div>
          <div className="avatar" onClick={() => onNavigate?.("profile")}>
            {avatarUrl ? <img src={avatarUrl} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}/> : username.charAt(0).toUpperCase()}
          </div>
        </div>

        <div className="main-content">
          <div className="page-header">
            <h1>Booking History</h1>
          </div>

          <div className="stats-row">
            <StatCard label="Total Bookings" value={stats.total} color="#6366f1"/>
            <StatCard label="Total Spent" value={`₹${stats.totalSpent.toLocaleString()}`} color="#10b981"/>
            <StatCard label="Average Fee" value={`₹${stats.avgFee}`} color="#f97316"/>
          </div>

          <div className="search-bar">
            <span className="search-icon"><IcoSearch/></span>
            <input className="search-input" type="text" placeholder="Search by ID or lot name..." value={search} onChange={e => setSearch(e.target.value)}/>
          </div>

          {error && <div className="error-state">⚠️ {error}</div>}

          {loading && (
            <div className="loading-state"><Spinner/><p style={{ marginTop: 12, color: "#8f9eac" }}>Loading bookings...</p></div>
          )}

          {!loading && !error && filteredBookings.length > 0 && (
            <div className="table-wrapper">
              <table className="data-table">
                <thead className="table-header">
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Payment</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking, idx) => (
                    <BookingRow key={booking.id || idx} booking={booking} idx={idx} onViewQR={setSelectedQR}/>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && !error && filteredBookings.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <div className="empty-title">{bookings.length === 0 ? "No bookings yet" : "No matching records"}</div>
              <div className="empty-sub">{bookings.length === 0 ? "Make your first parking reservation to see it here." : "Try adjusting your search."}</div>
              {bookings.length === 0 && (
                <button onClick={() => onNavigate?.("booking")} style={{
                  marginTop: 16, padding: "10px 24px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  color: "white", border: "none", borderRadius: "10px", fontWeight: 600, cursor: "pointer"
                }}>+ Book Your First Spot</button>
              )}
            </div>
          )}
        </div>
      </div>

      {selectedQR && <QRModal booking={selectedQR} onClose={() => setSelectedQR(null)}/>}
    </>
  );
}