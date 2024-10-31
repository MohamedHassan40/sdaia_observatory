# Create your tasks here

# from demoapp.models import Widget

from celery import shared_task

import requests


@shared_task
def add(x, y):
    return x + y


@shared_task
def mul(x, y):
    return x * y


@shared_task
def xsum(numbers):
    return sum(numbers)

@shared_task
def call_api():
    response = requests.get("https://www.fluxterminal.com/api/top-users")
    print(response.text)
    # Process your response if necessary
    return response.text


# @shared_task
# def count_widgets():
#     return Widget.objects.count()


# @shared_task
# def rename_widget(widget_id, name):
#     w = Widget.objects.get(id=widget_id)
#     w.name = name
#     w.save()