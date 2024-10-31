from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import StaleElementReferenceException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from chromedriver_py import binary_path # this will get you the path variable



import requests
from bs4 import BeautifulSoup
import csv
from urllib.parse import urljoin
import csv
import json
import time
import re
from webdriver_manager.chrome import ChromeDriverManager


# class Scraper:
#     def __init__(self, url):
#         self.url = url
#         self.driver = webdriver.Chrome()
#         self.driver.get(url)

class Scraper:
    def __init__(self,  options=None):
        pass
        # self.url = url
        # if options is None:
        #     options = webdriver.ChromeOptions()
        # self.driver = webdriver.Chrome(options=options)
        # self.driver.get(url)

    def init_driver(self, url, options=None):
        options = Options()
                    
        options.add_argument('--ignore-certificate-errors')
        options.add_argument('--incognito')
        options.add_argument('--headless')
        options.add_argument('--no-sandbox')
        options.add_argument('--disable-dev-shm-usage')
        self.svc = webdriver.ChromeService(binary_path)

        # self.driver = webdriver.Chrome()
        self.driver = webdriver.Chrome(service=self.svc,  options=options)

        self.driver.get(url)
        return self.driver

    def scroll_down(self):
        page_height = self.driver.execute_script(
            "return document.body.scrollHeight")
        current_scroll_position = 0
        scroll_increment = 100
        while current_scroll_position < page_height:
            self.driver.execute_script(
                f"window.scrollBy(0, {scroll_increment});")
            time.sleep(0.2)
            current_scroll_position += scroll_increment
