# Generated by Django 5.0.4 on 2024-07-04 09:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('talent', '0015_alter_tweet_created_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='companyproducts',
            name='badge',
            field=models.CharField(blank=True, choices=[('Aware', 'Aware'), ('Adoptive', 'Adoptive'), ('Assured', 'Assured'), ('Conformative', 'Conformative'), ('Visionary', 'Visionary')], max_length=255),
        ),
    ]
