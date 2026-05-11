from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login as auth_login, logout
from django.contrib.auth.decorators import login_required

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token

from django.shortcuts import render, redirect
from django.db.models import Sum, Count
from django.db.models.functions import TruncDate
from datetime import datetime
from .models import Booking, ParkingLot, Profile

import joblib
import pandas as pd
import json
import qrcode
from io import BytesIO
import base64


# =========================
# LOAD ML MODEL
# =========================
model = joblib.load('parking/model/parking_model.pkl')
model_columns = joblib.load('parking/model/model_columns.pkl')


# =========================
# REGISTER API
# =========================
@api_view(['POST'])
def register(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    if not username or not password:
        return Response({"error": "Missing data"}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({"error": "User already exists"}, status=400)

    user = User.objects.create_user(
        username=username,
        email=email,
        password=password
    )

    token = Token.objects.create(user=user)

    return Response({
        "message": "User created",
        "token": token.key
    })

# =========================
# LOGIN API (FIXED)
# =========================
@api_view(['POST'])
def login(request):
    username = request.data.get('username')   # ✅ FIX
    password = request.data.get('password')

    user = authenticate(username=username, password=password)

    if user is not None:
        token, _ = Token.objects.get_or_create(user=user)

        return Response({
            "message": "Login successful",
            "token": token.key,
            "username": user.username
        })
    else:
        return Response({
            "error": "Invalid username or password"
        }, status=400)


# =========================
# PREDICT API
# =========================
@api_view(['POST'])
def predict_fee(request):
    try:
        duration = request.data.get('duration')
        parking_lot = request.data.get('parking_lot')

        if duration is None or parking_lot is None:
            return Response({"error": "Missing data"}, status=400)

        duration = float(duration)

        input_data = pd.DataFrame(columns=model_columns)
        input_data.loc[0] = 0
        input_data['Duration'] = duration

        col_name = f"ParkingLotID_{parking_lot}"

        if col_name in input_data.columns:
            input_data[col_name] = 1
        else:
            return Response({"error": "Invalid parking lot"}, status=400)

        input_data = input_data[model_columns]

        prediction = model.predict(input_data)[0]

        return Response({
            "predicted_fee": round(float(prediction), 2)
        })

    except Exception as e:
        return Response({"error": str(e)}, status=500)


# =========================
# QR GENERATOR
# =========================
def generate_qr(data):
    qr = qrcode.make(data)
    buffer = BytesIO()
    qr.save(buffer, format="PNG")
    return base64.b64encode(buffer.getvalue()).decode()


# =========================
# BOOKING API
# =========================
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def book_parking(request):
    try:
        duration = float(request.data.get('duration'))
        parking_lot_id = int(request.data.get('parking_lot'))
        slot_number = int(request.data.get('slot_number'))

        parking_lot = ParkingLot.objects.get(id=parking_lot_id)

        input_data = pd.DataFrame(columns=model_columns)
        input_data.loc[0] = 0
        input_data['Duration'] = duration

        col_name = f"ParkingLotID_{parking_lot.id}"
        if col_name in input_data.columns:
            input_data[col_name] = 1

        input_data = input_data[model_columns]

        predicted_fee = round(float(model.predict(input_data)[0]), 2)

        qr_data = f"User:{request.user.username}, Lot:{parking_lot.name}, Slot:{slot_number}, Duration:{duration}"
        qr_base64 = generate_qr(qr_data)

        booking = Booking.objects.create(
            user=request.user,
            parking_lot=parking_lot,
            slot_number=slot_number,
            duration=duration,
            predicted_fee=predicted_fee,
            qr_code=qr_base64
        )

        return Response({
            "message": "Booking Successful",
            "booking_id": booking.id,
            "qr_code": qr_base64
        })

    except Exception as e:
        return Response({"error": str(e)}, status=500)


# =========================
# BOOKING HISTORY
# =========================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def booking_history(request):
    bookings = Booking.objects.filter(user=request.user)

    data = []
    for b in bookings:
        data.append({
            "id": b.id,
            "parking_lot": b.parking_lot.name,
            "slot_number": b.slot_number,
            "duration": b.duration,
            "predicted_fee": b.predicted_fee,
            "qr_code": b.qr_code
        })

    return Response(data)


@api_view(['GET'])
def dashboard_api(request):
    total_bookings = Booking.objects.count()
    total_users = User.objects.count()

    total_revenue = Booking.objects.aggregate(
        Sum('predicted_fee')
    )['predicted_fee__sum'] or 0

    return Response({
        "total_bookings": total_bookings,
        "total_users": total_users,
        "total_revenue": total_revenue
    })

# SMART SLOT RECOMMENDATION
# =========================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def recommend_slot(request):
    try:
        parking_lot_id = request.GET.get("parking_lot")

        if not parking_lot_id:
            return Response({"error": "Parking lot required"}, status=400)

        # Get booked slots for this parking lot
        booked_slots = Booking.objects.filter(
            parking_lot_id=parking_lot_id
        ).values_list("slot_number", flat=True)

        # Assume slots from 1 to 100
        all_slots = set(range(1, 101))

        # Find available slots
        available_slots = list(all_slots - set(booked_slots))

        if not available_slots:
            return Response({"error": "No slots available"}, status=400)

        # 🧠 SIMPLE AI LOGIC (Time-based)
        current_hour = datetime.now().hour

        if current_hour < 12:
            # Morning → choose smallest slot
            recommended = min(available_slots)
        elif current_hour < 18:
            # Afternoon → middle slot
            recommended = available_slots[len(available_slots)//2]
        else:
            # Evening → largest slot
            recommended = max(available_slots)

        return Response({
            "recommended_slot": recommended,
            "available_count": len(available_slots)
        })

    except Exception as e:
        return Response({"error": str(e)}, status=500)

    
# =========================
# TEMPLATE LOGIN PAGE
# =========================
def login_page(request):
    if request.method == "POST":
        user = authenticate(
            username=request.POST.get("username"),
            password=request.POST.get("password")
        )

        if user:
            auth_login(request, user)
            return redirect("/api/booking-page/")
        else:
            return render(request, "login.html", {"error": "Invalid credentials"})

    return render(request, "login.html")


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def cancel_booking(request, booking_id):
    try:
        booking = Booking.objects.get(
            id=booking_id,
            user=request.user
        )
        booking.delete()

        return Response({"message": "Booking cancelled"})

    except Booking.DoesNotExist:
        return Response({"error": "Not found"}, status=404)
    
@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def profile_api(request):

    profile, created = Profile.objects.get_or_create(user=request.user)

    # ✅ GET PROFILE DATA
    if request.method == "GET":
        return Response({
            "username": request.user.username,
            "email": request.user.email,
            "phone": profile.phone,
            "avatar": profile.avatar.url if profile.avatar else None
        })

    # ✅ UPDATE PROFILE
    if request.method == "PUT":
        request.user.email = request.data.get('email', request.user.email)
        profile.phone = request.data.get('phone', profile.phone)

        if request.FILES.get('avatar'):
            profile.avatar = request.FILES.get('avatar')

        request.user.save()
        profile.save()

        return Response({
            "message": "Profile updated successfully"
        })


# =========================
# LOGOUT
# =========================
def logout_view(request):
    logout(request)
    return redirect('/api/login-page/')

@login_required
def cancel_booking(request, booking_id):
    try:
        booking = Booking.objects.get(
            id=booking_id,
            user=request.user
        )
        booking.delete()
    except Booking.DoesNotExist:
        return redirect('/api/history-page/?error=notfound')

    return redirect('/api/history-page/')