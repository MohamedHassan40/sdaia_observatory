from django.contrib import admin
from .models import (Company, Location, Address, Skills, Experience, UserProfile,
                     Education, CompanyBlog, CompanyJobs, CompanyNewsAndEvents,
                     CompanyProducts, Tweet, TweetSymbol, Language,
                     LicenseAndCertifications, EmployeeUrl, VolunteerAndAwards, HonorAndAwards, Courses, Projects)


class CompanyAdmin(admin.ModelAdmin):
    list_display = ('name', 'industry', 'linkedin_username','id')
    search_fields = ('name', 'industry','linkedin_username')


class LocationAdmin(admin.ModelAdmin):
    list_display = ('country', 'city', 'company')
    list_filter = ('country', 'company')


class SkillsAdmin(admin.ModelAdmin):
    list_display = ('name',)


class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'email_required')
    search_fields = ('first_name', 'last_name')


class ExperienceAdmin(admin.ModelAdmin):
    list_display = ('user', 'title', 'company_name', 'start', 'end')
    list_filter = ('company_name',)


class EducationAdmin(admin.ModelAdmin):
    list_display = ('user', 'schoolName', 'field_of_study', 'degree')
    search_fields = ('schoolName', 'field_of_study')


class CompanyBlogAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_at')
    search_fields = ('title',)


class CompanyJobsAdmin(admin.ModelAdmin):
    list_display = ('title', 'company', 'created_at')
    search_fields = ('title', 'company')


class CompanyNewsAndEventsAdmin(admin.ModelAdmin):
    list_display = ('title', 'company', 'news_date', 'is_event')
    list_filter = ('is_event', 'news_date')


class CompanyProductsAdmin(admin.ModelAdmin):
    list_display = ('title', 'company','badge')
    search_fields = ('title',)


class TweetAdmin(admin.ModelAdmin):
    list_display = ('tweet_id', "full_text", 'company', 'created_at')
    list_filter = ('company',)


class LanguageAdmin(admin.ModelAdmin):
    list_display = ('name',)


class LicenseAndCertificationsAdmin(admin.ModelAdmin):
    list_display = ('name', 'authority', 'start', 'end')
    list_filter = ('authority',)


class VolunteerAndAwardsAdmin(admin.ModelAdmin):
    list_display = ('title',  'start', 'end')


class HonorAndAwardsAdmin(admin.ModelAdmin):
    list_display = ('title', 'issuer', 'user')
    search_fields = ('title', 'issuer')


class CoursesAdmin(admin.ModelAdmin):
    list_display = ('name', 'number')


class ProjectsAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'start', 'end')
    search_fields = ('title',)


# Register models with custom admin classes
admin.site.register(Company, CompanyAdmin)
admin.site.register(Location, LocationAdmin)
admin.site.register(Address)
admin.site.register(Skills, SkillsAdmin)
admin.site.register(Experience, ExperienceAdmin)
admin.site.register(UserProfile, UserProfileAdmin)
admin.site.register(EmployeeUrl)
admin.site.register(Education, EducationAdmin)
admin.site.register(CompanyBlog, CompanyBlogAdmin)
admin.site.register(CompanyJobs, CompanyJobsAdmin)
admin.site.register(CompanyNewsAndEvents, CompanyNewsAndEventsAdmin)
admin.site.register(CompanyProducts, CompanyProductsAdmin)
admin.site.register(Tweet, TweetAdmin)
admin.site.register(TweetSymbol)
admin.site.register(Language, LanguageAdmin)
admin.site.register(LicenseAndCertifications, LicenseAndCertificationsAdmin)
admin.site.register(VolunteerAndAwards, VolunteerAndAwardsAdmin)
admin.site.register(HonorAndAwards, HonorAndAwardsAdmin)
admin.site.register(Courses, CoursesAdmin)
admin.site.register(Projects, ProjectsAdmin)
