from django.shortcuts import render
from rest_framework import viewsets
from .models import University
from .serializers import UniversitySerializer

# Create your views here.

class UniversityViewSet(viewsets.ModelViewSet):
    queryset = University.objects.all().order_by('-created_at')
    serializer_class = UniversitySerializer
