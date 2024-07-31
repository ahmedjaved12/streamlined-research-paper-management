import json
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
import requests
import re

options = Options()
#options.add_argument("--headless")
options.add_argument("--disable-gpu")
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")
options.add_argument("--disable-extensions")
options.add_argument("--disable-infobars")
options.add_argument("--window-size=1920,1080")
options.add_argument("--disable-blink-features=AutomationControlled")


def get_hec_ranking(bibtex, journal):
    driver = webdriver.Chrome(options=options)

    journal_name = get_journal(bibtex)

    if journal_name == "N/A":
        journal_name = journal
        
    try:
        driver.get("https://hjrs.hec.gov.pk/")

        input_box = driver.find_element(By.ID, "journals-title")
        input_box.send_keys(journal_name)
        time.sleep(1)

        search_button = driver.find_element(By.CLASS_NAME, "btn-default")
        search_button.click()
        time.sleep(2)

        error_div = driver.find_elements(By.CLASS_NAME, "alert-danger")
        if error_div:
            return json.dumps([{"error": "not recognized by HEC"}])

        issn_tag = driver.find_element(By.XPATH,
                                       '/html/body/div[1]/div[1]/div[2]/div/div/div/div[1]/div[1]/div[1]/div[2]/h5')
        issn = issn_tag.text.strip() if issn_tag else "N/A"

        country_tag = driver.find_element(By.XPATH,
                                          '/html/body/div[1]/div[1]/div[2]/div/div/div/div[1]/div[1]/div[1]/div[4]/h5')
        country = country_tag.text.strip() if country_tag else "N/A"

        scopus_tag = driver.find_element(By.XPATH,
                                         '/html/body/div[1]/div[1]/div[2]/div/div/div/div[1]/div[1]/div[2]/div[2]/h4')
        scopus = "Yes" if "Yes" in scopus_tag.text.strip() else "N/A" if scopus_tag else "N/A"

        wos_tag = driver.find_element(By.XPATH,
                                      '/html/body/div[1]/div[1]/div[2]/div/div/div/div[1]/div[1]/div[2]/div[3]/h4')
        wos = "Yes" if "Yes" in wos_tag.text.strip() else "N/A" if wos_tag else "N/A"

        category_tag = driver.find_element(By.XPATH,
                                           '/html/body/div[1]/div[1]/div[2]/div/div/div/div[2]/div/div/div/div[1]/div/div[2]/div/div[2]/div/span')
        category = category_tag.text.strip() if category_tag else "N/A"

        medallion_tag = driver.find_element(By.XPATH,
                                            '/html/body/div[1]/div[1]/div[2]/div/div/div/div[2]/div/div/div/div[1]/div/div[2]/div/div[3]/div/span')
        medallion = medallion_tag.text.strip() if medallion_tag else "N/A"

        jpi_tag = driver.find_element(By.XPATH,
                                      '/html/body/div[1]/div[1]/div[2]/div/div/div/div[2]/div/div/div/div[1]/div/div[2]/div/div[1]/div/span')
        jpi = jpi_tag.text.strip() if jpi_tag else "N/A"

        sap_tag = driver.find_element(By.XPATH,
                                      '/html/body/div[1]/div[1]/div[2]/div/div/div/div[2]/div/div/div/div[1]/div/div[2]/div/div[4]/div/span')
        sap = sap_tag.text.strip() if sap_tag else "N/A"

        data = [{
            "ISSN": issn,
            "Country": country,
            "Scopus": scopus,
            "WoS": wos,
            "Category": category,
            "Medallion": medallion,
            "JPI": jpi,
            "SAP": sap,
        }]

        # json_data = json.dumps(data)

        return data

    finally:
        driver.quit()


def get_journal(url):
    try:
        response = requests.get(url)

        journal_pattern = re.compile(r'journal\s*=\s*{(.+?)}', re.IGNORECASE)
        match = journal_pattern.search(response.text)

        if match:
            return match.group(1)
        else:
            return "N/A"

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return "N/A"
