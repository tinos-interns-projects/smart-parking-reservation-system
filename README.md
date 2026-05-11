# 🚗 Smart Parking Reservation System

An AI-powered Smart Parking Reservation System developed using Django REST Framework, React.js, and Machine Learning technologies to provide intelligent parking slot booking, parking fee prediction, QR-based booking verification, and smart parking management.

The system is designed to improve parking efficiency, reduce congestion, and enhance user experience through predictive analytics and modern web technologies.

---

# 📌 Features

## 🔐 Authentication System
- User Registration
- Secure User Login
- Token-Based Authentication
- Protected API Access
- Session Management

---

## 🚘 Smart Parking Booking
- Real-Time Parking Slot Booking
- Parking Duration Selection
- Dynamic Slot Availability
- Booking Confirmation System
- Slot Management

---

## 🤖 AI-Based Functionalities

### 1️⃣ Parking Fee Prediction
Machine Learning model predicts parking fees based on:
- Parking duration
- Parking lot selection
- Historical parking data

Technologies Used:
- Scikit-learn
- Pandas
- Joblib

---

### 2️⃣ Smart Slot Recommendation
Automatically recommends the best available parking slot based on:
- Slot availability
- Parking load
- Usage pattern
- Optimization logic

---

## 📷 QR Code Booking Verification
- QR Code generation after successful booking
- Download QR functionality
- Parking verification support
- Booking validation system

---

## 📊 Dashboard & Analytics
- Welcome user section
- Total bookings overview
- Total parking expenditure
- Quick action cards
- User activity insights

---

## 📜 Booking History
- View previous bookings
- Parking details history
- Booking fee details
- QR preview support
- Booking cancellation feature

---

## 👤 User Profile Management
- View profile information
- Update user details
- Profile management
- Account handling

---

# 🛠️ Technology Stack

## Frontend
- React.js
- Vite
- Axios
- Tailwind CSS
- Recharts

---

## Backend
- Django
- Django REST Framework
- SQLite Database

---

## Machine Learning
- Scikit-learn
- Pandas
- NumPy
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
└── .gitignore
```

---

# ⚙️ Installation & Setup

# 1️⃣ Clone Repository

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

---

## Activate Environment

### Windows

```bash
venv\Scripts\activate
```

### Linux / Mac

```bash
source venv/bin/activate
```

---

## Install Dependencies

```bash
pip install -r requirements.txt
```

---

## Run Database Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

---

## Start Backend Server

```bash
python manage.py runserver
```

Backend Server:
```bash
http://127.0.0.1:8000/
```

---

# 💻 Frontend Setup

## Navigate to Frontend Folder

```bash
cd frontend
```

---

## Install Frontend Packages

```bash
npm install
```

---

## Start Frontend Server

```bash
npm run dev
```

Frontend Server:
```bash
http://localhost:5173/
```

---

# 🔗 API Endpoints

## Authentication APIs

### Register User

```http
POST /api/register/
```

### Login User

```http
POST /api/login/
```

---

## Parking APIs

### Predict Parking Fee

```http
POST /api/predict_fee/
```

### Smart Slot Recommendation

```http
GET /api/recommend_slot/
```

### Book Parking Slot

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

# 🧠 Machine Learning Integration

The project integrates Machine Learning models for:
- Parking fee prediction
- Smart slot recommendation
- Intelligent parking management

Models are loaded using:

```python
joblib.load()
```

---

# 🚀 Future Enhancements
- Live parking map integration
- Real-time parking sensor support
- Online payment gateway
- Admin analytics dashboard
- Mobile application integration
- Notification system
- Advanced predictive analytics

---

# 👨‍💻 Developed By

- Mohammed Jaseel TK
- Adhil K

---

# 📄 Project Purpose

This project was developed as an AI-powered smart parking solution for educational, internship, and research purposes focusing on intelligent parking optimization and predictive analytics.

---

# 📜 License

This project is intended for educational and internship purposes only.