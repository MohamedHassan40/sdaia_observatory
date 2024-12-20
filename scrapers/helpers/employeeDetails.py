import requests
from dotenv import load_dotenv, find_dotenv
import os
import json

env = find_dotenv()
load_dotenv(env)
 
def get_urls_from_file_and_save_to_db():
    print("Loading URLs from em.json...")
    try:
        with open("em.json", "r", encoding='utf-8') as f:
            data = json.load(f)
            employee_urls = data['data']
            print(f"Found {len(employee_urls)} employee URLs.")
            for employee_url in employee_urls:
                # api_url = os.getenv("BACKEND_URL") + "/api/v1/talent/user-urls/"
                api_url = ("http://35.232.23.77:8000/") + "/api/v1/talent/user-urls/"
                print(f"Saving URL: {employee_url}")
                response = requests.post(api_url, json={"url": employee_url})
                if response.status_code == 200:
                    print(f"Successfully saved: {employee_url}")
                else:
                    print(f"Failed to save {employee_url}: {response.status_code}, {response.text}")
    except Exception as e:
        print("Error loading URLs:", e)

def fetch_and_save_employees():
    print("Fetching employee URLs from backend...")
    # employee_api_url = os.getenv("BACKEND_URL") + "/api/v1/talent/users/create-from-json/"
    employee_api_url = ("http://35.232.23.77:8000/") + "/api/v1/talent/users/create-from-json/"
    url = "https://linkedin-data-api.p.rapidapi.com/get-profile-data-by-url"
    headers = {
        "X-RapidAPI-Key": "YOUR_RAPIDAPI_KEY",
        "X-RapidAPI-Host": "linkedin-data-api.p.rapidapi.com"
    }

    # urls_api_url = os.getenv("BACKEND_URL") + "/api/v1/talent/user-urls/"
    urls_api_url = ("http://35.232.23.77:8000/") + "/api/v1/talent/user-urls/"
    response = requests.get(urls_api_url)
    
    if response.status_code == 200:
        employee_urls = response.json().get('results', [])
        print(f"Retrieved {len(employee_urls)} employee URLs.")
        
        while response.json().get('next', None):
            response = requests.get(response.json().get('next'))
            employee_urls += response.json().get('results', [])

        for employee_url in employee_urls:
            querystring = {"url": employee_url['url']}
            print(f"Fetching data for {employee_url['url']}")
            response = requests.get(url, headers=headers, params=querystring)

            if response.status_code == 200:
                data = response.json()
                if data:
                    try:
                        response = requests.post(employee_api_url, data=json.dumps(data))
                        if response.status_code == 200:
                            print(f"Successfully processed: {employee_url['url']}")
                        else:
                            print(f"Failed to save data for {employee_url['url']}: {response.status_code}, {response.text}")
                    except Exception as e:
                        print(f"Error processing {employee_url['url']}: {e}")
                else:
                    print(f"No data found for {employee_url['url']}")
            else:
                print(f"Error fetching data for {employee_url['url']}: {response.status_code}, {response.text}")

# Uncomment the function calls you want to run
# get_urls_from_file_and_save_to_db()
fetch_and_save_employees()

# get_urls_from_file_and_save_to_db()
