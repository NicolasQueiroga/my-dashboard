from django.urls import path, include


urlpatterns = [
    path('api/aws/', include('aws.urls')),

]