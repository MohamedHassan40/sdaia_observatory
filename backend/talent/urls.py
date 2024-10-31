from django.contrib import admin
from django.urls import path, include
from .views import CompanyBlogsViewSet, CompanyNewsViewSet, CompanyProductViewSet, CompanyViewSet, CourseViewSet, EducationViewSet, ExperienceViewSet, LicenseAndCertificationViewSet, LocationViewSet, SkillsViewSet, TweetsViewSet, UserProfileViewSet, EmployeeUrlViewSet

from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'companies', CompanyViewSet, basename='company')
router.register(r'locations', LocationViewSet, basename='location')
router.register(r'tweets', TweetsViewSet, basename='tweet')
router.register(r'news', CompanyNewsViewSet, basename='news')
router.register(r'blogs', CompanyBlogsViewSet, basename='blogs')
router.register(r'products', CompanyProductViewSet, basename='products')
router.register(r'users', UserProfileViewSet, basename='user')
router.register(r'user-urls', EmployeeUrlViewSet, basename='employee_url')
router.register(r'skills', SkillsViewSet, basename='skill')
router.register(r'education', EducationViewSet, basename='education')
router.register(r'experience', ExperienceViewSet, basename='experience')
router.register(r'courses', CourseViewSet, basename='course')
router.register(r'licenseandcertifications', LicenseAndCertificationViewSet, basename='licenseandcertification')

urlpatterns = [
    path('', include(router.urls)),
]
