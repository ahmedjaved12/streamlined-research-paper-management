from django.urls import path
from .views import index

urlpatterns = [
    path('', index),
    path('login', index),
    path('register', index),
    path('search', index),
    path('summarize', index),
    path('translate', index),
    path('library', index),
    path('adminlogin', index),
    path('admindashboard', index),
    path('recommendations', index)
]