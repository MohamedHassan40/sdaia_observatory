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


# get_urls_from_file_and_save_to_db()


def fetch_and_save_employees():

    employee_api_url = os.getenv("BACKEND_URL") + "api/v1/talent/users/create-from-json/"




    data = json.load(open("linkedin_profiles_modified.json"))
        
    # print(type(data))
    # print(data[0])
    for index, employee_info in enumerate(data):
        print("current employee info",index)
        print(employee_info)
        try:
            response = requests.post(
            employee_api_url, data=json.dumps(employee_info))

            print(response)
            print("Successfully processed", employee_info)
        except Exception as e:
            print("error", e)

        # querystring = {"url": employee_url['url']}
        # print("Fetching data for", {employee_url['url']})
        # response = requests.get(url, headers=headers, params=querystring)




fetch_and_save_employees()
