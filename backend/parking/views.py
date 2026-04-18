from django.contrib.auth.models import User
from django.http import HttpResponse
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, login as auth_login, logout

import joblib
import pandas as pd
import json
import qrcode
from io import BytesIO
import base64
from .models import Booking, ParkingLot, Profile
from django.db.models import Sum, Count, Max
from django.db.models.functions import TruncDate



from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.decorators import login_required  

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

# Load model + columns
model = joblib.load('parking/model/parking_model.pkl')
model_columns = joblib.load('parking/model/model_columns.pkl')


#prediction api

@api_view(['POST'])
def predict_fee(request):
    try:
        duration = request.data.get('duration')
        parking_lot = request.data.get('parking_lot')

        # Validate input
        if duration is None or parking_lot is None:
            return Response({"error": "Missing data"}, status=400)

        duration = float(duration)

        # Create empty dataframe with same columns
        input_data = pd.DataFrame(columns=model_columns)
        input_data.loc[0] = 0

        # Set duration
        input_data['Duration'] = duration

        # Set parking lot (one-hot encoding)
        col_name = f"ParkingLotID_{parking_lot}"

        if col_name in input_data.columns:
            input_data[col_name] = 1
        else:
            return Response({"error": "Invalid parking lot"}, status=400)

        # Ensure correct column order
        input_data = input_data[model_columns]

        # Predict
        prediction = model.predict(input_data)[0]

        return Response({
            "predicted_fee": round(float(prediction), 2)
        })

    except Exception as e:
        return Response({"error": str(e)}, status=500)


# Booking API with QR code generation

def generate_qr(data):
    qr = qrcode.make(data)
    buffer = BytesIO()
    qr.save(buffer, format="PNG")
    return base64.b64encode(buffer.getvalue()).decode()



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def book_parking(request):
    try:
        # Support BOTH API + HTML form
        duration = request.data.get('duration') or request.POST.get('duration')
        parking_lot_id = request.data.get('parking_lot') or request.POST.get('parking_lot')
        slot_number = request.data.get('slot_number') or request.POST.get('slot_number')

        #  Validate input
        if not duration or not parking_lot_id or not slot_number:
            return Response({"error": "Missing data"}, status=400)

        #  Convert types
        try:
            duration = float(duration)
            parking_lot_id = int(parking_lot_id)   # FIX
            slot_number = int(slot_number)
        except:
            return Response({"error": "Invalid input types"}, status=400)

        #  Get ParkingLot
        try:
            parking_lot = ParkingLot.objects.get(id=parking_lot_id)
        except ParkingLot.DoesNotExist:
            return Response({"error": "Parking lot not found"}, status=404)

        # Prepare ML input
        input_data = pd.DataFrame(columns=model_columns)
        input_data.loc[0] = 0

        input_data['Duration'] = duration

        #  IMPORTANT FIX (use ID, not name)
        col_name = f"ParkingLotID_{parking_lot.id}"

        if col_name in input_data.columns:
            input_data[col_name] = 1
        # else: do nothing

        input_data = input_data[model_columns]

        #  Predict fee
        prediction = model.predict(input_data)[0]
        predicted_fee = round(float(prediction), 2)

        #  Generate QR Code
        qr_data = f"""
        User: {request.user.username}
        Lot: {parking_lot.name}
        Slot: {slot_number}
        Duration: {duration} hrs
        Fee: {predicted_fee}
        """
        qr_data = f"User:{request.user.username}, Lot:{parking_lot.name}, Slot:{slot_number}, Duration:{duration}"

        qr = qrcode.make(qr_data)
        buffer = BytesIO()
        qr.save(buffer, format="PNG")
        qr_base64 = base64.b64encode(buffer.getvalue()).decode()
        print("QR LENGTH:", len(qr_base64))

        #  Save Booking
        booking = Booking.objects.create(
            user=request.user,
            parking_lot=parking_lot,
            slot_number=slot_number,
            duration=duration,
            predicted_fee=predicted_fee,
            qr_code=qr_base64
        )

        #  Response
        return Response({
            "message": "Booking Successful",
            "booking_id": booking.id,
            "parking_lot": parking_lot.name,
            "slot_number": slot_number,
            "duration": duration,
            "predicted_fee": predicted_fee,
            "qr_code": qr_base64
        })

    except Exception as e:
        return Response({"error": str(e)}, status=500)
    
