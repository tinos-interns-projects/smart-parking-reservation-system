# 🚗 Smart Parking Reservation System

An AI-powered Smart Parking Reservation System built using Django REST Framework and React.js.  
The system allows users to reserve parking slots, predict parking fees using Machine Learning, generate QR-based booking verification, and manage bookings in real time.

---

# 📌 Features

## 🔐 Authentication
- User Registration
- User Login
- Token-based Authentication
- Secure API Integration

---

## 🚘 Parking Booking
- Real-time Parking Slot Booking
- Smart Slot Recommendation (AI)
- Parking Duration Selection
- Dynamic Slot Availability
- Booking Confirmation

---

## 🤖 AI-Based Features
### 1. Parking Fee Prediction
- Machine Learning model predicts parking fees
- Uses parking lot + duration data
- Built with Scikit-learn

### 2. Smart Slot Recommendation
- Suggests best available slot automatically
- Based on:
  - Availability
  - Slot usage
  - Parking load

---

## 📷 QR Code System
- QR Code generated after booking
- Download QR option
- Used for parking verification

---

## 📊 Dashboard
- Welcome user section
- Total bookings
- Total amount spent
- Booking analytics
- Quick action cards

---

## 📜 Booking History
- View all previous bookings
- Booking details
- Cancel booking option
- QR preview

---

## 👤 User Profile
- Profile information
- Email & phone update
- Avatar upload support
- Logout functionality

---

# 🛠️ Tech Stack

## Frontend
- React.js
- Vite
- Axios
- Tailwind CSS
- Recharts

## Backend
- Django
- Django REST Framework
- SQLite

## AI / ML
- Scikit-learn
- Pandas
- Joblib

---

# 📂 Project Structure

```bash
Smart-Parking-Reservation-System/
│
├── backend/
│   ├── config/
│   ├── parking/
│   ├── manage.py
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│
├── requirements.txt
├── README.md
```

---

# ⚙️ Installation

## 1️⃣ Clone Repository

```bash
git clone <repository-url>
cd Smart-Parking-Reservation-System
```

---

# 🔧 Backend Setup

## Create Virtual Environment

```bash
python -m venv venv
```

## Activate Environment

### Windows

```bash
venv\Scripts\activate
```

### Linux/Mac

```bash
source venv/bin/activate
```

---

## Install Dependencies

```bash
pip install -r requirements.txt
```

---

## Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

---

## Start Backend Server

```bash
python manage.py runserver
```

Backend runs on:

```bash
http://127.0.0.1:8000/
```

---

# 💻 Frontend Setup

## Navigate to Frontend

```bash
cd frontend
```

---

## Install Packages

```bash
npm install
```

---

## Start Frontend

```bash
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173/
```

---

# 🔗 API Endpoints

## Authentication

### Register

```http
POST /api/register/
```

### Login

```http
POST /api/login/
```

---

## Parking

### Predict Fee

```http
POST /api/predict_fee/
```

### Recommend Slot

```http
GET /api/recommend_slot/
```

### Book Parking

```http
POST /api/book/
```

### Booking History

```http
GET /api/history/
```

### Cancel Booking

```http
DELETE /api/cancel-booking/<id>/
```

---

# 🧠 Machine Learning

The project uses a trained Scikit-learn model for:

- Parking fee prediction
- Smart slot recommendation

Model files are loaded using:

```python
joblib.load()
```

---

# 📸 Screenshots

## Login Page
Modern authentication UI with token-based login.

## Dashboard
Analytics cards with booking insights.

## Booking Page
AI-powered parking booking interface.

## QR Verification
Generated QR after successful booking.

---

# 🚀 Future Improvements

- Live parking map integration
- Real-time sensor tracking
- Online payment gateway
- Admin analytics dashboard
- Mobile app support

---

# 👨‍💻 Developed By

Mohammed Jaseel

---

# 📄 License

This project is developed for educational and internship purposes.