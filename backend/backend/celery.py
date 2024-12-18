import os
from celery import Celery
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

app = Celery('backend')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()




app.conf.beat_schedule = {
    'call_api_every_15_minutes': {
        'task': 'talent.tasks.call_api',
        'schedule': crontab(minute='*/1'),
    },
}
