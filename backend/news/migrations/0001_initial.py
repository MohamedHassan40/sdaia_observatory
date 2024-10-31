# Generated by Django 5.0.4 on 2024-07-01 13:38

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Source',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('uri', models.CharField(max_length=200, unique=True)),
                ('data_type', models.CharField(blank=True, max_length=50, null=True)),
                ('title', models.CharField(blank=True, max_length=200, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Article',
            fields=[
                ('uri', models.CharField(max_length=100, primary_key=True, serialize=False)),
                ('lang', models.CharField(blank=True, max_length=10, null=True)),
                ('is_duplicate', models.BooleanField(blank=True, null=True)),
                ('date', models.DateField(blank=True, null=True)),
                ('time', models.TimeField(blank=True, null=True)),
                ('date_time', models.DateTimeField(blank=True, null=True)),
                ('date_time_pub', models.DateTimeField(blank=True, null=True)),
                ('data_type', models.CharField(blank=True, max_length=50, null=True)),
                ('sim', models.FloatField(blank=True, null=True)),
                ('url', models.URLField(blank=True, max_length=500, null=True)),
                ('title', models.TextField(blank=True, null=True)),
                ('body', models.TextField(blank=True, null=True)),
                ('sentiment', models.FloatField(blank=True, null=True)),
                ('wgt', models.BigIntegerField(blank=True, null=True)),
                ('relevance', models.FloatField(blank=True, null=True)),
                ('image', models.URLField(blank=True, max_length=500, null=True)),
                ('event_uri', models.CharField(blank=True, max_length=200, null=True)),
                ('source', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='news.source')),
            ],
        ),
    ]
