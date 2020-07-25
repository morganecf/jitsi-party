import sys
from twilio.rest import Client

account_sid = sys.argv[1]
auth_token = sys.argv[2]
sender = sys.argv[3]
receiver = sys.argv[4]
message = sys.argv[5]

client = Client(account_sid, auth_token)

message = client.messages.create(
    to=receiver, 
    from_=sender,
    body=message)

print(message.sid)
