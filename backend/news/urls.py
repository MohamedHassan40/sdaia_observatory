from django.contrib import admin
from django.urls import path, include
from .views import ArticleViewSet, SourceViewSet

from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'sources', SourceViewSet, basename='source')
router.register(r'articles', ArticleViewSet, basename='article')


urlpatterns = [
    path('', include(router.urls)),
]
