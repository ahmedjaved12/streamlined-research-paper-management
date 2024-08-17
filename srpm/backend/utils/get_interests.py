import mysql.connector
import json

def get_interests(email):
    try:
        # Establishing the connection
        connection = mysql.connector.connect(
            host='localhost',
            user='root',
            password='pass',
            database='srpm'
        )
        
        # Check if the connection is established
        if connection.is_connected():
            cursor = connection.cursor()
            
            # Prepare SQL query to SELECT interests based on email
            query = "SELECT interests FROM users WHERE email = %s"
            cursor.execute(query, (email,))
            
            # Fetch the result
            result = cursor.fetchone()
            cursor.close()
            connection.close()
            
            if result:
                # Parse the JSON stored in interests
                interests = json.loads(result[0])
                return interests
            else:
                # Return an empty list if no interests are found
                return []
        else:
            # Return an empty list if connection could not be established
            return []

    except mysql.connector.Error as error:
        # Print the error and return an empty list if an exception occurs
        print(f"Database error: {error}")
        return []
