# Generated by Django 5.0.6 on 2024-08-14 05:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('talent', '0018_alter_address_city_alter_address_country_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='company',
            name='linkedin_username',
            field=models.CharField(blank=True, max_length=2000, null=True),
        ),
    ]