@api_view(['POST'])
def register(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({"error": "Missing data"}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({"error": "User already exists"}, status=400)

    user = User.objects.create_user(username=username, password=password)
    token = Token.objects.create(user=user)

    return Response({
        "message": "User created",
        "token": token.key
    })
    
@api_view(['POST'])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)
    Profile.objects.create(user=user)

    if user is None:
        return Response({"error": "Invalid credentials"}, status=400)

    token, _ = Token.objects.get_or_create(user=user)

    return Response({
        "message": "Login successful",
        "token": token.key
    })
    
    from rest_framework.permissions import IsAuthenticated

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

@login_required
def cancel_booking(request, booking_id):
    try:
        booking = Booking.objects.get(
            id=booking_id,
            user=request.user   # 🔐 important security check
        )
        booking.delete()
    except Booking.DoesNotExist:
        return redirect('/api/history-page/?error=notfound')

    return redirect('/api/history-page/')

def login_page(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")

        user = authenticate(username=username, password=password)

        if user:
            auth_login(request, user)   # SESSION LOGIN
            return redirect("/api/booking-page/")
        else:
            return render(request, "login.html", {"error": "Invalid credentials"})

    return render(request, "login.html")



@login_required
def booking_page(request):
    lots = ParkingLot.objects.all()

    # 👉 Add available count for UI
    for lot in lots:
        booked = Booking.objects.filter(parking_lot=lot).count()
        lot.available = lot.total_slots - booked

    if request.method == "POST":
        try:
            duration = float(request.POST.get('duration'))
            parking_lot_id = int(request.POST.get('parking_lot'))
            slot_number = int(request.POST.get('slot_number'))

            parking_lot = ParkingLot.objects.get(id=parking_lot_id)

            # 🚀 GET BOOKED SLOTS
            booked_slots = Booking.objects.filter(
                parking_lot=parking_lot
            ).values_list('slot_number', flat=True)

            # ❌ SLOT ALREADY BOOKED
            if slot_number in booked_slots:
                return render(request, "booking.html", {
                    "lots": lots,
                    "error": "❌ Slot already booked. Choose another slot."
                })

            # ❌ INVALID SLOT NUMBER
            if slot_number < 1 or slot_number > parking_lot.total_slots:
                return render(request, "booking.html", {
                    "lots": lots,
                    "error": "❌ Invalid slot number."
                })

            # ✅ AVAILABLE SLOTS (FOR DISPLAY)
            all_slots = set(range(1, parking_lot.total_slots + 1))
            available_slots = sorted(all_slots - set(booked_slots))

            # 🤖 ML INPUT
            input_data = pd.DataFrame(columns=model_columns)
            input_data.loc[0] = 0
            input_data['Duration'] = duration

            col_name = f"ParkingLotID_{parking_lot.id}"
            if col_name in input_data.columns:
                input_data[col_name] = 1

            input_data = input_data[model_columns]

            prediction = model.predict(input_data)[0]
            predicted_fee = round(float(prediction), 2)

            # 🔳 QR CODE
            qr_data = f"User:{request.user.username}, Lot:{parking_lot.name}, Slot:{slot_number}, Duration:{duration}"
            qr_base64 = generate_qr(qr_data)

            # 💾 SAVE BOOKING
            booking = Booking.objects.create(
                user=request.user,
                parking_lot=parking_lot,
                slot_number=slot_number,
                duration=duration,
                predicted_fee=predicted_fee,
                qr_code=qr_base64
            )

            # ✅ SUCCESS PAGE
            return render(request, "success.html", {
                "booking": booking
            })

        except Exception as e:
            return render(request, "booking.html", {
                "lots": lots,
                "error": str(e)
            })

    # 👉 Default GET request
    return render(request, "booking.html", {
        "lots": lots
    })
    
def history_page(request):
    bookings = Booking.objects.all()
    return render(request, 'history.html', {'bookings': bookings})

def success_page(request):
    return render(request, 'success.html')

def dashboard_page(request):
    # Stats
    total_bookings = Booking.objects.count()
    total_users = User.objects.count()
    total_revenue = Booking.objects.aggregate(
        Sum('predicted_fee')
    )['predicted_fee__sum'] or 0
    total_revenue = round(total_revenue, 2)

    # Parking data
    parking_lots = ParkingLot.objects.all()
    parking_data = []

    for lot in parking_lots:
        booked = Booking.objects.filter(parking_lot=lot).count()
        available = lot.total_slots - booked

        parking_data.append({
            "name": lot.name,
            "location": lot.location,
            "total_slots": lot.total_slots,
            "available": available
        })

    # Recent bookings
    bookings = Booking.objects.select_related(
        'user', 'parking_lot'
    ).order_by('-id')[:5]

    # 📊 CHART DATA
    chart_data = Booking.objects.annotate(
        date=TruncDate('created_at')
    ).values('date').annotate(
        count=Count('id'),
        revenue=Sum('predicted_fee')
    ).order_by('date')

    dates = [str(i['date']) for i in chart_data]
    counts = [i['count'] for i in chart_data]
    revenue = [float(i['revenue'] or 0) for i in chart_data]

    return render(request, 'dashboard.html', {
        "total_bookings": total_bookings,
        "total_users": total_users,
        "total_revenue": total_revenue,
        "parking_data": parking_data,
        "bookings": bookings,
        "dates": json.dumps(dates),     
        "counts": json.dumps(counts),   
        "revenue": json.dumps(revenue)  
    })
    
def logout_view(request):
    logout(request)
    return redirect('/api/login-page/')

@login_required
def profile_page(request):
    profile, created = Profile.objects.get_or_create(user=request.user)

    if request.method == "POST":
        request.user.email = request.POST.get('email')
        profile.phone = request.POST.get('phone')

        if request.FILES.get('avatar'):
            profile.avatar = request.FILES.get('avatar')

        request.user.save()
        profile.save()

        return redirect('/api/profile/')

    return render(request, 'profile.html', {
        'profile': profile
    })

    
