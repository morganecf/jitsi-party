from . import socketio
from .database import update_user_location, refresh_user
from flask_socketio import emit

@socketio.on('connect')
def on_connect():
    print('Client connected')

@socketio.on('disconnect')
def on_disconnect():
    print('Client disconnected')

@socketio.on('ping-user')
def on_ping(message):
    refresh_user(message['user_id'])

@socketio.on('enter-room')
def on_enter_room(message):
    update_user_location(**message)
