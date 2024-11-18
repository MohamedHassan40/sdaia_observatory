# company_twitter_username = models.CharField(max_length=255, blank=True)
# company_twitter_followers = models.IntegerField(default=0)
# company_twitter_id = models.CharField(max_length=255, blank=True)
# company_twitter_created_at = models.DateTimeField(null=True, blank=True)
# company_twitter_description = models.TextField(blank=True)

import requests
from dotenv import load_dotenv, find_dotenv
import os
import logging

from utils.utils import convert_date_to_iso_format

env = find_dotenv()


load_dotenv(env)


# keywords = ["SDAIA", "#SDAIA", "Artificial Intelligence", "AI"]
keywords = ["SDAIA", "#SDAIA"]


def search_tweets(keywords):

    # print(f"Fetching tweets for {company_twitter_id}")
    for keyword in keywords:
        tweets = get_tweets(keyword)
        if tweets:
            save_tweets(tweets)
        else:
            print(f"No tweets found for {keyword}")


def save_tweets(tweets):

    # api_url = f"http://35.232.23.77:8000/api/v1/talent/tweets/create-tweet-from-json/"
    api_url = os.getenv("BACKEND_URL") + \
        "/api/v1/talent/tweets/create-tweet-from-json/"
    response = requests.post(api_url, json=tweets)
    print(f"Saving tweets: {response.status_code}")


def get_tweets(keyword):
    """Fetch tweets from a specified Twitter API endpoint and return them."""
    url = "https://twitter241.p.rapidapi.com/search-v2"
    querystring = {"type": "latest", "count": "20", "query": keyword}
    headers = {
        # "X-RapidAPI-Key": os.getenv("X_RAPIDAPI_KEY"),
        "X-RapidAPI-Key": "65503c7690msh4032d1dad082317p1e0bc1jsn824ed00f5bb0",
        "X-RapidAPI-Host": "twitter241.p.rapidapi.com"
    }
    try:
        response = requests.get(url, headers=headers, params=querystring)
        response.raise_for_status()
        tweets = response.json()

        # with open('tweets.json', 'w') as f:
        #     f.write(str(tweets))

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

        elif ('result' in tweets and 'timeline' in tweets['result'] and
              'instructions' in tweets['result']['timeline'] and
              len(tweets['result']['timeline']['instructions']) == 1):
            tweets_result = tweets['result']['timeline']['instructions'][0]['entries']

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
# fetch_company_twitter_details()
# fetch_tweets_for_companies()
search_tweets(keywords)
