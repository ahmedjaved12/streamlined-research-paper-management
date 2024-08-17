from rest_framework.response import Response
from rest_framework.decorators import api_view
from .utils.search import search_gs
from .utils.translate import translate
from .utils.summarize import summarize
from .utils.author_relevance import calculate_relevance
from .utils.hec_rating import get_hec_ranking
from .utils.add_to_library import add_to_library
from .utils.impact_factor import get_impact_factor
from .utils.otp import send_otp_to_email, verify_otp
from .utils.get_interests import get_interests
from .utils.recommendations import get_recommdations
from django.views.decorators.csrf import csrf_exempt
import mysql.connector
from django.http import JsonResponse
import json

@api_view(('GET',))
def searchView(request):
    search_term = request.GET.get('searchTerm')
    start = request.GET.get('start')

    search_results = search_gs(search_term, start)

    return Response(search_results)

@api_view(('GET',))
def translatorView(request):
    text = request.GET.get('text')
    to = request.GET.get('to')

    translated_text = translate(text, to)

    return Response(translated_text)


@api_view(('GET',))
def summarizationView(request):
    text = request.GET.get('text')

    summarized_text = summarize(text)

    return Response(summarized_text)



@api_view(['POST'])
def registerView(request):
    if request.method == 'POST':
        try:
            data = request.data
            name = data.get('name')
            email = data.get('email')
            country = data.get('country')
            occupation = data.get('occupation')
            age = data.get('age')
            password = data.get('password')
            confirm_password = data.get('confirmPassword')
            interests = json.dumps(data.get('interests', []))  

            if not all([name, email, password, confirm_password]):
                return JsonResponse({'error': 'Please fill in all required fields'}, status=400)
            if password != confirm_password:
                return JsonResponse({'error': 'Passwords do not match'}, status=400)

            connection = mysql.connector.connect(
                host='localhost',
                user='root',
                password='12345',
                database='srpm'
            )

            if connection.is_connected():
                cursor = connection.cursor()
                query = "INSERT INTO users (name, email, country, occupation, age, password, interests) VALUES (%s, %s, %s, %s, %s, %s, %s)"
                cursor.execute(query, (name, email, country, occupation, age, password, interests))
                connection.commit()
                cursor.close()
                connection.close()

                return JsonResponse({'message': 'Registration successful'})
            else:
                return JsonResponse({'error': 'Failed to connect to MySQL'}, status=500)
        except mysql.connector.Error as error:
            return JsonResponse({'error': 'Registration failed: {}'.format(error)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)


    

@csrf_exempt
@api_view(['POST'])
def loginView(request):
    if request.method == 'POST':
        
        data = request.data
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return JsonResponse({'error': 'Please provide both email and password'}, status=400)

        try:
            connection = mysql.connector.connect(
                host='localhost',
                user='root',
                password='12345',
                database='srpm'
            )

            if connection.is_connected():
                cursor = connection.cursor()
                query = "SELECT id FROM users WHERE email = %s AND password = %s"
                cursor.execute(query, (email, password))
                user_id = cursor.fetchone()

                if user_id:
                    return JsonResponse({'message': 'Login successful'})
                else:
                    return JsonResponse({'error': 'Invalid email or password'}, status=401)

                cursor.close()
                connection.close()
            else:
                return JsonResponse({'error': 'Failed to connect to MySQL'}, status=500)
        except mysql.connector.Error as error:
            return JsonResponse({'error': 'Login failed: {}'.format(error)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
    

@api_view(('GET',))
def authorRelevanceView(request):
    title = request.GET.get('title')
    authors = json.loads(request.GET.get('authors'))
    author_profile_links = json.loads(request.GET.get('author_profile_links'))

    res = calculate_relevance(title, authors, author_profile_links)

    return JsonResponse(res, safe=False)

@api_view(('GET',))
def hecRatingView(request):
    journal = request.GET.get('journal')
    bibtex = request.GET.get('bibtex')
    rating = get_hec_ranking(bibtex, journal)

    return JsonResponse(rating, safe=False)

@csrf_exempt
@api_view(['POST'])
def addToLibraryView(request):
    if request.method == 'POST':

        data = request.data
        user = data.get('user')
        title = data.get('title')
        abstract = data.get('abstract')
        authors = json.dumps(data.get('authors', []))
        apl = json.dumps(data.get('apl', []))
        bibtex = data.get('bibtex')
        related = data.get('related')
        journal = data.get('journal')
        citation_count = data.get('citation_count')
        ftt = data.get('ftt')
        ftl = data.get('ftl')

        print(data)

        success = add_to_library(user, title, abstract, authors, apl, journal, bibtex, related, citation_count, ftt, ftl)

        if (success):
            return JsonResponse({'message': 'Add to Library successful'})
        else:
            return JsonResponse({'error': 'Failed to add in library'})
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

@api_view(('GET',))   
def libraryView(request):
    if request.method == 'GET':
        user_email = request.GET.get('email')  
        if not user_email:
            return JsonResponse({'error': 'Email parameter is required'}, status=400)
        
        try:
            connection = mysql.connector.connect(
                host='localhost',
                user='root',
                password='pass',
                database='srpm'
            )

            cursor = connection.cursor(dictionary=True)
            query = "SELECT * FROM libraries WHERE user = %s"
            cursor.execute(query, (user_email,))
            papers = cursor.fetchall()

            cursor.close()
            connection.close()

            return JsonResponse(papers, safe=False) 
        except mysql.connector.Error as error:
            return JsonResponse({'error': f'Database error: {error}'}, status=500)
    else:
        return JsonResponse({'error': 'Only GET requests are supported'}, status=405)

@api_view(('GET',))
def impactFactorView(request):
    journal = request.GET.get('journal')
    bibtex = request.GET.get('bibtex')

    print(journal)
    print(bibtex)

    table = get_impact_factor(bibtex, journal)

    return JsonResponse(table, safe=False)

@api_view(['POST'])
def sendOTPView(request):
    if request.method == 'POST':

        email = request.data.get('email')
        otp_sent = send_otp_to_email(email)

        if otp_sent:
            return JsonResponse({'success': 'OTP sent to user'}, status=200)
        else:
            return JsonResponse({'error': 'Error occured while sending OTP'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
    
@api_view(['POST'])
def verifyOTPView(request):
    if request.method == 'POST':

        email = request.data.get('email')
        otp = request.data.get('otp')

        otp_verified = verify_otp(otp, email)

        if otp_verified:
            return JsonResponse({'success': 'OTP verified successfully'}, status=200)
        else:
            return JsonResponse({'error': 'Error occured while verifying OTP'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
    
@csrf_exempt
@api_view(['POST'])
def AdminLoginView(request):
    if request.method == 'POST':
        
        data = request.data
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return JsonResponse({'error': 'Please provide both username and password'}, status=400)

        try:
            connection = mysql.connector.connect(
                host='localhost',
                user='root',
                password='12345',
                database='srpm'
            )

            if connection.is_connected():
                cursor = connection.cursor()
                query = "SELECT id FROM admins WHERE username = %s AND password = %s"
                cursor.execute(query, (username, password))
                user_id = cursor.fetchone()

                if user_id:
                    return JsonResponse({'message': 'Login successful'})
                else:
                    return JsonResponse({'error': 'Invalid username or password'}, status=401)

                cursor.close()
                connection.close()
            else:
                return JsonResponse({'error': 'Failed to connect to MySQL'}, status=500)
        except mysql.connector.Error as error:
            return JsonResponse({'error': 'Login failed: {}'.format(error)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
    

@api_view(('GET',))   
def AllUsersView(request):
    if request.method == 'GET':
        try:
            connection = mysql.connector.connect(
                host='localhost',
                user='root',
                password='12345',
                database='srpm'
            )

            cursor = connection.cursor(dictionary=True)
            query = "SELECT * FROM users"
            cursor.execute(query)
            users = cursor.fetchall()

            cursor.close()
            connection.close()

            return JsonResponse(users, safe=False) 
        except mysql.connector.Error as error:
            return JsonResponse({'error': f'Database error: {error}'}, status=500)
    else:
        return JsonResponse({'error': 'Only GET requests are supported'}, status=405)
    
@api_view(['POST'])
def DeleteUserView(request):
    if request.method == 'POST':
        id = request.data.get('id')

        if not id:
            return JsonResponse({'error': 'User ID is required'}, status=400)

        try:
            connection = mysql.connector.connect(
                host='localhost',
                user='root',
                password='12345',
                database='srpm'
            )
            cursor = connection.cursor(dictionary=True)
            query = "DELETE FROM users WHERE id = %s"
            cursor.execute(query, (id,)) 

            connection.commit()  

            cursor.close()
            connection.close()

            return JsonResponse({'success': 'User deleted successfully.'})
        except mysql.connector.Error as error:
            print(f"Database error: {error}")  # Log the error
            return JsonResponse({'error': f'Database error: {error}'}, status=500)
    else:
        return JsonResponse({'error': 'Only POST requests are supported'}, status=405)
    

@api_view(('GET',))
def recommendationsView(request):
    user_email = request.GET.get('email')
    recent_searches = json.loads(request.GET.get('rs'))

    interests = get_interests(user_email)

    result = get_recommdations(interests, recent_searches)

    return Response(result)