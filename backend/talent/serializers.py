from rest_framework import serializers
from .models import Company, CompanyBlog, CompanyJobs, CompanySpecialities,  CompanyNewsAndEvents, CompanyProducts, EmployeeUrl, Tweet, TweetSymbol, Location, Address, Skills, Experience, UserProfile, Education, Projects, Courses, VolunteerAndAwards, LicenseAndCertifications, HonorAndAwards, Language


# class FundingRoundSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = FundingRound
#         fields = '__all__'


# class FundingDataSerializer(serializers.ModelSerializer):
#     funding_rounds = FundingRoundSerializer(
#         many=True, read_only=True, source='fundinground_set')  # Adjust the source if needed

#     class Meta:
#         model = FundingData
#         fields = '__all__'  # Ensure it includes 'funding_rounds'


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = '__all__'

class EmployeeUrlSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeUrl
        fields = '__all__'


class TweetSymbolSerializer(serializers.ModelSerializer):
    class Meta:
        model = TweetSymbol
        fields = "__all__"







class CompanyNewsAndEventsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyNewsAndEvents
        fields = '__all__'


class CompanyBlogSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyBlog
        fields = '__all__'


class CompanyJobsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyJobs
        fields = '__all__'


class CompanySpecialtiesSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanySpecialities
        fields = '__all__'


class CompanySerializer(serializers.ModelSerializer):
    locations = LocationSerializer(
        many=True, read_only=True, source='location_set')
    specialities = CompanySpecialtiesSerializer(
        many=True, read_only=True, source='companyspecialities_set')
    # products = CompanyProductSerializer(many=True, read_only=True)
    # news_and_events = CompanyNewsAndEventsSerializer(many=True, read_only=True)
    # jobs = CompanyJobsSerializer(many=True, read_only=True)
    # blogs = CompanyBlogSerializer(many=True, read_only=True)
    # Assuming Company has a one-to-one field named 'funding_data'
    # funding_data = FundingDataSerializer(read_only=True)
    # company_tweets = TweetSerializer(many=True, read_only=True, source='Tweet_set')
    # company_tweet_symbols = TweetSymbolSerializer(
    # many=True, read_only=True)

    class Meta:
        model = Company
        fields = '__all__'

class TweetSerializer(serializers.ModelSerializer):
    symbols = TweetSymbolSerializer(many=True, read_only=True)
    company = CompanySerializer(read_only=True)

    class Meta:
        model = Tweet
        fields = '__all__'



class CompanyProductSerializer(serializers.ModelSerializer):
    company = CompanySerializer(read_only=True)
    company_id = serializers.PrimaryKeyRelatedField(
        queryset=Company.objects.all(), source='company', write_only=True)
    
    class Meta:
        model = CompanyProducts
        fields = '__all__'


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = '__all__'


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skills
        fields = '__all__'


class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = '__all__'


class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = '__all__'
        
class SkillsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skills
        fields = '__all__'

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Projects
        fields = '__all__'


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Courses
        fields = '__all__'


class VolunteerAndAwardsSerializer(serializers.ModelSerializer):
    class Meta:
        model = VolunteerAndAwards
        fields = '__all__'


class LicenseAndCertificationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = LicenseAndCertifications
        fields = '__all__'


class HonorAndAwardsSerializer(serializers.ModelSerializer):
    class Meta:
        model = HonorAndAwards
        fields = '__all__'


class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = '__all__'


class UserProfileSerializer(serializers.ModelSerializer):
    addresses = AddressSerializer(
        many=True, read_only=True, source='address_set')
    skills = SkillSerializer(many=True, read_only=True, source='skill_set')
    experiences = ExperienceSerializer(
        many=True, read_only=True, source='experience_set')
    educations = EducationSerializer(
        many=True, read_only=True, source='education_set')
    projects = ProjectSerializer(
        many=True, read_only=True, source='projects_set')
    courses = CourseSerializer(many=True, read_only=True, source='courses_set')
    volunteer_and_awards = VolunteerAndAwardsSerializer(
        many=True, read_only=True, source='volunteerandawards_set')
    license_and_certifications = LicenseAndCertificationsSerializer(
        many=True, read_only=True, source='licenseandcertifications_set')
    honor_and_awards = HonorAndAwardsSerializer(
        many=True, read_only=True, source='honorandawards_set')
    languages = LanguageSerializer(
        many=True, read_only=True, source='language_set')

    class Meta:
        model = UserProfile
        fields = '__all__'
