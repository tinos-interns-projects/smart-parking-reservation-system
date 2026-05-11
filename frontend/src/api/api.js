// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://127.0.0.1:8000/api/",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Auto-attach token from localStorage
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("parking_token");
//     if (token) {
//       config.headers.Authorization = `Token ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Global 401 handler — clear token
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem("parking_token");
//       localStorage.removeItem("parking_user");
//     }
//     return Promise.reject(error);
//   }
// );

// export const loginUser = async (username, password) => {
//   const response = await api.post("login/", { username, password });
//   return response.data;
// };

// export const registerUser = async (username, email, password) => {
//   const response = await api.post("register/", { username, email, password });
//   return response.data;
// };

// export default api;


// src/api/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Auto-attach token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("parking_token");
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global 401 handler — clear token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("parking_token");
      localStorage.removeItem("parking_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ============= AUTHENTICATION APIs =============

export const loginUser = async (username, password) => {
  const response = await api.post("login/", { username, password });
  return response.data;
};

export const registerUser = async (username, email, password) => {
  const response = await api.post("register/", { username, email, password });
  return response.data;
};

// ============= PARKING LOT APIs =============

// Get all parking lots for map display
export const getParkingLots = async () => {
  const response = await api.get("parking-lots/");
  return response.data;
};

// Get slot status for a specific parking lot
export const getSlots = async (lotId) => {
  const response = await api.get(`slots/?parking_lot=${lotId}`);
  return response.data;
};

// ============= SMART RECOMMENDATION API =============

// Get AI-powered slot recommendation
export const getRecommendedSlot = async (parkingLot) => {
  const response = await api.get(`recommend-slot/?parking_lot=${parkingLot}`);
  return response.data;
};

// ============= BOOKING APIs =============

// Predict fee based on duration and parking lot
export const predictFee = async (duration, parkingLot) => {
  const response = await api.post("predict_fee/", {
    duration: Number(duration),
    parking_lot: Number(parkingLot),
  });
  return response.data;
};

// Book a parking slot
export const bookParking = async (duration, parkingLot, slotNumber) => {
  const response = await api.post("book/", {
    duration: Number(duration),
    parking_lot: Number(parkingLot),
    slot_number: Number(slotNumber),
  });
  return response.data;
};

// ============= HISTORY API =============

// Get booking history
export const getHistory = async () => {
  const response = await api.get("history/");
  return response.data;
};

// ============= DASHBOARD STATS API =============

// Get dashboard statistics (if needed separately)
export const getDashboardStats = async () => {
  const response = await api.get("dashboard/stats/");
  return response.data;
};

export default api;