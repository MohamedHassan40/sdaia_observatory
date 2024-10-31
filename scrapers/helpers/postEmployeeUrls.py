import requests
from dotenv import load_dotenv, find_dotenv
import os
import json

env = find_dotenv()


load_dotenv(env)


def get_urls_from_file_and_save_to_db():
    with open("em.json", "r") as f:
        data = json.load(f)
        employee_urls = data['data']
        for employee_url in employee_urls:
            api_url = os.getenv("BACKEND_URL") + "/api/v1/talent/user-urls/"
            response = requests.post(api_url, json={"url": employee_url})


get_urls_from_file_and_save_to_db()
