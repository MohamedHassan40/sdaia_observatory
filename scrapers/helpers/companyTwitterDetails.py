import requests
from dotenv import load_dotenv, find_dotenv
import os
import logging

from utils.utils import convert_date_to_iso_format

env = find_dotenv()


load_dotenv(env)


def fetch_company_twitter_details():
    api_url = os.getenv("BACKEND_URL") + "/api/v1/talent/companies/"
    url = "https://twitter241.p.rapidapi.com/user"
    headers = {
        # "X-RapidAPI-Key": os.getenv("X_RAPIDAPI_KEY"),
        "X-RapidAPI-Key": "65503c7690msh4032d1dad082317p1e0bc1jsn824ed00f5bb0",
        "X-RapidAPI-Host": "twitter241.p.rapidapi.com"
    }

    talent_api_url = os.getenv("BACKEND_URL") + "/api/v1/talent/companies/"

    response = requests.get(talent_api_url).json()
    company_list = response.get('results', []).get('results', [])
    next = response.get('next', None)

    while next:
        response = requests.get(next).json()
        company_list += response.get('results', []).get('results', [])
        next = response.get('next', None)

    for company in company_list:

        company_twitter_username = company.get('company_twitter_username')

        querystring = {"username": company_twitter_username}
        response = requests.get(url, headers=headers, params=querystring)
        if response:
            results = response.json().get('result', {})
            data = results.get('data', {})
            user = data.get('user', {})
            result = user.get('result', {})
            if result:
                try:
                    company_twitter_id = result.get('rest_id')
                    legacy = result.get('legacy', {})
                    if legacy:
                        company_twitter_followers = legacy.get(
                            'followers_count')
                        company_twitter_created_at = legacy.get('created_at')
                        company_twitter_description = legacy.get('description')

                    company_data = {
                        "company_twitter_id": company_twitter_id,
                        "company_twitter_followers": company_twitter_followers,
                        "company_twitter_created_at": convert_date_to_iso_format(company_twitter_created_at),
                        "company_twitter_description": company_twitter_description
                    }

                    update_company(company.get('id'), company_data)

                    print(
                        f"Successfully processed: {company_twitter_username}")

                except Exception as e:
                    print(f"Error processing {company_twitter_username}: {e}")
            else:
                print(f"No data found for {company_twitter_username}")
        else:
            print(
                f"API request failed for {company_twitter_username} with status code {response.status_code}")


def update_company(company_id, data):
    api_url = os.getenv("BACKEND_URL") + \
        f"/api/v1/talent/companies/{company_id}/"
    response = requests.patch(api_url, json=data)
    print(f"Updating Company: {response.status_code}")

    if response.status_code == 200:
        print(f"Successfully updated: {data.get('company_twitter_username')}")


def get_companies_that_have_twitter():
    api_url = "http://35.232.23.77:8000/api/v1/talent/companies/"
    response = requests.get(api_url)
    companies_list = []
    if response.status_code == 200:
        data = response.json()
        next = data.get('next', None)
        companies = data.get('results', []).get('results', [])
        for company in companies:
            if (type(company) == dict) and company.get('company_twitter_id', None):
                companies_list.append(
                    (company.get('company_twitter_id'), company.get('id')))

        while next:
            response = requests.get(next)
            if response.status_code == 200:
                data = response.json()
                next = data.get('next', None)
                companies = data.get('results', []).get('results', [])
                for company in companies:
                    if (type(company) == dict) and company.get('company_twitter_id', None):
                        companies_list.append(
                            (company.get('company_twitter_id'), company.get('id')))
            else:
                print("Error fetching data for", {company})

        return companies_list
    else:
        print("Error fetching data for", {company})

    return companies_list


def fetch_tweets_for_companies():
    companies = get_companies_that_have_twitter()

    for company_twitter_id, company_id in companies:
        print(f"Fetching tweets for {company_twitter_id}")

        tweets = get_tweets(company_twitter_id)
        if tweets:
            save_tweets(tweets, company_id)
        else:
            print(f"No tweets found for {company_id}")


def save_tweets(tweets, company):

    # api_url = f"http://35.232.23.77:8000/api/v1/talent/tweets/create-from-json/{company}/"
    api_url = os.getenv("BACKEND_URL") + \
        f"/api/v1/talent/tweets/create-from-json/{company}/"
    response = requests.post(api_url, json=tweets)
    print(f"Saving tweets: {response.status_code}")


def get_tweets(twitter_id):
    """Fetch tweets from a specified Twitter API endpoint and return them."""
    url = "https://twitter241.p.rapidapi.com/user-tweets"
    querystring = {"user": twitter_id, "count": "100"}
    headers = {
        # "X-RapidAPI-Key": os.getenv("X_RAPIDAPI_KEY"),
        "X-RapidAPI-Key": "65503c7690msh4032d1dad082317p1e0bc1jsn824ed00f5bb0",
        "X-RapidAPI-Host": "twitter241.p.rapidapi.com"
    }
    try:
        response = requests.get(url, headers=headers, params=querystring)
        response.raise_for_status()
        tweets = response.json()

        with open('tweets.json', 'w') as f:
            f.write(str(tweets))

        logging.info("Fetched tweets successfully")

        # Check if the necessary data is present in the response
        if ('result' in tweets and 'timeline' in tweets['result'] and
            'instructions' in tweets['result']['timeline'] and
                len(tweets['result']['timeline']['instructions']) > 2):

            tweets_result = tweets['result']['timeline']['instructions'][2]['entries']
            return tweets_result
        elif ('result' in tweets and 'timeline' in tweets['result'] and
              'instructions' in tweets['result']['timeline'] and
              len(tweets['result']['timeline']['instructions']) > 1):
            tweets_result = tweets['result']['timeline']['instructions'][1]['entries']

            return tweets_result

        else:
            logging.warning(
                "The expected tweet data structure is missing or incomplete.")
            return []

    except requests.exceptions.RequestException as e:
        logging.error("Error fetching tweets: " + str(e))
        return []
    except Exception as e:
        logging.error("An error occurred in get_tweets: " + str(e))
        return []


# fetch_and_save_company_data()
fetch_company_twitter_details()
# fetch_tweets_for_companies()
