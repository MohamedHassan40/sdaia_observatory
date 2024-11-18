# Third-party imports
from datetime import datetime
import json
import os
import time
import urllib.request
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
from selenium.webdriver.chrome.service import Service
from selenium import webdriver


from dotenv import load_dotenv, find_dotenv
load_dotenv(find_dotenv())

# Local imports
from shared.scraper import Scraper
from utils.utils import convert_date_to_iso_format


class ProductScraper(Scraper):

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

    def thiqah_products_scraper(self):
        """

        Scrapes products from Thiqah.

        """
        projects_number = 0
        last_page = None
        # company_id = 2
        linkedin_username = "thiqah-sa"

        try:
            base_url = "https://thiqah.sa/en/industries/"
            response = requests.get(base_url)
            soup = BeautifulSoup(response.content, 'html.parser')
            product_links = soup.select('.sub_menu li a[href]')

            for product_link in product_links:
                product_url = 'https://thiqah.sa' + product_link['href']
                product_response = requests.get(product_url)
                product_soup = BeautifulSoup(
                    product_response.content, 'html.parser')

                product_sets = product_soup.select('.set')

                for product_set in product_sets:
                    product_name = product_set.find('p').get_text(strip=True)
                    product_description = product_set.find(
                        class_='content').get_text(strip=True)

                    self.save_content(
                        product_name, product_description, product_url, "", linkedin_username=linkedin_username)

        except Exception as e:
            print(
                f"An error occurred while scraping {self.news_name}: {str(e)}")

    def mozn_products_scraper(self):
        linkedin_username = "mozn"
        try:
            self.init_driver(url="https://www.mozn.sa/")
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located(
                    (By.CSS_SELECTOR, "div#w-node-_13f59132-83a2-3615-e3f5-46964e9b6dde-4e9b6ddb.footer__content-wrapper-6"))
            )
            # Find the div containing the links
            links_div = self.driver.find_element(
                By.CSS_SELECTOR, "div#w-node-_13f59132-83a2-3615-e3f5-46964e9b6dde-4e9b6ddb.footer__content-wrapper-6")
            # Find all the links within the div
            links = links_div.find_elements(By.CLASS_NAME, "footer-links")

            for link in links:
                # Get the URL of the link
                link_url = link.get_attribute("href")
                WebDriverWait(self.driver, 10).until(
                    EC.invisibility_of_element_located(
                        (By.CLASS_NAME, "loader"))
                )
                # Click on the link
                link.click()
                # Wait for the page to load
                WebDriverWait(self.driver, 10).until(
                    EC.presence_of_element_located(
                        (By.CSS_SELECTOR, "section.section__focal-hero img.osos-logo"))
                )
                # Get the title of the page
                title = self.driver.title
                # Get the HTML content of the page
                page_html = self.driver.page_source

                # Parse the HTML using BeautifulSoup
                soup = BeautifulSoup(page_html, "html.parser")

                # Get the image URL
                image_url = soup.select_one(
                    "section.section__focal-hero img.osos-logo")["src"]

                # Get the description
                description_element = soup.select_one("div.diff-card-wrapper")
                description = description_element.get_text(
                    strip=True) if description_element else ""

                # Append the data to the list
                # data_mozn_products.append([title, image_url, description, link_url])
                self.save_content(
                    title, description, link_url, image_url, linkedin_username=linkedin_username)

                # Go back to the previous page
                self.driver.back()

                # Wait for the page to load
                WebDriverWait(self.driver, 10).until(
                    EC.presence_of_element_located(
                        (By.CSS_SELECTOR, "div#w-node-_13f59132-83a2-3615-e3f5-46964e9b6dde-4e9b6ddb.footer__content-wrapper-6"))
                )

            # Close the web browser
            self.driver.quit()

        except Exception as e:
            print(
                f"An error occurred while scraping {self.news_name}: {str(e)}")
            # Consider logging this error or handling it accordingly

    def sadeem_products_scraper(self):
        linkedin_username = "sadeem-wireless-sensing-systems"
        try:
            self.init_driver(url="https://sadeemwss.com/")
            product_containers = self.driver.find_elements(
                By.CSS_SELECTOR, "div.home-solutions-block")
            for container in product_containers:
                product_name = container.find_element(
                    By.CSS_SELECTOR, ".home-solutions-block h3").text.strip()
                product_description = container.find_element(
                    By.CSS_SELECTOR, ".sol-content").text.strip()
                product_image = container.find_element(
                    By.CSS_SELECTOR, ".sol-img img").get_attribute('src')
                product_link = container.find_element(
                    By.CSS_SELECTOR, ".sol-more").get_attribute('href')

                if product_name and product_description and product_link:

                    self.save_content(
                        title=product_name, description=product_description, product_url=product_link, image_url=product_image, linkedin_username=linkedin_username)

        except Exception as e:
            print(
                f"An error occurred while scraping: {str(e)}")
    def quant_products_scraper(self):
        """
        Scrapes products from the Quant website.
        """
        linkedin_username = "quant-sa"
        url = "https://quant.sa/"

        try:
            self.init_driver(url)
            WebDriverWait(self.driver, 20).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "ul#menu-main-menu-en"))
            )

            # Locate the products section
            products_section = self.driver.find_element(
                By.CSS_SELECTOR, "#menu-main-menu-en > li.et_pb_menu_page_id-4370169.menu-item.menu-item-type-custom.menu-item-object-custom.menu-item-has-children.menu-item-4370169"
            )

            # Get the initial list of product links
            product_links = products_section.find_elements(By.CSS_SELECTOR, "ul.sub-menu li a")
            
            for index, product_link in enumerate(product_links):
                # Refresh the products section and product links to avoid stale element reference
                products_section = self.driver.find_element(
                    By.CSS_SELECTOR, "#menu-main-menu-en > li.et_pb_menu_page_id-4370169.menu-item.menu-item-type-custom.menu-item-object-custom.menu-item-has-children.menu-item-4370169"
                )
                product_links = products_section.find_elements(By.CSS_SELECTOR, "ul.sub-menu li a")

                # Get the current product link
                current_product_link = product_links[index]

                # Get the URL of the product
                product_url = current_product_link.get_attribute("href")

                # Click on the product link
                self.driver.execute_script("arguments[0].click();", current_product_link)

                # Wait for the product page to load
                WebDriverWait(self.driver, 10).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, "div.et_pb_text_inner"))
                )

                # Get the product name
                product_name = product_url.replace(url, "").strip("/")
                
                # Get the product details
                product_details = self.driver.find_element(By.CSS_SELECTOR, "div.et_pb_text_inner").text.strip()
                
                # Get the product logo URL
                product_logo = self.driver.find_element(By.CSS_SELECTOR, "div.et_pb_module.et_pb_image img").get_attribute("data-src")
                logo_link = url + product_logo

                # Save the product details
                try:
                    self.save_content(
                        title=product_name,
                        description=product_details,
                        product_url=product_url,
                        image_url=logo_link,
                        linkedin_username=linkedin_username
                    )
                except requests.exceptions.RequestException as e:
                    if "non_field_errors" in e.response.json():
                        print(f"Product {product_name} already exists in the database.")
                    else:
                        print(f"Failed to post data: {e.response.text}")

                # Go back to the previous page
                self.driver.back()

                # Wait for the previous page to load
                WebDriverWait(self.driver, 10).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, "ul#menu-main-menu-en"))
                )

            # Close the web browser
            self.driver.quit()

        except Exception as e:
            print(f"An error occurred while scraping {self.news_name}: {str(e)}")


    def lucidya_products_scraper(self):
        linkedin_username = "lucidya"
        try:
            url = "https://lucidya.com/product/"
            driver = self.init_driver(url)
            container = driver.find_element(
                By.CSS_SELECTOR, 'div.products-items')

