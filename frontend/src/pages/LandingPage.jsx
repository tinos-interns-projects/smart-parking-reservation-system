// src/pages/LandingPage.jsx
import React, { useState, useEffect } from "react";

/* ═══════════════════════ ICONS ═══════════════════════ */
const IcoCar = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z"/>
    <path d="M6.5 16h.01M17.5 16h.01"/>
  </svg>
);
const IcoClock = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const IcoQr = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/>
    <rect x="5" y="5" width="3" height="3" fill="currentColor" stroke="none"/>
    <rect x="16" y="5" width="3" height="3" fill="currentColor" stroke="none"/>
  </svg>
);
const IcoAi = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="10" rx="2"/>
    <path d="M12 11V7"/><circle cx="12" cy="5" r="2"/>
    <line x1="8" y1="15" x2="8" y2="15"/><line x1="12" y1="15" x2="12" y2="15"/><line x1="16" y1="15" x2="16" y2="15"/>
  </svg>
);

export default function LandingPage({ onNavigate }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    { icon: <IcoAi/>, title: "AI Slot Recommendation", desc: "Get the best parking spot recommended by AI based on real-time availability" },
    { icon: <IcoQr/>, title: "QR Code Access", desc: "Contactless entry with digital QR codes for each booking" },
    { icon: <IcoClock/>, title: "Real-time Availability", desc: "Live slot tracking and instant booking confirmation" },
    { icon: <IcoCar/>, title: "Multiple Locations", desc: "Access to premium parking lots across the city" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        .landing-page {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: white;
          overflow-x: hidden;
        }

        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }

        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          padding: 16px 32px;
          background: white;
          transition: all 0.3s ease;
          border-bottom: 1px solid rgba(0,0,0,0.05);
        }
        .navbar.scrolled {
          padding: 12px 32px;
          background: rgba(255,255,255,0.98);
          backdrop-filter: blur(10px);
          box-shadow: 0 1px 20px rgba(0,0,0,0.05);
        }
        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }
        .logo-icon {
          width: 38px;
          height: 38px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }
        .logo-text h2 {
          font-size: 20px;
          font-weight: 800;
          color: #1a2634;
          letter-spacing: -0.5px;
        }
        .logo-text p {
          font-size: 10px;
          color: #8f9eac;
          letter-spacing: 0.5px;
        }
        .nav-links {
          display: flex;
          gap: 32px;
          align-items: center;
        }
        .nav-links a {
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          color: #5a6874;
          transition: color 0.2s;
          cursor: pointer;
        }
        .nav-links a:hover { color: #6366f1; }
        .btn-login {
          padding: 8px 20px;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          background: white;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-login:hover { border-color: #6366f1; color: #6366f1; background: #f5f3ff; }
        .btn-register {
          padding: 8px 24px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border: none;
          border-radius: 10px;
          color: white;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-register:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(99,102,241,0.3); }
        .mobile-toggle { display: none; font-size: 24px; cursor: pointer; }

        /* Hero Section */
        .hero {
          padding-top: 100px;
          padding-bottom: 80px;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
        }
        .hero-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 32px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 50px;
          align-items: center;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(99,102,241,0.1);
          padding: 6px 14px;
          border-radius: 30px;
          font-size: 13px;
          font-weight: 600;
          color: #6366f1;
          margin-bottom: 24px;
        }
        .hero-badge-dot {
          width: 8px;
          height: 8px;
          background: #10b981;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }
        .hero h1 {
          font-size: 54px;
          font-weight: 800;
          color: #1a2634;
          line-height: 1.2;
          letter-spacing: -1.5px;
          margin-bottom: 20px;
        }
        .hero h1 span {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero p {
          font-size: 18px;
          color: #6c7a8a;
          line-height: 1.6;
          margin-bottom: 32px;
          max-width: 500px;
        }
        .hero-buttons {
          display: flex;
          gap: 16px;
        }
        .btn-primary {
          padding: 14px 32px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border: none;
          border-radius: 12px;
          color: white;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(99,102,241,0.35); }
        .btn-secondary {
          padding: 14px 32px;
          background: white;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          color: #4a5a6a;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-secondary:hover { border-color: #6366f1; color: #6366f1; transform: translateY(-2px); }
        .hero-image {
          background: linear-gradient(135deg, #eef2ff, #e0e7ff);
          border-radius: 24px;
          padding: 40px;
          text-align: center;
        }
        .parking-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-bottom: 20px;
        }
        .parking-slot {
          background: white;
          border-radius: 10px;
          padding: 12px;
          text-align: center;
          border: 2px solid #e2e8f0;
          font-size: 12px;
          font-weight: 600;
        }
        .parking-slot.available { background: #f0fdf4; border-color: #86efac; color: #166534; }
        .parking-slot.booked { background: #fef2f2; border-color: #fecaca; color: #991b1b; }

        .features-section {
          padding: 80px 32px;
          background: white;
        }
        .section-header { text-align: center; margin-bottom: 60px; }
        .section-header h2 { font-size: 36px; font-weight: 800; color: #1a2634; letter-spacing: -1px; margin-bottom: 12px; }
        .section-header p { font-size: 18px; color: #6c7a8a; }
        .features-grid {
          max-width: 1200px; margin: 0 auto;
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 30px;
        }
        .feature-card {
          background: #f8fafc; padding: 32px 24px; border-radius: 20px;
          text-align: center; transition: all 0.3s; border: 1px solid #eef2f6;
        }
        .feature-card:hover { transform: translateY(-5px); box-shadow: 0 20px 35px rgba(0,0,0,0.05); }
        .feature-icon {
          width: 60px; height: 60px; background: linear-gradient(135deg, #eef2ff, #e0e7ff);
          border-radius: 16px; display: flex; align-items: center; justify-content: center;
          margin: 0 auto 20px; color: #6366f1;
        }
        .feature-card h3 { font-size: 18px; font-weight: 700; color: #1a2634; margin-bottom: 10px; }
        .feature-card p { font-size: 14px; color: #8f9eac; }

        .stats-section { padding: 60px 32px; background: #f8fafc; }
        .stats-container { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(4, 1fr); gap: 30px; }
        .stat-item { text-align: center; }
        .stat-value { font-size: 42px; font-weight: 800; background: linear-gradient(135deg, #6366f1, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .stat-label { font-size: 14px; color: #8f9eac; margin-top: 8px; }

        .steps-section { padding: 80px 32px; background: white; }
        .steps-container { max-width: 1000px; margin: 0 auto; display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; }
        .step-card { text-align: center; }
        .step-number {
          width: 60px; height: 60px; background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 30px; display: flex; align-items: center; justify-content: center;
          margin: 0 auto 20px; color: white; font-weight: 800; font-size: 20px;
        }
        .step-card h3 { font-size: 18px; font-weight: 700; color: #1a2634; margin-bottom: 10px; }
        .step-card p { font-size: 14px; color: #8f9eac; }

        .cta-section { padding: 80px 32px; background: linear-gradient(135deg, #1e1b4b, #312e81); }
        .cta-container { max-width: 800px; margin: 0 auto; text-align: center; }
        .cta-section h2 { font-size: 36px; font-weight: 800; color: white; margin-bottom: 16px; }
        .cta-section p { font-size: 18px; color: rgba(255,255,255,0.7); margin-bottom: 32px; }
        .btn-cta { padding: 14px 40px; background: white; border: none; border-radius: 12px; color: #6366f1; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .btn-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(255,255,255,0.2); }

        .footer { padding: 48px 32px 24px; background: #1a2634; }
        .footer-container { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px; margin-bottom: 40px; }
        .footer-logo p { color: #8f9eac; font-size: 13px; margin-top: 12px; max-width: 250px; line-height: 1.5; }
        .footer-column h4 { color: white; font-size: 14px; font-weight: 700; margin-bottom: 16px; }
        .footer-column a { display: block; color: #9aaebf; font-size: 13px; margin-bottom: 10px; cursor: pointer; }
        .footer-column a:hover { color: #6366f1; }
        .footer-bottom { text-align: center; padding-top: 24px; border-top: 1px solid #2d3a48; color: #8f9eac; font-size: 12px; }

        @media (max-width: 900px) {
          .nav-links { display: none; }
          .mobile-toggle { display: block; }
          .hero-container { grid-template-columns: 1fr; text-align: center; }
          .hero h1 { font-size: 40px; }
          .hero p { margin: 0 auto 32px; }
          .hero-buttons { justify-content: center; }
          .features-grid { grid-template-columns: repeat(2, 1fr); }
          .steps-container { grid-template-columns: 1fr; gap: 30px; }
          .stats-container { grid-template-columns: repeat(2, 1fr); }
          .footer-container { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 600px) {
          .hero h1 { font-size: 32px; }
          .section-header h2 { font-size: 28px; }
          .features-grid { grid-template-columns: 1fr; }
          .stats-container { grid-template-columns: 1fr; }
          .parking-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      <div className="landing-page">
        <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
          <div className="nav-container">
            <div className="logo">
              <div className="logo-icon"><IcoCar/></div>
              <div className="logo-text">
                <h2>ParkSense</h2>
                <p>SMART PARKING SYSTEM</p>
              </div>
            </div>
            <div className="nav-links">
              <a onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}>Features</a>
              <a onClick={() => document.getElementById("howitworks")?.scrollIntoView({ behavior: "smooth" })}>How It Works</a>
              <button className="btn-login" onClick={() => onNavigate("login")}>Login</button>
              <button className="btn-register" onClick={() => onNavigate("register")}>Sign Up</button>
            </div>
            <div className="mobile-toggle">☰</div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="hero">
          <div className="hero-container">
            <div>
              <div className="hero-badge">
                <div className="hero-badge-dot"/>
                <span>AI-Powered Parking</span>
              </div>
              <h1>Smart Parking for a <span>Smarter City</span></h1>
              <p>Find, book, and pay for parking in seconds. AI-powered recommendations, real-time availability, and contactless entry.</p>
              <div className="hero-buttons">
                <button className="btn-primary" onClick={() => onNavigate("register")}>Get Started</button>
                <button className="btn-secondary" onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}>Learn More</button>
              </div>
            </div>
            <div className="hero-image">
              <div className="parking-grid">
                <div className="parking-slot available">A01</div>
                <div className="parking-slot available">A02</div>
                <div className="parking-slot booked">A03</div>
                <div className="parking-slot available">A04</div>
                <div className="parking-slot booked">B01</div>
                <div className="parking-slot available">B02</div>
                <div className="parking-slot available">B03</div>
                <div className="parking-slot booked">B04</div>
                <div className="parking-slot available">C01</div>
                <div className="parking-slot available">C02</div>
                <div className="parking-slot booked">C03</div>
                <div className="parking-slot available">C04</div>
              </div>
              <p style={{ color: "#6c7a8a", fontSize: 12, marginTop: 12 }}>Live slot availability • Updated in real-time</p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <div className="stats-section">
          <div className="stats-container">
            <div className="stat-item"><div className="stat-value">10K+</div><div className="stat-label">Happy Customers</div></div>
            <div className="stat-item"><div className="stat-value">50+</div><div className="stat-label">Parking Lots</div></div>
            <div className="stat-item"><div className="stat-value">99%</div><div className="stat-label">Satisfaction Rate</div></div>
            <div className="stat-item"><div className="stat-value">&lt;30s</div><div className="stat-label">Booking Time</div></div>
          </div>
        </div>

        {/* Features Section */}
        <section id="features" className="features-section">
          <div className="section-header">
            <h2>Smart Features for Smart Parking</h2>
            <p>Everything you need to park smarter, faster, and easier</p>
          </div>
          <div className="features-grid">
            {features.map((feature, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section id="howitworks" className="steps-section">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Book your parking spot in 3 simple steps</p>
          </div>
          <div className="steps-container">
            <div className="step-card"><div className="step-number">01</div><h3>Choose Location</h3><p>Select your preferred parking lot</p></div>
            <div className="step-card"><div className="step-number">02</div><h3>Pick a Slot</h3><p>Choose an available slot or get AI recommendations</p></div>
            <div className="step-card"><div className="step-number">03</div><h3>Book & Pay</h3><p>Complete your booking and get your QR code</p></div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-container">
            <h2>Ready to Simplify Your Parking?</h2>
            <p>Join thousands of satisfied users who park smarter with ParkSense</p>
            <button className="btn-cta" onClick={() => onNavigate("register")}>Start Parking Smarter →</button>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-container">
            <div className="footer-logo">
              <div className="logo-icon"><IcoCar/></div>
              <p>Smart Parking System with real-time availability, AI recommendations, and contactless QR entry.</p>
            </div>
            <div className="footer-column">
              <h4>Product</h4>
              <a onClick={() => onNavigate("login")}>Login</a>
              <a onClick={() => onNavigate("register")}>Sign Up</a>
              <a onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}>Features</a>
            </div>
            <div className="footer-column">
              <h4>Company</h4>
              <a>About Us</a>
              <a>Contact</a>
            </div>
            <div className="footer-column">
              <h4>Legal</h4>
              <a>Privacy Policy</a>
              <a>Terms of Service</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 ParkSense. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}