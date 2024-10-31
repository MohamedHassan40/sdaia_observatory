from bs4 import BeautifulSoup
import requests
from datetime import datetime
import os

from dotenv import load_dotenv, find_dotenv
load_dotenv(find_dotenv())

def fetch_news():
    base_url = os.getenv("BACKEND_URL") + "/api/v1/news/"
    articles_api_url = base_url + "articles/"
    sources_api_url = base_url + "sources/"
    oecd_api_url = "https://wp.oecd.ai/wp-json/wp/v2/posts?_embed=1&acf_format=standard&per_page=99"
    
    page = 1
    total_pages = 1
    
    while page <= total_pages:
        response = requests.get(f"{oecd_api_url}&page={page}")
        data = response.json()
        
        if page == 1:
            total_pages = int(response.headers.get('X-WP-TotalPages', 1))
        
        for post in data:
            print("Processing post")
            slug = post.get('slug')
            source_uri = f"https://oecd.ai/en/wonk/{slug}"
            title = post.get('title', {}).get('rendered')
            html_content = post.get('content', {}).get('rendered')
            body = BeautifulSoup(html_content, 'html.parser').get_text()
            date_time_pub = datetime.strptime(post.get('date'), "%Y-%m-%dT%H:%M:%S")
            image_url = post['_embedded']['wp:featuredmedia'][0]['source_url'] if post['_embedded'].get('wp:featuredmedia') else None

            source_response = requests.post(
                sources_api_url, data={'uri': sources_api_url, 'title': 'OECD AI News', 'data_type': 'News Website'})

            source = source_response.json()

            print("Source", source)

            article = requests.post(
                articles_api_url, data={
                    'uri': post['id'],
                    'date_time_pub': date_time_pub,
                    'url': source_uri,
                    'title': title,
                    'body': body,
                    'source': source.get("id"),
                    'image': image_url
                }, timeout=500
            )

            article_data = article.json()
            print("Article", article_data)
        
        page += 1

fetch_news()
