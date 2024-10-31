from django.db import models


"""

Company Specific Fields

"""


class Company(models.Model):

    # company type choices
    PRIVATE = 'private'
    PUBLIC = 'public'
    NONPROFIT = 'nonprofit'
    NOT_SPECIFIED = 'not_specified'

    COMPANY_TYPE_CHOICES = [
        (PRIVATE, 'Private'),
        (PUBLIC, 'Public'),
        (NONPROFIT, 'Nonprofit'),
        (NOT_SPECIFIED, 'Not Specified')
    ]

    name = models.CharField(max_length=2000, null=True, blank=True)
    tagline = models.CharField(max_length=2000, null=True, blank=True)
    industry = models.CharField(max_length=2000, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    website_url = models.URLField(max_length=2000,null=True, blank=True)
    logo_url = models.URLField(max_length=2000,null=True, blank=True)
    cover_image_url = models.URLField(max_length=2000,null=True, blank=True)
    linkedin_username = models.CharField(max_length=2000, null=True, blank=True, unique=True)
    founded_year = models.IntegerField( null=True, blank=True)
    employee_count = models.IntegerField( null=True, blank=True)
    company_type = models.CharField(max_length=2000, null=True, blank=True)
    follower_count = models.IntegerField(default=0)
    company_twitter_username = models.CharField(max_length=2000,  blank=True)
    company_twitter_followers = models.IntegerField(default=0)
    company_twitter_id = models.CharField(max_length=2000,  blank=True)
    company_twitter_created_at = models.DateTimeField(null=True,  blank=True)
    company_twitter_description = models.TextField( blank=True)
    is_verified = models.BooleanField(default=False)
    company_type = models.CharField(
        max_length=2000, choices=COMPANY_TYPE_CHOICES, default=PRIVATE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name}"


class CompanySpecialities(models.Model):
    name = models.CharField(max_length=2000)
    company = models.ForeignKey(
        Company, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name}"


class Tweet(models.Model):
    company = models.ForeignKey(
        Company, on_delete=models.CASCADE, null=True, blank=True)
    company_twitter_username = models.CharField(max_length=2000, null=True, blank=True)
    tweet_id = models.CharField(max_length=2000, unique=True)
    created_at = models.DateTimeField()
    added_at = models.DateTimeField()
    full_text = models.TextField(null=True, blank=True)
    favorite_count = models.IntegerField()
    retweet_count = models.IntegerField()
    conversation_id = models.CharField(max_length=2000, null=True, blank=True)
    lang = models.CharField(max_length=10)
    possibly_sensitive = models.BooleanField(default=False)
    quoted_status_id = models.CharField(max_length=2000, null=True, blank=True)
    symbols = models.ManyToManyField(
        'TweetSymbol', related_name='tweet')
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField(auto_now=True)
    # tweet_sentiment = models.TextField()
    # tweet_summary = models.TextField()
    # tweet_flag = models.TextField()

    def __str__(self):
        return f"{self.full_text}"


class TweetSymbol(models.Model):
    symbol = models.CharField(max_length=2000, unique=True)
    times_mentioned = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.symbol}"


class Location(models.Model):
    country = models.CharField(max_length=2000)
    city = models.CharField(max_length=2000)
    geographic_area = models.CharField(max_length=2000,  blank=True)
    postal_code = models.CharField(max_length=2000, null=True, blank=True)
    line1 = models.CharField(max_length=2000, null=True, blank=True)
    line2 = models.CharField(max_length=2000, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    is_headquarter = models.BooleanField(default=False)
    latitude = models.FloatField( null=True, blank=True)
    longitude = models.FloatField( null=True, blank=True)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.city}, {self.country}"


class CompanyProducts(models.Model):

    product_type_choices = [
        ('Software', 'Software'),
        ('Hardware', 'Hardware'),
        ('Service', 'Service'),
        ('Other', 'Other'),
        ("AI", "AI"),
    ]

    badge_type_choices = [
        ("Aware", "Aware"),
        ("Adoptive", "Adoptive"),
        ("Assured", "Assured"),
        ("Conformative", "Conformative"),
        ("Visionary", "Visionary"),
    ]


    title = models.CharField(max_length=2000)
    description = models.TextField(null=True, blank=True)
    product_url = models.URLField(null=True, blank=True)
    image_url = models.URLField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    extra_text = models.TextField(null=True, blank=True)
    company = models.ForeignKey(
        Company, on_delete=models.CASCADE, null=True, blank=True)
    badge = models.CharField(max_length=2000, blank=True, choices=badge_type_choices)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    product_type = models.CharField(
        max_length=2000, choices=product_type_choices, default='Other')

    class Meta:
        unique_together = ('title', 'company')

    def __str__(self):
        return f"{self.title}"


class CompanyNewsAndEvents(models.Model):
    title = models.CharField(max_length=2000)
    description = models.TextField(null=True, blank=True)
    news_url = models.URLField(blank=True, unique=True, max_length=1000)
    image_url = models.URLField(null=True, blank=True, max_length=1000)
    extra_text = models.TextField(null=True, blank=True)
    news_date = models.DateField(null=True, blank=True)
    is_event = models.BooleanField(default=False)
    is_news = models.BooleanField(default=False)
    company = models.ForeignKey(
        Company, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title}"


class CompanyBlog(models.Model):
    title = models.CharField(max_length=2000)
    full_text = models.TextField(null=True, blank=True)
    blog_url = models.URLField(null=True, blank=True, unique=True)
    blog_date = models.DateField( null=True, blank=True)
    image_url = models.URLField(null=True, blank=True)
    extra_text = models.TextField(null=True, blank=True)
    company = models.ForeignKey(
        Company, on_delete=models.CASCADE,  null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title}"


