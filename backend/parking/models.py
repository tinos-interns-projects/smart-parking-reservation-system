from django.db import models
from django.contrib.auth.models import User


# ==============================
# 🔹 Parking Lot Model
# ==============================
class ParkingLot(models.Model):
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=200)
    total_slots = models.IntegerField()

    def available_slots(self):
        from .models import Booking   # safe import
        booked = Booking.objects.filter(parking_lot=self).count()
        return self.total_slots - booked

    def __str__(self):
        return f"{self.name} ({self.location})"


# ==============================
# 🔹 Booking Model
# ==============================
class Booking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    parking_lot = models.ForeignKey(ParkingLot, on_delete=models.CASCADE)

    slot_number = models.IntegerField()
    duration = models.FloatField()  # in hours

    #  ML predicted fee
    predicted_fee = models.FloatField()

    #  QR code (store as text/base64)
    qr_code = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    #  Status fields
    booking_time = models.DateTimeField(auto_now_add=True)
    is_cancelled = models.BooleanField(default=False)

    #  Optional: status tracking
    status = models.CharField(
        max_length=20,
        choices=[
            ('BOOKED', 'Booked'),
            ('CANCELLED', 'Cancelled'),
            ('COMPLETED', 'Completed')
        ],
        default='BOOKED'
    )

    def __str__(self):
        return f"{self.user.username} - {self.parking_lot.name} - Slot {self.slot_number}"
    
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    avatar = models.ImageField(upload_to='avatars/', default='avatars/default.png')
    phone = models.CharField(max_length=15, blank=True)

    def __str__(self):
        return self.user.username