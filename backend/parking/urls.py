from django.urls import path
from .views import book_parking, register, login, booking_history, cancel_booking, login_page, booking_page, history_page, dashboard_page, success_page, logout_view, profile_page

urlpatterns = [
    path('book/', book_parking),
    path('register/', register),
    path('login/', login),  
    path('history/', booking_history),
    path('cancel/<int:booking_id>/', cancel_booking),
    
    path('login-page/', login_page),
    path('logout/', logout_view),
    path('booking-page/', booking_page),
    path('history-page/', history_page),
    path('success-page/', success_page),
    path('dashboard/', dashboard_page),
    
    path('profile/', profile_page),
    
    
]
