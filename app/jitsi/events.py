from . import socketio, db
from flask_socketio import emit
from .models import User

@socketio.on('ping-user')
def on_ping(message):
    '''Update a user's last_seen column with the current timestamp'''
    user = User.query.filter_by(id=message['user_id']).first()
    if user:
        user.ping()

@socketio.on('enter-room')
def on_enter_room(message):
    '''Update a user's location and the room's status for that user'''
    User.update_location(message['user_id'], message['room'])