# Iterating through each product item within the container
            for product_item in container.find_elements(By.CSS_SELECTOR, 'a.item-product.anchor-luci'):
                name = product_item.find_element(By.CSS_SELECTOR, 'h4').text
                description = product_item.find_element(
                    By.CSS_SELECTOR, 'p').text
                image_url = product_item.find_element(
                    By.CSS_SELECTOR, 'img').get_attribute('src')
                link = product_item.get_attribute('href')

                # Appending product details to the list
                self.save_content(title=name, description=description,
                                  product_url=link, image_url=image_url, linkedin_username=linkedin_username)

        except Exception as e:
            print(f"An error occurred while scraping: {str(e)}")

    def lean_products_scraper(self):
        linkedin_username = "lean-sa"
        req = urllib.request.Request(
            'https://lean.sa/project.html', headers={'User-Agent': 'Mozilla/5.0'})
        response = urllib.request.urlopen(req).read()

        # Check if the request was successful
        if response:

            soup = BeautifulSoup(response, "html.parser")
            # Find the projects container
            projects_container = soup.find('div', class_='projects-section')
            projects_tittle_block = projects_container.find(
                'div', class_='projects-tittle-block')
            # get the 2nd div in the projects-tittle-block
            projects_tittle = projects_tittle_block.find_all('div')[1]

            for project in projects_tittle:
                try:
                    if ("bs4.element.Tag" in str(type(project))):
                        product = project.find('div', class_='product')
                        header = product.find('div', class_='header')
                        image_link = header.find('img')['src']
                        content = product.find('div', class_='content')
                        project_header = content.find('h4').text
                        project_content = content.find('p').text
                        link = project.find("div", class_="link")
                        inner_link = link.find('a')['href']
                        image_link = "https://lean.sa/" + image_link
                        inner_link = "https://lean.sa/" + inner_link

                        self.save_content(title=project_header, description=project_content,
                                          product_url=inner_link, image_url=image_link, linkedin_username=linkedin_username)
                except Exception as e:
                    print(f"An error occurred while scraping: {str(e)}")

        else:
            print("Failed to retrieve data from the website. Status code:",
                  response.status_code)

    def aila_products_scraper(self):
        """
        Scrapes products from the Aila website.
        """
        linkedin_username = "ailaai"
        base_url = 'https://aila.sa/'
        url = 'https://aila.sa/'

        try:
            response = requests.get(url, timeout=10)
            soup = BeautifulSoup(response.content, 'html.parser')
            menu_items = soup.select('li#menu-item-2343 ul.nav-item-children li a')

            products = []
            for item in menu_items:
                name = item.get_text(strip=True)
                link = item['href']
                full_link = base_url + link if not link.startswith('http') else link

                page_response = requests.get(full_link, timeout=10)
                page_content = page_response.text
                page_soup = BeautifulSoup(page_content, 'html.parser')
                description_tag = page_soup.select_one('div.e-con-inner div.elementor-element div.elementor-widget-container h1.ld-fh-element')
                description = description_tag.get_text(separator=' ', strip=True) if description_tag else 'Description not found'

                products.append({
                    'name': name,
                    'link': full_link,
                    'image_url': '',
                    'description': description
                })

                self.save_content(
                    title=name,
                    description=description,
                    product_url=full_link,
                    image_url='',
                    linkedin_username=linkedin_username
                )

        except Exception as e:
            print(f"An error occurred while scraping {self.news_name}: {str(e)}")
    def araby_product_scraper(self):
        """
        Scrapes products from the Araby website.
        """
        linkedin_username = "araby-ai"
        url = 'https://www.araby.ai/en'

        try:
            response = requests.get(url, timeout=10)
            soup = BeautifulSoup(response.content, 'html.parser')

            logo_tag = soup.select_one('div.flex.items-center.justify-between.gap-2.text-sm.font-semibold.tracking-wide.lg\\:gap-10 a img')
            logo_url = 'https://www.araby.ai' + logo_tag['src'] if logo_tag else 'Logo not found'

            description_tag = soup.select_one('div.home_heading_container__yFE_4')
            description_parts = description_tag.find_all('p', limit=3)
            summarized_description = ' '.join([part.get_text(strip=True) for part in description_parts])

            product_details = {
                'product_name': 'Araby AI',
                'product_logo': logo_url,
                'product_link': url,
                'product_description': summarized_description
            }

            self.save_content(
                title=product_details['product_name'],
                description=product_details['product_description'],
                product_url=product_details['product_link'],
                image_url=product_details['product_logo'],
                linkedin_username=linkedin_username
            )

        except Exception as e:
            print(f"An error occurred while scraping {self.news_name}: {str(e)}")
    def elevatus_product_scraper(self):
        """
        Scrapes products from the Elevatus website.
        """
        linkedin_username = "elevatusio"
        BASE_URL = "https://www.elevatus.io/"

        def scrape_products():
            url = BASE_URL
            response = requests.get(url)
            soup = BeautifulSoup(response.content, 'html.parser')

            product_section = soup.find('div', class_='w-4 menu-list products-menu')
            product_items = product_section.find_all('a', class_='item')

            products = []

            for item in product_items:
                product_link = BASE_URL.rstrip('/') + item['href']
                product_name = item.find('p', class_='title').get_text().strip()
                product_description = item.find('p', class_='content').get_text().strip()

                img_tag = item.find('img')
                product_image = img_tag.get('data-src', img_tag.get('src')) if img_tag else None

                products.append({
                    'name': product_name,
                    'link': product_link,
                    'description': product_description,
                    'image': product_image
                })

            return products

        try:
            products = scrape_products()

            for product in products:
                self.save_content(
                    title=product['name'],
                    description=product['description'],
                    product_url=product['link'],
                    image_url=product['image'],
                    linkedin_username=linkedin_username
                )

        except Exception as e:
            print(f"An error occurred while scraping {self.news_name}: {str(e)}")
            
    def elm_product_scraper(self):
        """
        Scrapes product details from the Elm website.
        """
        linkedin_username = "elm"
        base_url = "https://www.elm.sa"
        main_url = "https://www.elm.sa/en/Pages/default.aspx"

        def extract_product_details(driver, product_link, section_id):
            driver.get(product_link)
            time.sleep(3)  # Wait for the page to load

            product_image = 'No Image'
            product_description = 'No Description'

            try:
                section = driver.find_element(By.ID, section_id)
                product_image_element = section.find_element(By.CSS_SELECTOR, '.img-box img')
                product_description_element = section.find_element(By.CSS_SELECTOR, '.content-box p')

                product_image = product_image_element.get_attribute('src')
                product_description = product_description_element.text
            except Exception as e:
                print(f"Error extracting details for {product_link} section {section_id}: {e}")

            return product_image, product_description

        try:
            response = requests.get(main_url)
            soup = BeautifulSoup(response.content, 'html.parser')

            product_links = []
            product_sections = soup.select('.gspb_iconsList__item a')

            for item in product_sections:
                product_name = item.get_text().strip()
                product_link = base_url + item.get('href')
                if "digital-products" in product_link:
                    product_links.append((product_name, product_link))

            options = Options()
            options.headless = True
            driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

            products = []
            for product_name, product_link in product_links:
                if "digital-products" in product_link:
                    section_id = product_link.split('#')[-1]  # Extract the section ID from the link
                    product_image, product_description = extract_product_details(driver, product_link, section_id)
                    products.append({
                        'name': product_name,
                        'link': product_link,
                        'image': base_url + product_image if not product_image.startswith('http') else product_image,
                        'description': product_description
                    })

            driver.quit()

            for product in products:
                self.save_content(
                    title=product['name'],
                    description=product['description'],
                    product_url=product['link'],
                    image_url=product['image'],
                    linkedin_username=linkedin_username
                )

        except Exception as e:
            print(f"An error occurred while scraping {self.news_name}: {str(e)}")
    def hudhud_product_scraper(self):
        """
        Scrapes product details from the Hudhud website.
        """
        linkedin_username = "hudhud-ai"
        url = "https://hudhud.ai/"

        try:
            response = requests.get(url)
            soup = BeautifulSoup(response.content, 'html.parser')

            # Extract the logo URL
            logo_tag = soup.select_one('div.brand-logo a img')
            logo_url = 'https://hudhud.ai' + logo_tag['src'] if logo_tag else 'Logo not found'

            # Extract the product description
            description_tag = soup.select_one('div.col-sm.col-sm-6 h5.landing-headline')
            product_description = description_tag.get_text(strip=True) if description_tag else 'Description not found'

            # Create a dictionary with the product details
            product_details = {
                'product_name': 'Hudhud',
                'product_image': logo_url,
                'product_link': url,
                'product_description': product_description
            }

            # Save the scraped content
            self.save_content(
                title=product_details['product_name'],
                description=product_details['product_description'],
                product_url=product_details['product_link'],
                image_url=product_details['product_image'],
                linkedin_username=linkedin_username
            )

        except Exception as e:
            print(f"An error occurred while scraping {self.news_name}: {str(e)}")

    def lisan_product_scraper(self):
        """
        Scrapes product details from the Lisan website.
        """
        linkedin_username = "lisanai"
        url = 'https://lisan.ai/en/lisan'

        try:
            # Initialize the Selenium WebDriver with headless option
            options = Options()
            options.headless = True
            driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
            
            # Open the URL using Selenium
            driver.get(url)
            
            # Extract the page source
            page_source = driver.page_source
            
            # Parse the content using BeautifulSoup
            soup = BeautifulSoup(page_source, 'html.parser')
            
            # Extract the logo URL
            logo_tag = soup.select_one('div.header-wrapper a.header-logo-wrapper img')
            logo_url = logo_tag['src'] if logo_tag else 'Logo not found'
            
            # Extract the specific h1 element content for description
            description_tag = soup.select_one('h1.title.hero-title')
            description = description_tag.get_text(separator=' ', strip=True) if description_tag else 'Description not found'
            
            # Create a dictionary with the product details
            product_details = {
                'product_name': 'Lisan',
                'product_logo': logo_url,
                'product_link': url,
                'product_description': description
            }
            
            # Save the scraped content
            self.save_content(
                title=product_details['product_name'],
                description=product_details['product_description'],
                product_url=product_details['product_link'],
                image_url=product_details['product_logo'],
                linkedin_username=linkedin_username
            )
            
            # Close the Selenium WebDriver
            driver.quit()

        except Exception as e:
            print(f"An error occurred while scraping {self.news_name}: {str(e)}")

    def qltyss_product_scraper(self):
        """
        Scrapes product information from the Qltyss website.
        """
        linkedin_username = "quality-support-solutions-co-ltd"
        url = 'https://qltyss.com/'

        try:
            response = requests.get(url, timeout=10)
            soup = BeautifulSoup(response.content, 'html.parser')

            # Find all the menu items under 'Solutions'
            menu_items = soup.select('li#menu-item-17443 ul.sub-menu li a')

            # Extract the names and links
            solutions = []
            for item in menu_items:
                name = item.find('span').text
                link = item['href']
                solutions.append({'name': name, 'link': link})

            # Function to fetch content from a given link
            def fetch_content(link):
                res = requests.get(link)
                page_content = res.text
                page_soup = BeautifulSoup(page_content, 'html.parser')
                return page_soup.get_text(separator=' ', strip=True)

            # Simple summary function
            def simple_summary(text, max_sentences=5):
                sentences = text.split('. ')
                if len(sentences) <= max_sentences:
                    return text
                return '. '.join(sentences[:max_sentences]) + '.'

            # Create a set to track processed links
            processed_links = set()

            # Fetch content and generate summary for each solution
            for solution in solutions:
                if solution['link'] not in processed_links:
                    processed_links.add(solution['link'])
                    content = fetch_content(solution['link'])
                    solution['description'] = simple_summary(content)
                    # Save the content
                    self.save_content(
                        title=solution['name'],
                        description=solution['description'],
                        product_url=solution['link'],
                        image_url="",
                        linkedin_username=linkedin_username
                    )

            print("Data extraction completed.")

        except Exception as e:
            print(f"An error occurred while scraping {self.news_name}: {str(e)}")

    def wakeb_products_scraper(self):
        """
        Scrapes products from the Wakeb website.
        """
        linkedin_username = "wakeb-data"
        url = "https://blog.wakeb.tech/en"

        try:
            response = requests.get(url, timeout=10)
            soup = BeautifulSoup(response.content, 'html.parser')
            product_section = soup.find('li', {'class': 'has-sub-menu'})

            if product_section:
                product_items = product_section.find_all('a', {'class': 'nav-link'})

                for item in product_items:
                    product_name = item.get_text().strip()
                    product_link = item.get('href')

                    if product_name.lower() == "products" or product_link == '#':
                        continue

                    tab_id = item['href'].strip('#')
                    tab_content = soup.find('div', {'id': tab_id})

                    if tab_content:
                        footer_link_element = tab_content.select_one("div.row.footer-mega-menu-content > p > a")
                        product_link = footer_link_element.get('href') if footer_link_element else product_link

                        if product_link and not product_link.startswith('http'):
                            product_link = "https://wakeb.tech" + product_link

                        product_image = tab_content.find('img')['src'] if tab_content.find('img') else 'No Image'
                        product_description = tab_content.find('p').get_text().strip() if tab_content.find('p') else 'No Description'
                    else:
                        product_image = 'No Image'
                        product_description = 'No Description'

                    self.save_content(
                        title=product_name,
                        description=product_description,
                        product_url=product_link,
                        image_url=product_image,
                        linkedin_username=linkedin_username
                    )

        except Exception as e:
            print(f"An error occurred while scraping Wakeb products {str(e)}")
    def save_content(self, title, description, product_url, image_url, linkedin_username, extra_text=""):
        """
        Saves the scraped content into the database via a POST request to an API.

        """

        # api_url = {os.getenv("BACKEND_URL")} + "/api/v1/talent/products/"
        # api_url = {os.getenv("BACKEND_URL")} + "/api/v1/talent/products/"
        # api_url = "http://35.232.23.77:8000/api/v1/talent/products/"
        api_url = os.getenv("BACKEND_URL") + "/api/v1/talent/products/"
        # api_url_retrieve = "http://35.232.23.77:8000/api/v1/talent/companies/by-linkedin-username/" + \
            # linkedin_username + "/"
        api_url_retrieve = os.getenv("BACKEND_URL") + \
            "/api/v1/talent/companies/by-linkedin-username/" + linkedin_username + "/"
        
        response = requests.get(api_url_retrieve)
        company_id = response.json()['id']

        payload = {
            "title": title,
            "description": description,
            "product_url": product_url,
            "image_url": image_url,
            "company_id": company_id,
            "extra_text": extra_text,
        }

        headers = {
            "Content-Type": "application/json",
        }

        print("Posted data", payload)

        response = requests.post(
            api_url, data=json.dumps(payload), headers=headers)

        if not response.ok:
            print("Failed to post data:", response.text)


# Usage
products_scraper = ProductScraper()
products_scraper.thiqah_products_scraper()
products_scraper.mozn_products_scraper()
products_scraper.sadeem_products_scraper()
products_scraper.quant_products_scraper()
products_scraper.lucidya_products_scraper()
products_scraper.lean_products_scraper()
# products_scraper.aila_products_scraper() //needs fixing
products_scraper.araby_product_scraper()
products_scraper.elevatus_product_scraper()
products_scraper.elm_product_scraper()
# products_scraper.hudhud_product_scraper()//needs fixing
products_scraper.lisan_product_scraper()
products_scraper.qltyss_product_scraper()
products_scraper.wakeb_products_scraper()
# print(results)
