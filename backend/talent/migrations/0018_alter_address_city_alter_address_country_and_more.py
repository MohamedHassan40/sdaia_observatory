# Generated by Django 5.0.6 on 2024-08-13 06:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('talent', '0017_alter_language_times_mentioned_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='address',
            name='city',
            field=models.CharField(blank=True, max_length=2000, null=True),
        ),
        migrations.AlterField(
            model_name='address',
            name='country',
            field=models.CharField(blank=True, max_length=2000, null=True),
        ),
        migrations.AlterField(
            model_name='address',
            name='full_address',
            field=models.CharField(blank=True, max_length=2000, null=True),
        ),
        migrations.AlterField(
            model_name='company',
            name='company_twitter_id',
            field=models.CharField(blank=True, max_length=2000),
        ),
        migrations.AlterField(
            model_name='company',
            name='company_twitter_username',
            field=models.CharField(blank=True, max_length=2000),
        ),
        migrations.AlterField(
            model_name='company',
            name='company_type',
            field=models.CharField(choices=[('private', 'Private'), ('public', 'Public'), ('nonprofit', 'Nonprofit'), ('not_specified', 'Not Specified')], default='private', max_length=2000),
        ),
        migrations.AlterField(
            model_name='company',
            name='cover_image_url',
            field=models.URLField(blank=True, max_length=2000, null=True),
        ),
        migrations.AlterField(
            model_name='company',
            name='description',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='company',
            name='industry',
            field=models.CharField(blank=True, max_length=2000, null=True),
        ),
        migrations.AlterField(
            model_name='company',
            name='linkedin_username',
            field=models.CharField(blank=True, max_length=2000, null=True, unique=True),
        ),
        migrations.AlterField(
            model_name='company',
            name='logo_url',
            field=models.URLField(blank=True, max_length=2000, null=True),
        ),
        migrations.AlterField(
            model_name='company',
            name='name',
            field=models.CharField(blank=True, max_length=2000, null=True),
        ),
        migrations.AlterField(
            model_name='company',
            name='tagline',
            field=models.CharField(blank=True, max_length=2000, null=True),
        ),
        migrations.AlterField(
            model_name='company',
            name='website_url',
            field=models.URLField(blank=True, max_length=2000, null=True),
        ),
        migrations.AlterField(
            model_name='companyblog',
            name='blog_url',
            field=models.URLField(blank=True, null=True, unique=True),
        ),
        migrations.AlterField(
            model_name='companyblog',
            name='extra_text',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='companyblog',
            name='full_text',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='companyblog',
            name='image_url',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='companyblog',
            name='title',
            field=models.CharField(max_length=2000),
        ),
        migrations.AlterField(
            model_name='companyjobs',
            name='description',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='companyjobs',
            name='extra_text',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='companyjobs',
            name='image_url',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='companyjobs',
            name='job_url',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='companyjobs',
            name='title',
            field=models.CharField(max_length=2000),
        ),
        migrations.AlterField(
            model_name='companynewsandevents',
            name='description',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='companynewsandevents',
            name='extra_text',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='companynewsandevents',
            name='image_url',
            field=models.URLField(blank=True, max_length=1000, null=True),
        ),
        migrations.AlterField(
            model_name='companynewsandevents',
            name='title',
            field=models.CharField(max_length=2000),
        ),
        migrations.AlterField(
            model_name='companyproducts',
            name='badge',
            field=models.CharField(blank=True, choices=[('Aware', 'Aware'), ('Adoptive', 'Adoptive'), ('Assured', 'Assured'), ('Conformative', 'Conformative'), ('Visionary', 'Visionary')], max_length=2000),
        ),
        migrations.AlterField(
            model_name='companyproducts',
            name='description',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='companyproducts',
            name='extra_text',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='companyproducts',
            name='product_type',
            field=models.CharField(choices=[('Software', 'Software'), ('Hardware', 'Hardware'), ('Service', 'Service'), ('Other', 'Other'), ('AI', 'AI')], default='Other', max_length=2000),
        ),
        migrations.AlterField(
            model_name='companyproducts',
            name='product_url',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='companyproducts',
            name='title',
            field=models.CharField(max_length=2000),
        ),
        migrations.AlterField(
            model_name='companyspecialities',
            name='name',
            field=models.CharField(max_length=2000),
        ),
        migrations.AlterField(
            model_name='courses',
            name='name',
            field=models.CharField(blank=True, max_length=2000, null=True),
        ),
        migrations.AlterField(
            model_name='courses',
            name='number',
            field=models.CharField(blank=True, max_length=2000, null=True),
        ),
        migrations.AlterField(
            model_name='education',
            name='company_link',
            field=models.CharField(blank=True, max_length=2000, null=True),
        ),
        migrations.AlterField(
            model_name='education',
            name='degree',
            field=models.CharField(blank=True, max_length=2000, null=True),
        ),
        migrations.AlterField(
            model_name='education',
            name='description',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='education',
            name='field_of_study',
            field=models.CharField(blank=True, max_length=2000, null=True),
        ),
        migrations.AlterField(
            model_name='education',
            name='schoolName',
            field=models.CharField(blank=True, max_length=2000, null=True),
        ),
        migrations.AlterField(
            model_name='experience',
            name='caption',
            field=models.CharField(blank=True, max_length=2000, null=True),
        ),
        migrations.AlterField(
            model_name='experience',
            name='company_link',
            field=models.CharField(blank=True, max_length=2000, null=True),
        ),
        migrations.AlterField(
            model_name='experience',
            name='company_name',
            field=models.CharField(blank=True, max_length=2000, null=True),
        ),
        migrations.AlterField(
            model_name='experience',
            name='description',
            field=models.CharField(blank=True, max_length=2000, null=True),
        ),
        migrations.AlterField(
            model_name='experience',
            name='employment_type',
            field=models.CharField(blank=True, max_length=2000, null=True),
        ),
        migrations.AlterField(
            model_name='experience',
            name='location',
            field=models.CharField(blank=True, max_length=2000, null=True),
        ),
        migrations.AlterField(
            model_name='experience',
            name='title',
            field=models.CharField(max_length=2000),
        ),
        migrations.AlterField(
            model_name='honorandawards',
            name='description',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='honorandawards',
            name='issuer',
            field=models.CharField(blank=True, max_length=2000, null=True),
        ),
        migrations.AlterField(
            model_name='honorandawards',
            name='title',
            field=models.CharField(blank=True, max_length=2000, null=True),
        ),
        migrations.AlterField(
            model_name='language',
            name='name',
            field=models.CharField(max_length=2000, unique=True),
        ),
        migrations.AlterField(
            model_name='licenseandcertifications',
            name='authority',
            field=models.CharField(blank=True, max_length=2000, null=True),
        ),
        migrations.AlterField(
            model_name='licenseandcertifications',
            name='end',
            field=models.DateField(blank=True, max_length=2000),
        ),
        migrations.AlterField(
            model_name='licenseandcertifications',
            name='name',
            field=models.CharField(blank=True, max_length=1000, null=True),
        ),
        migrations.AlterField(
            model_name='licenseandcertifications',
            name='start',
            field=models.DateField(blank=True, max_length=2000, null=True),
        ),
        migrations.AlterField(
            model_name='location',
            name='city',
            field=models.CharField(max_length=2000),
        ),
        migrations.AlterField(
            model_name='location',
            name='country',
            field=models.CharField(max_length=2000),
        ),
        migrations.AlterField(
            model_name='location',
            name='description',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='location',
            name='geographic_area',
            field=models.CharField(blank=True, max_length=2000),
        ),
        migrations.AlterField(
            model_name='location',
            name='line1',
            field=models.CharField(blank=True, max_length=2000, null=True),
        ),
        migrations.AlterField(
            model_name='location',
            name='line2',
            field=models.CharField(blank=True, max_length=2000, null=True),
        ),
        migrations.AlterField(
            model_name='location',
            name='postal_code',
            field=models.CharField(blank=True, max_length=2000, null=True),
        ),
        migrations.AlterField(
            model_name='projects',
            name='description',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='projects',
            name='title',
            field=models.CharField(blank=True, max_length=2000, null=True),
        ),
        migrations.AlterField(
            model_name='skills',
            name='name',
            field=models.CharField(blank=True, max_length=2000, null=True),
        ),
        migrations.AlterField(
            model_name='tweet',
            name='company_twitter_username',
            field=models.CharField(blank=True, max_length=2000, null=True),
        ),
        migrations.AlterField(
            model_name='tweet',
            name='conversation_id',
            field=models.CharField(blank=True, max_length=2000, null=True),
        ),
        migrations.AlterField(
            model_name='tweet',
            name='full_text',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='tweet',
            name='quoted_status_id',
            field=models.CharField(blank=True, max_length=2000, null=True),
        ),
        migrations.AlterField(
            model_name='tweet',
            name='tweet_id',
            field=models.CharField(max_length=2000, unique=True),
        ),
        migrations.AlterField(
            model_name='tweetsymbol',
            name='symbol',
            field=models.CharField(max_length=2000, unique=True),
        ),
        migrations.AlterField(
            model_name='userprofile',
            name='current_company_link',
            field=models.CharField(blank=True, max_length=2000, null=True),
        ),
        migrations.AlterField(
            model_name='userprofile',
            name='current_company_name',
            field=models.CharField(blank=True, max_length=2000, null=True),
        ),
        migrations.AlterField(
            model_name='userprofile',
            name='first_name',
            field=models.CharField(blank=True, max_length=2000, null=True),
        ),
        migrations.AlterField(
            model_name='userprofile',
            name='headline',
            field=models.CharField(blank=True, max_length=2000, null=True),
        ),
        migrations.AlterField(
            model_name='userprofile',
            name='last_name',
            field=models.CharField(blank=True, max_length=2000, null=True),
        ),
        migrations.AlterField(
            model_name='userprofile',
            name='profile_pic',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='userprofile',
            name='public_identifier',
            field=models.CharField(blank=True, max_length=2000, null=True),
        ),
        migrations.AlterField(
            model_name='userprofile',
            name='urn',
            field=models.CharField(max_length=2000, unique=True),
        ),
        migrations.AlterField(
            model_name='userprofile',
            name='user_name',
            field=models.CharField(blank=True, max_length=2000, null=True),
        ),
        migrations.AlterField(
            model_name='volunteerandawards',
            name='company_link',
            field=models.CharField(blank=True, max_length=2000, null=True),
        ),
        migrations.AlterField(
            model_name='volunteerandawards',
            name='company_name',
            field=models.CharField(blank=True, max_length=2000, null=True),
        ),
        migrations.AlterField(
            model_name='volunteerandawards',
            name='title',
            field=models.CharField(blank=True, max_length=2000, null=True),
        ),
    ]
