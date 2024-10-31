# Third-party imports
from datetime import datetime
import json
import os
import time
import requests
from bs4 import BeautifulSoup

from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import StaleElementReferenceException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
import urllib
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium import webdriver
from dotenv import load_dotenv, find_dotenv
load_dotenv(find_dotenv())



# Local imports
from shared.scraper import Scraper
from utils.utils import convert_date_to_iso_format


class BlogScraper(Scraper):

    """
    A class to scrape blog posts from different blogs
    """

    def __init__(self, *args, base_url=None, blog_name=None, **kwargs):
        """
        Initialize the BlogScraper class

        """
        super().__init__(*args, **kwargs)
        self.base_url = base_url if base_url else 'default_url'
        self.blog_name = blog_name if blog_name else 'default_blog'

    def thiqah_blog_scraper(self):
        """
        Scrapes blog posts from the Thiqah blog.

        This method navigates through the blog's pagination, extracts articles from each page,
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
                url = f"https://thiqah.sa/en/blog/?page={page_num}"
                print(f"Scraping page {page_num} of {self.blog_name} blog")
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
                        full_text=content_body,
                        blog_url=content_url,
                        image_url=content_image,
                        blog_date=content_date,
                        linkedin_username=linkedin_username,
                        extra_text="",

                    )

        except Exception as e:
            print(
                f"An error occurred while scraping {self.blog_name}: {str(e)}")

    def mozn_blog_scraper(self):
        linkedin_username = "mozn"
        try:
            # Implement scraping logic here
            pass
        except Exception as e:
            print(
                f"An error occurred while scraping {self.blog_name}: {str(e)}")
            # Consider logging this error or handling it accordingly

    def quant_blog_scraper(self):
        linkedin_username = "quant-sa"
        try:
            url = "https://quant.sa/blog/"
            image_url_base = "https://quant.sa"
            response = requests.get(url)
            # Parse the HTML content
            soup = BeautifulSoup(response.content, "html.parser")
            # Find all blog post articles

            row_2 = soup.find("div", class_="et_pb_row et_pb_row_2")

            blog_articles = row_2.find_all("article", class_="et_pb_post")

            # Iterate over each blog article
            for article in blog_articles:

                # Extract the title
                title = article.find("h2", class_="entry-title").text.strip()

                # Extract the URL
                url = article.find(
                    "a", class_="entry-featured-image-url")["href"]

                # Extract the image URL if it exists
                image_tag = article.find("img")

                image_url = image_tag["data-srcset"].split(
                    ",")[0].split(" ")[0] if image_tag else ""
                image_url = image_url_base + image_url

                # Extract the content
                content_pre = article.find("div", class_="post-content-inner")
                content = content_pre.find("p").text.strip()

                date = article.find("p", class_="post-meta").text.strip()

                # date = date_container.find("span", class_="published").text.strip()
                date = date.split(" | ")[0]
                print(type(title), type(content), type(
                    url), type(image_url), type(date))

                self.save_content(title=title, full_text=content, blog_url=url,
                                  image_url=image_url, blog_date=date, linkedin_username=linkedin_username)

        except Exception as e:
            print(
                f"An error occurred while scraping {self.blog_name}: {str(e)}")
            # Consider logging this error or handling it accordingly

    def lucidya_blog_scraper(self):
        linkedin_username = "lucidya"
        url = "https://lucidya.com/blog/"
        driver = self.init_driver(url)

        driver.implicitly_wait(10)  # Adjust the timeout as needed
    # Find all blog posts
        blog_posts = driver.find_elements(
            By.CSS_SELECTOR, "div#mix_container div.mix")

        links = [post.find_element(
            By.CSS_SELECTOR, "a.item-blog").get_attribute("href") for post in blog_posts]
        dates = [post.find_element(
            By.CSS_SELECTOR, "span.date-blog").text.strip() for post in blog_posts]

        links_and_dates = [(link, date) for link, date in zip(links, dates)]

        for link, date in links_and_dates:
            driver.get(link)
            article_box = WebDriverWait(driver, 20).until(
                EC.presence_of_element_located(
                    (By.CSS_SELECTOR, "div.article-box"))
            )
            title = article_box.find_element(
                By.CSS_SELECTOR, "h1").text.strip()
            article = article_box.find_element(
                By.CSS_SELECTOR, "div.article").text.strip()
            image_figure_container = article_box.find_element(
                By.CSS_SELECTOR, "figure")
            image = image_figure_container.find_element(
                By.CSS_SELECTOR, "img").get_attribute("src")
            link = driver.current_url

            self.save_content(title=title, full_text=article,
                              blog_url=link, image_url=image, blog_date=date, linkedin_username=linkedin_username)

    def lean_blogs_scraper(self):
        linkedin_username = "lean-sa"
        req = urllib.request.Request(
            'https://lean.sa/blog.html', headers={'User-Agent': 'Mozilla/5.0'})
        response = urllib.request.urlopen(req).read()

        # Check if the request was successful
        if response:

            soup = BeautifulSoup(response, "html.parser")
            tab_1 = soup.find('div', {'data-w-tab': 'Tab 1'})
            # print(tab_1.text)

            blogs = tab_1.find_all('a', class_='blog-block w-inline-block')
            for blog in blogs:

                link = blog['href']
                if 'http' not in link:
                    link = 'https://lean.sa/' + link

                blog_image_container = blog.find('div', class_='blog-image')
                blog_image = blog_image_container.find('img')['src']
                blog_image = 'https://lean.sa/' + blog_image
                blog_heading = blog.find('h5').text
                self.save_content(title=blog_heading, full_text="", blog_url=link,
                                  image_url=blog_image, blog_date=(datetime.now().isoformat()), linkedin_username=linkedin_username)

        else:
            print("Failed to retrieve data from the website. Status code:",
                  response.status_code)
    def araby_blog_scraper(self):
        """
        Scrapes blog posts from the Araby website.
        """
        linkedin_username = "araby"
        url = 'https://www.araby.ai/en/blog'

        try:
            response = requests.get(url, timeout=10)
            soup = BeautifulSoup(response.content, 'html.parser')
            blog_items = soup.select('div.flex.items-center.justify-center.gap-10.flex-wrap.mt-10 a')

            for item in blog_items:
                link = 'https://www.araby.ai' + item['href']

                image_tag = item.select_one('img')
                image_url = 'https://www.araby.ai' + image_tag['src'] if image_tag else 'Image not found'

                title_tag = item.select_one('h6')
                title = title_tag.get_text(strip=True) if title_tag else 'Title not found'

                description_tag = item.select_one('p')
                description = description_tag.get_text(strip=True) if description_tag else 'Description not found'

                self.save_content(
                    title=title,
                    full_text=description,
                    blog_url=link,
                    image_url=image_url,
                    blog_date=datetime.now().isoformat(),  # Using current date as blog_date
                    linkedin_username=linkedin_username,
                    extra_text=""
                )

        except Exception as e:
            print(f"An error occurred while scraping {self.blog_name}: {str(e)}")
    def elevatus_blog_scraper(self):
        """
        Scrapes blog posts from the Elevatus blog.
        """
        linkedin_username = "elevatusio"
        BASE_URL = "https://www.elevatus.io/blog/"
        MAIN_URL = "https://www.elevatus.io/"

        def scrape_blogs_page(page_number):
            url = f"{BASE_URL}page/{page_number}/"
            response = requests.get(url, allow_redirects=True)

            if response.url.rstrip('/') == MAIN_URL.rstrip('/'):
                print(f"Redirected to base URL on page {page_number}. Stopping scrape.")
                return None

            soup = BeautifulSoup(response.content, 'html.parser')

            blog_articles = []
            blog_items = soup.select('article.item')

            if not blog_items:
                print(f"No blogs found on page {page_number}. Ending scrape.")
                return blog_articles

            print(f"Scraping page {page_number} with {len(blog_items)} blogs.")

            for item in blog_items:
                blog_title = item.find('h5', class_='title').get_text().strip()
                blog_link = item.find('a', class_='content')['href']

                img_tag = item.find('img')
                blog_image = img_tag.get('data-src', img_tag.get('src')) if img_tag else None

                blog_date = item.find('p', class_='date').get_text().strip()
                blog_description = item.find('p', class_='post-content').get_text().strip()

                blog_articles.append({
                    'title': blog_title,
                    'link': blog_link,
                    'image': blog_image,
                    'date': blog_date,
                    'description': blog_description
                })

            return blog_articles

        def scrape_all_pages():
            all_blogs = []
            page = 1

            while True:
                blogs = scrape_blogs_page(page)
                if blogs is None or not blogs:
                    break
                all_blogs.extend(blogs)
                print(f"Total blogs scraped so far: {len(all_blogs)}")
                page += 1

            return all_blogs

        try:
            all_blog_articles = scrape_all_pages()

            for blog in all_blog_articles:
                self.save_content(
                    title=blog['title'],
                    full_text=blog['description'],
                    blog_url=blog['link'],
                    image_url=blog['image'],
                    blog_date=blog['date'],
                    linkedin_username=linkedin_username
                )

        except Exception as e:
            print(f"An error occurred while scraping {self.blog_name}: {str(e)}")

    def qltyss_blog_scraper(self):
        """
        Scrapes blog posts from the Qltyss website.
        """
        linkedin_username = "qltyss"
        
        try:
            # Set up Selenium with Chrome WebDriver
            chrome_options = Options()
            chrome_options.add_argument("--headless")  # Run in headless mode
            chrome_options.add_argument("--no-sandbox")
            chrome_options.add_argument("--disable-dev-shm-usage")

            driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()), options=chrome_options)

            # Function to extract article information
            def extract_article_info(article):
                try:
                    news_image_tag = article.find_element(By.CSS_SELECTOR, 'div.post_featured img')
                    news_image = news_image_tag.get_attribute('src') if news_image_tag else None
                except Exception as e:
                    news_image = None
                    print(f"Error extracting news_image: {e}")

                try:
                    title_tag = article.find_element(By.CSS_SELECTOR, 'h3.post_title a')
                    title = title_tag.text.strip() if title_tag else "No Title"
                    link = title_tag.get_attribute('href') if title_tag else None
                except Exception as e:
                    title = "No Title"
                    link = None
                    print(f"Error extracting title or link: {e}")

                try:
                    description_tag = article.find_element(By.CSS_SELECTOR, 'div.post_content_inner')
                    description = description_tag.text.strip() if description_tag else "No Description"
                except Exception as e:
                    description = "No Description"
                    print(f"Error extracting description: {e}")

                try:
                    date_tag = article.find_element(By.CSS_SELECTOR, 'span.post_date')
                    date = date_tag.text.strip() if date_tag else "No Date"
                except Exception as e:
                    date = "No Date"
                    print(f"Error extracting date: {e}")

                return {
                    'news_image': news_image,
                    'title': title,
                    'description': description,
                    'date': date,
                    'link': link
                }

            # Loop through multiple pages until no articles are found
            all_articles_info = []
            page_num = 1
            articles_per_page = 6

            while True:
                url = f"https://qltyss.com/news/page/{page_num}/"
                print(f"Processing page: {page_num}")  # Track progress
                driver.get(url)

                # Wait for the articles to load
                try:
                    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR, 'article')))
                except Exception as e:
                    print(f"No articles found or page did not load properly on page {page_num}. Stopping. Error: {e}")
                    break

                # Check for "No Results" message
                no_results_message = driver.find_elements(By.XPATH, "//*[contains(text(), 'No results')]")
                articles = driver.find_elements(By.CSS_SELECTOR, 'article')

                if no_results_message or not articles:  # Break the loop if "No Results" message or no articles are found
                    print(f"No results or articles found on page {page_num}. Stopping.")
                    break

                # Process up to the expected number of articles per page
                num_articles_to_process = min(len(articles), articles_per_page)
                for article in articles[:num_articles_to_process]:
                    article_info = extract_article_info(article)
                    if article_info['link']:  # Only add articles with a valid link
                        all_articles_info.append(article_info)
                        # Save the content
                        self.save_content(
                            title=article_info['title'],
                            full_text=article_info['description'],
                            blog_url=article_info['link'],
                            image_url=article_info['news_image'],
                            blog_date=article_info['date'],
                            linkedin_username=linkedin_username,
                            extra_text=""
                        )

                # If fewer than the expected number of articles were found, stop processing
                if num_articles_to_process < articles_per_page:
                    print(f"Fewer than {articles_per_page} articles found on page {page_num}. Stopping.")
                    break

                page_num += 1

            print("Data extraction completed.")

            # Close the driver
            driver.quit()

        except Exception as e:
            print(f"An error occurred while scraping {self.news_name}: {str(e)}")
    def wakeb_blog_scraper(self):
        """
        Scrapes blog posts from the Wakeb blog.
        """
        linkedin_username = "wakeb-data"
        base_url = "https://blog.wakeb.tech/en?page="

        try:
            page_number = 1
            while True:
                url = base_url + str(page_number)
                response = requests.get(url)
                soup = BeautifulSoup(response.content, 'html.parser')
                blog_entries = soup.find_all('div', class_='col-sm-6 col-lg-4')

                if not blog_entries:
                    break

                for entry in blog_entries:
                    title_tag = entry.find('h2')
                    title = title_tag.get_text().strip() if title_tag else 'No Title'

                    blog_url_tag = entry.find('a')
                    blog_url = blog_url_tag['href'] if blog_url_tag else 'No URL'

                    image_tag = entry.find('img')
                    image_url = image_tag['src'] if image_tag else 'No Image'

                    full_text_tag = entry.find('p')
                    full_text = full_text_tag.get_text().strip() if full_text_tag else 'No Full Text'

                    date_tag = entry.find('span', class_='mx-2')
                    formatted_date = date_tag.get_text().strip() if date_tag else 'No Date'

                    extra_text_tag = entry.find('a', class_='tag mx-1')
                    extra_text = extra_text_tag.get_text().strip() if extra_text_tag else 'No Extra Text'

                    self.save_content(
                        title=title,
                        full_text=full_text,
                        blog_url=blog_url,
                        image_url=image_url,
                        blog_date=formatted_date,
                        linkedin_username=linkedin_username,
                        extra_text=extra_text
                    )

                page_number += 1

        except Exception as e:
            print(f"An error occurred while scraping {self.blog_name}: {str(e)}")

    def save_content(self, title, full_text, blog_url, image_url, blog_date, linkedin_username, extra_text=""):
        """
        Saves the scraped content into the database via a POST request to an API.


        """
        api_url = os.getenv("BACKEND_URL") + "/api/v1/talent/blogs/"
        api_url_retrieve = os.getenv(
            "BACKEND_URL") + f"/api/v1/talent/companies/by-linkedin-username/{linkedin_username}/"

        response = requests.get(api_url_retrieve)
        company_id = response.json()['id']

        formatted_date = convert_date_to_iso_format(blog_date)

        payload = {
            "title": title,
            "full_text": full_text,
            "blog_url": blog_url,
            "blog_date": formatted_date,
            "image_url": image_url,
            "extra_text": extra_text,
            "company": company_id,
        }

        headers = {
            "Content-Type": "application/json",
        }

        response = requests.post(
            api_url, data=json.dumps(payload), headers=headers)

        if not response.ok:
            print("Failed to post data:", response.text)


# Usage
blog_scraper = BlogScraper()
blog_scraper.thiqah_blog_scraper()
blog_scraper.quant_blog_scraper()
blog_scraper.lucidya_blog_scraper()
blog_scraper.lean_blogs_scraper()
blog_scraper.araby_blog_scraper()
blog_scraper.elevatus_blog_scraper()
blog_scraper.qltyss_blog_scraper()
blog_scraper.wakeb_blog_scraper()


