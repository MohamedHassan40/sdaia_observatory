from django.db import models

# Create your models here.

class Source(models.Model):
    uri = models.CharField(max_length=200, unique=True)
    data_type = models.CharField(max_length=50, blank=True, null=True)
    title = models.CharField(max_length=200, blank=True, null=True)

    def __str__(self):
        return str(self.title)


class Article(models.Model):
    uri = models.CharField(max_length=100, primary_key=True)
    lang = models.CharField(max_length=10, blank=True, null=True)
    is_duplicate = models.BooleanField(blank=True, null=True)
    date = models.DateField(blank=True, null=True)
    time = models.TimeField(blank=True, null=True)
    date_time = models.DateTimeField(blank=True, null=True)
    date_time_pub = models.DateTimeField(blank=True, null=True)
    data_type = models.CharField(max_length=50, blank=True, null=True)
    sim = models.FloatField(blank=True, null=True)
    url = models.URLField(max_length=500, blank=True, null=True)
    title = models.TextField(blank=True, null=True)
    body = models.TextField(blank=True, null=True)
    source = models.ForeignKey(
        Source, on_delete=models.CASCADE, blank=True, null=True)
    sentiment = models.FloatField(blank=True, null=True)
    wgt = models.BigIntegerField(blank=True, null=True)
    relevance = models.FloatField(blank=True, null=True)
    image = models.URLField(max_length=500, blank=True, null=True)
    event_uri = models.CharField(max_length=200, blank=True, null=True)

    def __str__(self):
        return str(self.title)
