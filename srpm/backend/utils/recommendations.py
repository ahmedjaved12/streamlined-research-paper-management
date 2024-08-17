from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
import time
import re
import traceback
import json
import gc  # For garbage collection
import psutil  # For checking running processes
import random

# User-Agent for Chrome 126 on Windows 10
USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
cookies_file_path = 'path'

# Set up Chrome options with specified user agent and window size
# Set up Chrome options
chrome_options = Options()
chrome_options.add_argument(f'user-agent={USER_AGENT}')
chrome_options.add_argument('--no-sandbox')
chrome_options.add_argument('--disable-dev-shm-usage')
chrome_options.add_argument('--disable-gpu')
chrome_options.add_argument('--headless')
chrome_options.add_argument('--disable-extensions')
chrome_options.add_argument('--disable-popup-blocking')
chrome_options.add_argument('--ignore-certificate-errors')
chrome_options.add_argument('--lang=en-US')
chrome_options.add_experimental_option('excludeSwitches', ['enable-logging'])
chrome_options.add_argument('--start-maximized')


def load_cookies(driver):
    with open(cookies_file_path, 'r') as file:
        cookies = json.load(file)
        for cookie in cookies:
            if 'sameSite' in cookie:
                cookie['sameSite'] = 'None'
            driver.add_cookie(cookie)


def get_recommdations(interest_list, recent_searches):
    driver = None
    interest_list.extend(recent_searches)
    print(interest_list)

    # Lists to store scraped data
    titles = []
    authors_all = []
    author_profiles_links_all = []
    abstracts = []
    bibtexs = []
    journal_names = []
    related_articles = []
    citation_counts = []
    full_text_types = []
    full_text_links = []

    try:
        driver = webdriver.Chrome(options=chrome_options)
        driver.get("https://scholar.google.com/")
        load_cookies(driver)
        driver.refresh()
        "refreshed driver"
        time.sleep(2)

        for p in interest_list:
            url = f"https://scholar.google.com/scholar?as_vis=1&start=0&q={p}&hl=en&as_sdt=0,5"

            driver.get(url)
            time.sleep(1)

            # Wait for the page to load
            WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR, "div.gs_r")))

            # Get page source after waiting
            html_content = driver.page_source

            # Parse page source with BeautifulSoup
            soup = BeautifulSoup(html_content, 'html.parser')

            # Check for reCAPTCHA or other blocks
            if soup.find_all(class_='g-recaptcha'):
                print("reCAPTCHA detected. Unable to proceed with scraping.")
                continue

            # Find all articles
            articles = soup.findAll("div", {"class": "gs_r gs_or gs_scl"})

            if len(articles) == 0:
                print("Length of articles is zero.")
                continue

            # Extract data from each article
            for a in articles:
                title_h3 = a.find("h3", class_="gs_rt")
                title = title_h3.find("a").text.strip()
                titles.append(title)

                authors_data = a.find("div", class_="gs_a").text.strip()
                authors_data = authors_data.split("-")
                authors = authors_data[0].strip()
                if ',' in authors:
                    authors_list = [name.strip() for name in authors.split(',')]
                else:
                    authors_list = [authors.strip()]
                authors_all.append(authors_list)

                author_profiles_link_a_tags = a.find("div", class_="gs_a").findAll("a")
                author_profile_links = []
                for author in authors_list:
                    found_link = False
                    for tag in author_profiles_link_a_tags:
                        if author == tag.text:
                            href = tag.get('href')
                            author_profile_links.append(href)
                            found_link = True
                            break
                    if not found_link:
                        author_profile_links.append("N/A")
                author_profiles_links_all.append(author_profile_links)

                journal_name = str(authors_data[1])
                if ',' in journal_name:
                    journal_name = str(journal_name.split(",")[0].strip())
                else:
                    journal_name = journal_name.strip()
                journal_names.append(journal_name)

                abstract = a.find("div", class_="gs_rs").text.strip()
                abstracts.append(abstract)

                citation_div = a.find("div", class_="gs_fl gs_flb")
                cited_by_pattern = re.compile(r"Cited by \d+")
                citation_string = citation_div.find(string=cited_by_pattern).strip()
                citation_digit = int(citation_string.replace("Cited by ", ""))
                citation_counts.append(citation_digit)

                citation_div_as = citation_div.findAll("a")

                bibtex_link = "N/A"
                related_article = "N/A"
                for link in citation_div_as:
                    if "Import into BibTeX" in link.text:
                        try:
                            bibtex_link = link.get("href")
                            break
                        except Exception as e:
                            print(f"Error: {e}")
                    if "Related articles" in link.text:
                        try:
                            related_article = link.get("href")
                        except Exception as e:
                            print(f"Error: {e}")
                bibtexs.append(bibtex_link)
                related_articles.append(related_article)

                if a.find("div", class_="gs_or_ggsm"):
                    full_text_type = a.find("div", class_="gs_or_ggsm").find("span").text.strip()
                    full_text_types.append(full_text_type)
                    full_text_link = a.find("div", class_="gs_or_ggsm").find("a").get('href')
                    full_text_links.append(full_text_link)
                else:
                    full_text_types.append("N/A")
                    full_text_links.append("N/A")

    except Exception as e:
        print(f"Error: {e}")

    finally:
        if driver:
            driver.quit()
        gc.collect()

    json_data = [
        {
            "title": jtitle,
            "author": jauthor,
            "author_profile_links": jauthor_profile_links,
            "abstract": jabstract,
            "citation_count": jcitation_count,
            "bibtex_link": jbibtex_link,
            "journal_name": jjournal_name,
            "related_articles": jrelated_article,
            "full_text_type": jfull_text_type,
            "full_text_link": jfull_text_link
        }
        for
        jtitle, jauthor, jauthor_profile_links, jabstract, jcitation_count, jbibtex_link, jjournal_name, jrelated_article, jfull_text_type, jfull_text_link
        in zip(titles, authors_all, author_profiles_links_all, abstracts, citation_counts, bibtexs, journal_names, related_articles, full_text_types,
                full_text_links)
    ]

    random.shuffle(json_data)

    return json_data