class CompanyJobs(models.Model):
    title = models.CharField(max_length=2000)
    description = models.TextField(null=True, blank=True)
    job_url = models.URLField(null=True, blank=True)
    image_url = models.URLField(null=True, blank=True)
    extra_text = models.TextField(null=True, blank=True)
    company = models.ForeignKey(
        Company, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


"""

User Specific Fields

"""


class Address(models.Model):
    country = models.CharField(max_length=2000, null=True, blank=True)
    city = models.CharField(max_length=2000, null=True, blank=True)
    full_address = models.CharField(max_length=2000, null=True, blank=True)
    user = models.ForeignKey(
        'UserProfile', on_delete=models.CASCADE,  null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.full_address}"


class Experience(models.Model):
    company = models.ForeignKey(
        Company, on_delete=models.CASCADE, null=True, blank=True)
    company_name = models.CharField(max_length=2000, null=True, blank=True)
    company_link = models.CharField(max_length=2000, null=True, blank=True)
    title = models.CharField(max_length=2000)
    description = models.CharField(max_length=2000,null=True, blank=True)
    location = models.CharField(max_length=2000, null=True, blank=True)
    caption = models.CharField(max_length=2000, null=True, blank=True)
    start = models.DateField(blank=True, null=True)
    end = models.DateField(blank=True, null=True)
    employment_type = models.CharField(max_length=2000, null=True, blank=True)
    user = models.ForeignKey(
        'UserProfile', on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title}"

    def save(self, *args, **kwargs):
        # Ensure that at least one of company or company_name is provided
        if not self.company and not self.company_name:
            raise ValueError(
                'Either company or company_name must be provided.')
        super().save(*args, **kwargs)


class Education(models.Model):
    # company = models.ForeignKey(
    # Company, on_delete=models.CASCADE, null=True, blank=True)
    company_link = models.CharField(max_length=2000, null=True, blank=True)
    start = models.DateField(blank=True, null=True)
    end = models.DateField(blank=True, null=True)
    field_of_study = models.CharField(max_length=2000, null=True, blank=True)
    degree = models.CharField(max_length=2000, null=True, blank=True)
    schoolName = models.CharField(max_length=2000, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    user = models.ForeignKey(
        'UserProfile', on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.schoolName} {self.degree}"


class VolunteerAndAwards(models.Model):

    company_link = models.CharField(max_length=2000, blank=True, null=True)
    company_name = models.CharField(max_length=2000, blank=True, null=True)
    title = models.CharField(max_length=2000, null=True, blank=True)
    start = models.DateField(blank=True, null=True)
    end = models.DateField(blank=True, null=True)
    user = models.ForeignKey(
        'UserProfile', on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title}"


class LicenseAndCertifications(models.Model):
    name = models.CharField(max_length=1000, null=True, blank=True)
    start = models.DateField(max_length=2000, null=True, blank=True)
    end = models.DateField(max_length=2000, blank=True)
    authority = models.CharField(max_length=2000, null=True, blank=True)
    user = models.ForeignKey(
        'UserProfile', on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name}"


class HonorAndAwards(models.Model):
    title = models.CharField(max_length=2000, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    issuer = models.CharField(max_length=2000,null=True, blank=True)
    user = models.ForeignKey(
        'UserProfile', on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title}"


class Language(models.Model):
    name = models.CharField(max_length=2000, unique=True)
    times_mentioned = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name}"


class Courses(models.Model):
    name = models.CharField(max_length=2000, null=True, blank=True)
    number = models.CharField(max_length=2000, null=True, blank=True)
    user = models.ForeignKey(
        'UserProfile', on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name}"


class Projects(models.Model):
    title = models.CharField(max_length=2000, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    start = models.DateField(blank=True, null=True)
    end = models.DateField(blank=True, null=True)
    user = models.ForeignKey(
        'UserProfile', on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title}"


class Skills(models.Model):
    name = models.CharField(max_length=2000,null=True, blank=True)
    times_mentioned = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name}"


class EmployeeUrl(models.Model):
    url = models.URLField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.url}"


class UserProfile(models.Model):
    employee_url = models.ForeignKey(
        EmployeeUrl, on_delete=models.CASCADE, null=True, blank=True)
    urn = models.CharField(max_length=2000, unique=True)
    first_name = models.CharField(max_length=2000, null=True, blank=True)
    last_name = models.CharField(max_length=2000, null=True, blank=True)
    user_name = models.CharField(max_length=2000, null=True, blank=True)
    headline = models.CharField(max_length=2000, null=True, blank=True)
    public_identifier = models.CharField(max_length=2000, null=True, blank=True)
    email_required = models.BooleanField(default=False)
    open_connection = models.BooleanField(default=False)
    profile_pic = models.URLField(null=True, blank=True)
    current_company = models.ForeignKey(
        Company, on_delete=models.SET_NULL, null=True, blank=True)
    current_company_name = models.CharField(max_length=2000, null=True, blank=True)
    current_company_link = models.CharField(max_length=2000, null=True, blank=True)
    languages = models.ManyToManyField(Language)
    skills = models.ManyToManyField(Skills)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    employee_data_json = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return str(self.user_name)

    def save(self, *args, **kwargs):
        # Ensure that at least one of current_company or current_company_name is provided
        if not self.current_company and not self.current_company_name:
            raise ValueError(
                'Either current_company or current_company_name must be provided.')
        super().save(*args, **kwargs)
