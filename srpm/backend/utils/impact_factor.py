import json
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import requests
import re


def get_impact_factor(bibtex, journal_name):
    options = Options()
    options.add_argument("--headless") 
    options.add_argument("--disable-gpu")  
    options.add_argument("--no-sandbox")  
    options.add_argument("--disable-dev-shm-usage")  
    options.add_argument("--disable-extensions")  
    options.add_argument("--disable-infobars")  
    options.add_argument("--window-size=1920,1080")  
    options.add_argument("--disable-blink-features=AutomationControlled")  

    driver = webdriver.Chrome(options=options)

    journal = get_journal(bibtex)

    if journal == "N/A":
        journal = journal_name

    if journal.isdigit():
        return json.dumps([{"error": "No results for this journal"}])

    try:
        driver.get("https://www.bioxbio.com")

        input = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "/html/body/div[1]/div[2]/div/form/div[2]/input"))
        )
        input.send_keys(journal)

        # Wait for the search button to be clickable
        search_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "/html/body/div[1]/div[2]/div/form/div[3]/input"))
        )
        search_button.click()

        WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located(
                (By.XPATH, "/html/body/div[1]/div[4]/div/div/div/div/div[5]/div[2]/div/div/div[1]/div[1]/div/div"))
        )

        # print(driver.page_source)
        # Handling no results div element
        try:
            no_results = driver.find_element(By.CLASS_NAME, "gs-snippet")
            if no_results.text == "No Results":
                return json.dumps([{"error": "No results for this journal"}])
        except NoSuchElementException:
            pass  # Continue execution if no results div element not found

        first_result = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH,
                                        "/html/body/div[1]/div[4]/div/div/div/div/div[5]/div[2]/div/div/div[1]/div[1]/div/div[1]/div/a"))
        )
        first_result.click()

        window_after = driver.window_handles[1]
        # Below line will switch to new tab
        driver.switch_to.window(window_after)

        title_div = WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located((By.XPATH, "/html/body/div[1]/div[2]/div[1]/div[1]/div/h1"))
        )
        title_text = title_div.text
        #time.sleep(3)

        
        table_div = driver.find_element(By.XPATH, "/html/body/div[1]/div[2]/div[1]/div[5]/div/div")
        table = table_div.find_element(By.TAG_NAME, "table")

        table_data = []

            # Extract table data
        for row in table.find_elements(By.TAG_NAME, "tr"):
            columns = row.find_elements(By.TAG_NAME, "td")
            row_data = [column.text.strip() for column in columns]
            table_data.append(row_data)

            # Convert table data to a dictionary
        table_dict = {"table_data": table_data}

            #json_data = json.dumps(table_dict)

        return table_dict

    except Exception as e:
        print("Error:", e)
        return json.dumps([{"error": "Error while fetching results"}])

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


