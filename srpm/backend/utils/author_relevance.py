from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
from pyjarowinkler import distance


relevance_ratings = []

options = Options()
#options.add_argument("--headless") 
options.add_argument("--disable-gpu")  
options.add_argument("--no-sandbox")  
options.add_argument("--disable-dev-shm-usage")  
options.add_argument("--disable-extensions")  
options.add_argument("--disable-infobars")  
options.add_argument("--window-size=1920,1080")  
options.add_argument("--disable-blink-features=AutomationControlled")  


def calculate_relevance(title, authors, author_profile_links):

    driver = webdriver.Chrome(options=options)

    relevance_ratings.clear()

    #print("auth pf links: "+str(author_profile_links))
    for link in author_profile_links:
        #print(link)
        if link == "N/A":
            relevance_ratings.append("NO GS PROFILE")
        else:
            try:
                url = "https://scholar.google.com" + link
                driver.get(url)
                page_source = driver.page_source

                soup = BeautifulSoup(page_source, "html.parser")

                author_interests = soup.find("div", id="gsc_prf_int")

                if author_interests:
                    cosine_sim = 0.0
                    total_cs = 0.0
                    total = 0.0
                    substring_found = False
                    interests = author_interests.find_all("a")
                    if interests:
                        #revised formula
                        for i in interests:
                            if i.text.lower() in title.lower():
                                substring_found = True
                                break
                            cosine_sim = cosine_similarity_between_strings(i.text, title)
                            total_cs += cosine_sim
                            total += 1.0
                        if substring_found:
                            cosine_sim_avg = 100.00
                        else:
                            cosine_sim_avg = (total_cs / total) * 100
                        formatted_consine_sim = "{:.2f}".format(cosine_sim_avg)
                        relevance_ratings.append(formatted_consine_sim)
                    else:
                        relevance_ratings.append("NO INTERESTS MENTIONED")
                else:
                    relevance_ratings.append("NO DATA")
            except Exception as e:
                print("Error:", e)
                relevance_ratings.append("NO DATA")

    driver.quit()

    json_data = [{"author": author, "relevance": relevance} for author, relevance in zip(authors, relevance_ratings)]
    return json_data


def cosine_similarity_between_strings(string1, string2):
    str1 = string1.lower()
    str2 = string2.lower()

    # Calculate Jaro-Winkler similarity
    similarity_score = distance.get_jaro_distance(str1, str2, winkler=True)

    return similarity_score


