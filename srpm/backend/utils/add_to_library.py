import mysql.connector
from datetime import datetime

def add_to_library(user, title, abstract, authors, author_profile_links, journal, bibtex, related, citation_count, full_text_type, full_text_link):
    try:
        connection = mysql.connector.connect(
            host='localhost',
            user='root',
            password='pass',
            database='srpm'
        )
        
        cursor = connection.cursor()

        # Prepare SQL query to insert data into the libraries table
        insert_query = """
        INSERT INTO libraries (user, title, abstract, authors, author_profile_links, journal_name, bibtex_link, related_articles_link, citation_count, full_text_type, full_text_link, created_at)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """

        # Current date and time
        created_at = datetime.now()

        # Data to insert into the table
        data = (user, title, abstract, authors, author_profile_links, journal, bibtex, related, citation_count, full_text_type, full_text_link, created_at)

        # Execute the query
        cursor.execute(insert_query, data)

        # Commit changes
        connection.commit()

        return True

    except mysql.connector.Error as error:
        print(error)
        return False

    finally:
        # Close cursor and connection
        if connection.is_connected():
            cursor.close()
            connection.close()