# Third-party imports
from datetime import datetime
import json
import time
import requests
from bs4 import BeautifulSoup
import os

# Local imports
from shared.scraper import Scraper
from utils.utils import convert_date_to_iso_format
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import StaleElementReferenceException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from dotenv import load_dotenv, find_dotenv
load_dotenv(find_dotenv())

class NewsScraper(Scraper):

    """
    A class to scrape newsposts from different news
    """

    def __init__(self, *args, base_url=None, news_name=None, **kwargs):
        """
        Initialize the newsScraper class

        """
        super().__init__(*args, **kwargs)
        self.base_url = base_url if base_url else 'default_url'
        self.news_name = news_name if news_name else 'default_news'

    def thiqah_news_scraper(self):
        """
        Scrapes news posts from the Thiqah news.

        This method navigates through the news's pagination, extracts articles from each page,
        and stores the extracted data into a database. It ensures not to scrape beyond the last page
        and avoids re-scraping content by checking for duplicate content on subsequent pages.
        """
        projects_number = 0
        last_page = None
        linkedin_username = "thiqah-sa"

        try:
            current_content = None
            # Limiting the number of pages to avoid infinite loops
            for page_num in range(1, 100):
                time.sleep(3)
                url = f"https://thiqah.sa/en/news-events/?page={page_num}"
                print(f"Scraping page {page_num} of {self.news_name} news")
                response = requests.get(url, timeout=10)
                soup = BeautifulSoup(response.content, 'html.parser')
                content_links = soup.select('.news-col > a[href]')

                # Determine the last page on the first page visit
                if last_page is None:
                    pagination = soup.select('.pagination')
                    if pagination:
                        last_page = int(pagination[0].select('a')[-2].text)
                        print("Last Page: ", last_page)

                if page_num > last_page:
                    break

                if not content_links:
                    break  # Stop if there are no content links

                # Prevent scraping the same page content
                page_content = response.content
                if page_content == current_content:
                    break
                current_content = page_content

                # Process each content link found on the page
                for content_link in content_links:
                    content_url = 'https://thiqah.sa' + content_link['href']
                    article_response = requests.get(content_url)
                    article_soup = BeautifulSoup(
                        article_response.content, 'html.parser')

                    content_title = article_soup.select_one('h2').text.strip()
                    content_date = article_soup.select_one(
                        'p.p.mb3', default="Date Not Found").text.strip()
                    content_image = 'https://thiqah.sa' + \
                        article_soup.select_one('.image img')['src']
                    content_body = article_soup.select_one(
                        '.indus-inner').text.strip()
                    projects_number += 1

                    self.save_content(
                        title=content_title,
                        description=content_body,
                        news_url=content_url,
                        image_url=content_image,
                        news_date=content_date,
                        linkedin_username=linkedin_username,
                        extra_text="",
                        is_event=False,
                        is_news=True
                    )

        except Exception as e:
            print(
                f"An error occurred while scraping {self.news_name}: {str(e)}")

    def mozn_news_scraper(self):
        linkedin_username = "mozn"
        try:
            data = []
            num_pages = 5
            for page in range(1, num_pages + 1):
                url = f"https://www.mozn.sa/news?229d6938_page={page}"
                # url = f"https://www.mozn.sa/news/?page={page}"
                response = requests.get(url)
                soup = BeautifulSoup(response.content, 'html.parser')
                articles = soup.find_all(class_='w-dyn-item')

                for article in articles:
                    title_element = article.find(class_='p-24px left')
                    title = title_element.text.strip() if title_element else "No Title Found"
                    print(title)
                    image_url = article.find(class_='image-192')['src']

                    article_url = 'https://www.mozn.sa' + article.find('a')['href']
                    print(article_url)
                    article_response = requests.get(article_url)
                    article_soup = BeautifulSoup(article_response.content, 'html.parser')
                    content = article_soup.find(class_='para-18px w-richtext').get_text(strip=True)

                    # data.append([title, image_url, content, article_url])
                    self.save_content(
                        title=title,
                        description=content,
                        news_url=article_url,
                        image_url=image_url,
                        news_date=datetime.now().isoformat(),
                        linkedin_username=linkedin_username,
                        is_event=False,
                        is_news=True
                    )
        except Exception as e:
            print(
                f"An error occurred while scraping {self.news_name}: {str(e)}")
            
            # Consider logging this error or handling it accordingly
    def machinestalk_news_scraper(self):
        linkedin_username = "machinestalk"
        try:
            url = "https://machinestalk.com/news/"

            driver = self.init_driver(url=url)
        
    
            driver.get(url)
    
            time.sleep(2)  # Wait for the page to load
            
            while True:
                try:
                    load_more_button = driver.find_element(By.XPATH, "//a[@class='load_more_item']")
                    driver.execute_script("arguments[0].scrollIntoView();", load_more_button)
                    load_more_button.click()
                    time.sleep(2)  # Wait for the content to load
                except:
                    break
            # Parse the HTML content after all posts are loaded
            soup = BeautifulSoup(driver.page_source, 'html.parser')
            # Find all blog posts
            blog_posts = soup.find_all("div", class_="blog-post")
            # Initialize a list to store blog data
            blogs = []
            # Loop through each blog post
            for post in blog_posts:
                title = post.find("h3", class_="blog-post_title").text.strip()
                content = post.find("div", class_="blog-post_text").text.strip()
                image_element = post.find("img")
                image_url = image_element["src"] if image_element else None
                link_element = post.find("a", class_="bg-read-more")
                link = link_element["href"] if link_element else None
                date = post.find("span", class_="post_date").text.strip()

                self.save_content(
                    title=title, description=content, news_url=link, image_url=image_url, news_date=date, linkedin_username=linkedin_username, is_news=True, is_event=False)


            


        except Exception as e:
            print(
                f"An error occurred while scraping {self.news_name}: {str(e)}")
            # Consider logging this error or handling it accordingly

    def sadeem_news_scraper(self):

        linkedin_username = "sadeem-wireless-sensing-systems"


        try:
        
            headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7'
            }
            num_pages = 5
            base_url_news = "https://sadeemwss.com/events/page/"

            for page in range(1, num_pages + 1): 
                url = base_url_news + str(page)
                response = requests.get(url, headers=headers)

                print(url)

                print("Response status code:", response.status_code)

                if response.status_code == 200:
                    soup = BeautifulSoup(response.content, 'html.parser')
                    articles = soup.find_all(class_='news-block')
                    print("number of articles:", len(articles))

                    for article in articles:
                        title_element = article.find(class_='news-title')
                        title = title_element.text.strip() if title_element else "No Title Found"
                        print("Title:", title)

                        date_element = article.find('span')
                        date = date_element.text.strip() if date_element else "No Date Found"
                        print("Date:", date)

                        image_element = article.find('img')
                        image_url = image_element['src'] if image_element else "No Image Found"
                        print("Image URL:", image_url)

                        article_url = article.find('a')['href']
                        print("Article URL:", article_url)

                        article_response = requests.get(article_url, headers=headers)
                        print("Article response status code:", article_response.status_code)
                        # print("Article response content:", article_response.content)

                        if article_response.status_code == 200:
                            article_soup = BeautifulSoup(article_response.content, 'html.parser')
                            content = article_soup.find(class_='content-description').get_text(strip=True)
                            

                            self.save_content(
                                title=title, news_date=date, image_url=image_url, description=content, news_url=article_url, linkedin_username=linkedin_username, is_news = True, is_event = False)

        except Exception as e:
            print(
                f"An error occurred while scraping {self.news_name}: {str(e)}")
            # Consider logging this error or handling it accordingly                        


    def quant_news_scraper(self):
        linkedin_username = "quant-sa"
        try:
            pass
        except Exception as e:
            print(
                f"An error occurred while scraping {self.news_name}: {str(e)}")
            # Consider logging this error or handling it accordingly

    def aila_news_scraper(self):
        """
        Scrapes news from the Aila website.
        """
        linkedin_username = "ailaai"
        url = 'https://aila.sa/about/#newsroom'

        try:
            # Initialize the Selenium WebDriver
            service = Service(ChromeDriverManager().install())
            options = webdriver.ChromeOptions()
            options.headless = True
            driver = webdriver.Chrome(service=service, options=options)

            # Open the URL using Selenium
            driver.get(url)

            # Extract the page source
            page_source = driver.page_source

            # Parse the content using BeautifulSoup
            soup = BeautifulSoup(page_source, 'html.parser')

            # Extract the news items
            news_items = soup.select('div.flickity-slider div.carousel-item')

            # Extract details for each news item
            for item in news_items:
                news_date_tag = item.select_one('div.date-box')
                news_date = news_date_tag.get_text(strip=True) if news_date_tag else 'Date not found'

                news_image_tag = item.select_one('img.logo-img1') or item.select_one('img.logo-img')
                news_image = news_image_tag['src'] if news_image_tag else 'Image not found'

                news_title_tag = item.select_one('h4.title-text')
                news_title = news_title_tag.get_text(strip=True) if news_title_tag else 'Title not found'

                news_content_tag = item.select_one('p.desc-text')
                news_content = news_content_tag.get_text(strip=True) if news_content_tag else 'Content not found'

                news_link_tag = item.select_one('a.btn')
                news_link = news_link_tag['href'] if news_link_tag else 'Link not found'

                # Only add to the list if the essential information is found
                if news_date != 'Date not found' or news_title != 'Title not found':
                    self.save_content(
                        title=news_title,
                        description=news_content,
                        news_url=news_link,
                        image_url=news_image,
                        news_date=news_date,
                        linkedin_username=linkedin_username,
                        is_event=False,
                        is_news=True
                    )
        
            # Close the Selenium WebDriver
            driver.quit()

        except Exception as e:
            print(f"An error occurred while scraping {self.news_name}: {str(e)}")

    def elm_news_scraper(self):
        """
        Scrapes news articles from the Elm website.
        """
        linkedin_username = "elm"
        base_url = "https://www.elm.sa"
        news_url = "https://www.elm.sa/en/news/Pages/default.aspx"

        def extract_news_details(driver, news_link):
            try:
                driver.get(news_link)
                time.sleep(3)  # Wait for the page to load
                description_element = driver.find_element(By.ID, "ctl00_PlaceHolderMain_ctl01__ControlWrapper_RichHtmlField")
                news_description = description_element.text
            except Exception as e:
                print(f"Error extracting details for {news_link}: {e}")
                news_description = 'No Description'
            return news_description

        def scrape_news_page(soup):
            news_articles = []
            news_items = soup.select('.post-item')
            for item in news_items:
                news_title = item.find('a', class_='post-title').get_text().strip()
                news_link = base_url + item.find('a', class_='post-title')['href']
                news_image_tag = item.find('a', class_='post-thumbnail')
                news_image = base_url + news_image_tag.find('img')['src'] if news_image_tag else 'No Image'
                news_date = item.find('span', class_='post-date').get_text().strip()
                news_articles.append({
                    'title': news_title,
                    'link': news_link,
                    'image': news_image,
                    'date': news_date,
                    'description': ''  # Placeholder for description to be filled later
                })
            return news_articles

        try:
            options = Options()
            options.headless = True
            driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
            all_news_articles = []

            driver.get(news_url)
            time.sleep(3)  # Wait for the page to load

            while True:
                soup = BeautifulSoup(driver.page_source, 'html.parser')
                news_articles = scrape_news_page(soup)
                all_news_articles.extend(news_articles)

                try:
                    next_button = driver.find_element(By.CSS_SELECTOR, ".NextPagi")
                    if "aspNetDisabled" in next_button.get_attribute("class"):
                        break  # Exit the loop if there are no more pages

                    driver.execute_script("arguments[0].click();", next_button)
                    time.sleep(3)  # Wait for the next page to load
                except Exception as e:
                    print(f"Error clicking next button: {e}")
                    break

            for article in all_news_articles:
                article['description'] = extract_news_details(driver, article['link'])

            driver.quit()

            for article in all_news_articles:
                if not article['image'].startswith('http'):
                    article['image'] = 'No Image'
                
                self.save_content(
                    title=article['title'],
                    description=article['description'],
                    news_url=article['link'],
                    image_url=article['image'],
                    news_date=article['date'],
                    linkedin_username=linkedin_username,
                    is_event=False,
                    is_news=True
                )

        except Exception as e:
            print(f"An error occurred while scraping {self.news_name}: {str(e)}")
            

    def save_content(self, title, description, news_url, image_url, news_date, linkedin_username, is_event, is_news, extra_text=""):
        """
        Saves the scraped content into the database via a POST request to an API.

        Parameters:
            title (str): The title of the content.
            description (str): The description or body of the content.
            news_url (str): The URL of the content.
            image_url (str): The URL of the content's image.
            news_date (str): The publication date of the content.
            linkedin_username (str): The LinkedIn username of the company.
            is_event (bool): Flag to determine if the content is an event.
            is_news (bool): Flag to determine if the content is news.
            extra_text (str): Additional text or data related to the content (optional).

        Returns:
            None
        """
        
        api_url = os.getenv("BACKEND_URL") + "/api/v1/talent/news/"
        api_url_retrieve = os.getenv("BACKEND_URL") + "/api/v1/talent/companies/by-linkedin-username/" + linkedin_username + "/"
        
        try:
            response = requests.get(api_url_retrieve)
            response.raise_for_status()  # Raise an error for bad status codes

            company_data = response.json()
            print(f"Company Data: {company_data}")  # Debugging statement

            if 'id' not in company_data:
                print(f"Error: 'id' not found in response for LinkedIn username {linkedin_username}")
                return

            company_id = company_data['id']
            formatted_date = convert_date_to_iso_format(news_date)

            payload = {
                "title": title,
                "description": description,
                "news_url": news_url,
                "image_url": image_url,
                "extra_text": extra_text,
                "news_date": formatted_date,
                "is_event": is_event,
                "is_news": is_news,
                "company": company_id,
            }

            headers = { 
                "Content-Type": "application/json",
            }

            response = requests.post(api_url, data=json.dumps(payload), headers=headers)
            
            if not response.ok:
                print("Failed to post data:", response.text)
            else:
                print("Successfully posted data:", response.json())

        except requests.RequestException as e:
            print(f"An error occurred while retrieving company data for LinkedIn username {linkedin_username}: {e}")
        except Exception as e:
            print(f"An unexpected error occurred while saving content: {e}")


# Usage
news_scraper = NewsScraper()
news_scraper.thiqah_news_scraper()
news_scraper.mozn_news_scraper()
news_scraper.sadeem_news_scraper()
news_scraper.machinestalk_news_scraper()
# news_scraper.aila_news_scraper()//needs fixing 
news_scraper.elm_news_scraper()

# print(results)
