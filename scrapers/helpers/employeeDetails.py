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
                api_url = os.getenv("BACKEND_URL") + "/api/v1/talent/user-urls/"
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
    employee_api_url = os.getenv("BACKEND_URL") + "/api/v1/talent/users/create-from-json/"
    url = "https://linkedin-data-api.p.rapidapi.com/get-profile-data-by-url"
    headers = {
        "X-RapidAPI-Key": "65503c7690msh4032d1dad082317p1e0bc1jsn824ed00f5bb0",
        "X-RapidAPI-Host": "linkedin-data-api.p.rapidapi.com"
    }

    urls_api_url = os.getenv("BACKEND_URL") + "/api/v1/talent/user-urls/"
    while urls_api_url:
        response = requests.get(urls_api_url)
        if response.status_code == 200:
            response_data = response.json()
            employee_urls = response_data.get('results', [])
            print(f"Retrieved {len(employee_urls)} employee URLs.")

            for employee_url in employee_urls:
                # Validate data
                if not isinstance(employee_url, dict) or 'url' not in employee_url:
                    print(f"Invalid data format: {employee_url}")
                    continue

                querystring = {"url": employee_url['url']}
                print(f"Fetching data for {employee_url['url']}")
                fetch_response = requests.get(url, headers=headers, params=querystring)

                if fetch_response.status_code == 200:
                    data = fetch_response.json()
                    if data:
                        try:
                            print(f"Processing data for {employee_url['url']}")
                            # Post to the backend
                            post_response = requests.post(employee_api_url, json=data)
                            response_json = post_response.json()
                            if post_response.status_code == 201:
                                if response_json.get("created", False):
                                    print(f"Successfully saved: {employee_url['url']}")
                                else:
                                    print(f"Duplicate data, not created: {employee_url['url']}")
                            else:
                                print(f"Failed to save data for {employee_url['url']}: {post_response.status_code}, {post_response.text}")
                        except Exception as e:
                            print(f"Error processing {employee_url['url']}: {e}")
                    else:
                        print(f"No data found for {employee_url['url']}")
                else:
                    print(f"Error fetching data for {employee_url['url']}: {fetch_response.status_code}, {fetch_response.text}")

                print(f"Finished processing {employee_url['url']}. Moving to the next...")

            # Update for the next page
            urls_api_url = response_data.get('next')
        else:
            print(f"Error fetching URLs: {response.status_code}, {response.text}")
            break


# get_urls_from_file_and_save_to_db()
fetch_and_save_employees()

# get_urls_from_file_and_save_to_db()
