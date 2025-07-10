from django.db import models

# Create your models here.

class University(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    website_url = models.URLField(max_length=500, blank=True, null=True)
    logo_url = models.URLField(max_length=1000, blank=True, null=True)
    cover_image_url = models.URLField(max_length=1000, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
