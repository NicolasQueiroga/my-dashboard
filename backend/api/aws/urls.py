from django.urls import path, include
from aws import views

urlpatterns = [
    path('launch/', views.launch),
    path('variables/', views.variables),
]
