

// src/App.js
import { useState, useEffect } from "react";
import Login     from "./pages/Login";
import Register  from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Booking   from "./pages/Booking";
import History   from "./pages/History";
import Profile   from "./pages/Profile";
import LandingPage from "./pages/LandingPage";

export default function App() {
  const [page, setPage]           = useState("landing");
  const [avatarUrl, setAvatarUrl] = useState(() => localStorage.getItem("parking_avatar") || "");
  const [bookingPrefill, setBookingPrefill] = useState(null);

  // Restore session - if logged in, go to dashboard
  useEffect(() => {
    const token = localStorage.getItem("parking_token");
    if (token && page === "landing") {
      setPage("dashboard");
    }
  }, [page]);

  const navigate = (dest, params = null) => {
    if (dest === "booking" && params) {
      setBookingPrefill(params);
    } else {
      setBookingPrefill(null);
    }
    setPage(dest);
  };

  const handleAvatarUpdate = (url) => {
    setAvatarUrl(url);
    localStorage.setItem("parking_avatar", url);
  };

  const sharedProps = { 
    onNavigate: navigate, 
    avatarUrl,
    ...(bookingPrefill && { 
      preSelectedLotId: bookingPrefill.parkingLotId,
      preSelectedSlotNumber: bookingPrefill.slotNumber 
    })
  };

  switch (page) {
    case "landing":   return <LandingPage onNavigate={navigate} />;
    case "login":     return <Login {...sharedProps} />;
    case "register":  return <Register {...sharedProps} />;
    case "dashboard": return <Dashboard {...sharedProps} />;
    case "booking":   return <Booking {...sharedProps} />;
    case "history":   return <History {...sharedProps} />;
    case "profile":   return <Profile {...sharedProps} onAvatarUpdate={handleAvatarUpdate} />;
    default:          return <LandingPage onNavigate={navigate} />;
  }
}