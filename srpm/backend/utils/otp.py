import random
import string
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta
from email_validator import validate_email, EmailNotValidError

otp_storage = {}

def send_otp_to_email(user_email):
    smtp_server = 'smtp.gmail.com'
    smtp_port = 587
    smtp_user = 'email'
    smtp_password = 'pass'
    email = user_email
    
    try:
        # Validate email address
        v = validate_email(email)
        email = v.email
    except EmailNotValidError as e:
        print("invalid email")
        return False
    
    otp = ''.join(random.choices(string.digits, k=6))
    msg = MIMEMultipart()
    msg['From'] = smtp_user
    msg['To'] = email
    msg['Subject'] = 'SRPM OTP Code'

    body = f'Your OTP code is {otp}. It is valid for 10 minutes.'
    msg.attach(MIMEText(body, 'plain'))

    try:
        # Establish a secure session with the server
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(smtp_user, smtp_password)
        text = msg.as_string()
        server.sendmail(smtp_user, email, text)
        server.quit()
        otp_storage[email] = {
        'otp': otp,
        'timestamp': datetime.now(),
        }
        print(f"OTP sent to {email}")
        return True
    except Exception as e:
        print(f"Failed to send OTP: {e}")
        return False
    
def verify_otp(otp, email):
    stored_otp = otp_storage.get(email)
    if stored_otp and stored_otp['otp'] == otp:
        time_difference = datetime.now() - stored_otp['timestamp']
        if time_difference < timedelta(minutes=10): 
            print("OTP verified successfully")
            if email in otp_storage:
                del otp_storage[email]
            return True
        else:
            print("OTP expired")
            return False
    else:
        print("Invalid OTP")
        return False