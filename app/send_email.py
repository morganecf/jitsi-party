import sys
import ssl
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

sender = sys.argv[1]
password = sys.argv[2]
receiver = sys.argv[3] 
message = sys.argv[4]

port = 465
smtp_server = 'smtp.gmail.com'

try:
    email = MIMEMultipart('alternative')
    email['Subject'] = 'Jitsi Party Alert'
    email['From'] = sender
    email['To'] = receiver
    email.attach(MIMEText(message, 'html'))

    server = smtplib.SMTP_SSL(smtp_server, port)
    server.login(sender, password)
    server.sendmail(sender, receiver, email.as_string())
except:
    print('Something went wrong sending a message to the moderator:', email.as_string())
