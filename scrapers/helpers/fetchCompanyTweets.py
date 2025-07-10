import requests
from dotenv import load_dotenv, find_dotenv
import os
import logging


env = find_dotenv()


load_dotenv(env)

def get_companies_that_have_twitter():
    api_url = os.getenv("BACKEND_URL") + "/api/v1/talent/companies/"
    # api_url = "http://34.132.72.150:8000/api/v1/talent/companies/"
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
    api_url = os.getenv("BACKEND_URL") + \
        f"/api/v1/talent/tweets/create-from-json/{company}/"
    response = requests.post(api_url, json=tweets)
    print(f"Saving tweets: {response.status_code}")


def get_tweets(twitter_id):
    """Fetch tweets from a specified Twitter API endpoint and return them."""
    url = "https://twitter241.p.rapidapi.com/user-tweets"
    querystring = {"user": twitter_id, "count": "100"}
    headers = {
        "X-RapidAPI-Key": "65503c7690msh4032d1dad082317p1e0bc1jsn824ed00f5bb0",
        "X-RapidAPI-Host": "twitter241.p.rapidapi.com"
    }
    try:
        response = requests.get(url, headers=headers, params=querystring)
        response.raise_for_status()
        tweets = response.json()


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



fetch_tweets_for_companies()
