from django.contrib import admin
from .models import ParkingLot, Booking, Profile

admin.site.register(ParkingLot)
admin.site.register(Booking)
admin.site.register(Profile)