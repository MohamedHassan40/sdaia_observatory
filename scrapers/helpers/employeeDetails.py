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

import time
import requests
import json



import requests
import time
import json

def fetch_and_save_employees():
    print("Fetching employee URLs from backend with pagination...")

    # API endpoints
    urls_api_url = "http://35.232.23.77:8000/api/v1/talent/user-urls/"  # Base URL for fetching URLs
    employee_api_url = "http://35.232.23.77:8000/api/v1/talent/users/create-from-json/"
    linkedin_api_url = "https://linkedin-data-api.p.rapidapi.com/get-profile-data-by-url"

    headers = {
        "X-RapidAPI-Key": "65503c7690msh4032d1dad082317p1e0bc1jsn824ed00f5bb0",
        "X-RapidAPI-Host": "linkedin-data-api.p.rapidapi.com"
    }

    total_processed = 0
    next_page = urls_api_url  # Start with the first page

    while next_page:
        try:
            # Fetch a page of URLs
            response = requests.get(next_page, timeout=10)
            if response.status_code == 200:
                data = response.json()
                employee_urls = data.get('results', [])
                next_page = data.get('next', None)  # Get the URL for the next page

                if not employee_urls:
                    print("No more URLs found.")
                    break

                # Process URLs from the current page
                for idx, employee_url in enumerate(employee_urls, start=1):
                    total_processed += 1
                    print(f"Processing link {total_processed}: {employee_url['url']}")
                    querystring = {"url": employee_url['url']}
                    
                    # Fetch LinkedIn data
                    try:
                        linkedin_response = requests.get(linkedin_api_url, headers=headers, params=querystring, timeout=10)
                        if linkedin_response.status_code == 200:
                            linkedin_data = linkedin_response.json()
                            print(f"LinkedIn data fetched for {employee_url['url']}.")
                            
                            # Send data to backend
                            post_response = requests.post(employee_api_url, json=linkedin_data)
                            if post_response.status_code == 200:
                                print(f"Successfully saved data for {employee_url['url']}.")
                            else:
                                print(f"Failed to save data for {employee_url['url']}: {post_response.status_code}, {post_response.text}")
                        elif linkedin_response.status_code == 429:  # Rate limit
                            print("Rate limit exceeded. Retrying after 10 seconds...")
                            time.sleep(10)
                        else:
                            print(f"Failed to fetch LinkedIn data for {employee_url['url']}: {linkedin_response.status_code}, {linkedin_response.text}")
                    except Exception as e:
                        print(f"Error fetching data for {employee_url['url']}: {e}")
            else:
                print(f"Failed to fetch URLs from backend: {response.status_code}, {response.text}")
                break  # Exit on failure
        except Exception as e:
            print(f"Error fetching employee URLs: {e}")
            break

    print(f"Processing completed. Total links processed: {total_processed}")

# Uncomment the function calls you want to run
# get_urls_from_file_and_save_to_db()
fetch_and_save_employees()

# get_urls_from_file_and_save_to_db()
