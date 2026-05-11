from django.urls import path
from .views import *

urlpatterns = [
    path('book/', book_parking),
    path('dashboard/', dashboard_api),
    path('register/', register),
    path('login/', login),  
    path('predict_fee/', predict_fee), 
    path('history/', booking_history),
    path('profile/', profile_api),
    path('recommend-slot/', recommend_slot),
    path('cancel/<int:booking_id>/', cancel_booking),
    
    # template views
    path('login-page/', login_page),
    path('logout/', logout_view),
    path('profile-api/', profile_api),
     
]
