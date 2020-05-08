from . import socketio, db
from flask_socketio import emit
from .models import User

@socketio.on('disconnect')
def on_disconnect():
    users = User.get_active_users_by_room()
    emit('user-event', users, broadcast=True)

@socketio.on('connect')
def on_connect():
    users = User.get_active_users_by_room()
    emit('user-event', users, broadcast=True)

@socketio.on('ping-user')
def on_ping(message):
    user = User.query.filter_by(id=message['user_id']).first()
    if user:
        user.ping()

@socketio.on('leave-room')
def on_leave_room(message):
    User.leave_room(message['user']['userId'], message['room'])
    users = User.get_active_users_by_room()
    emit('user-event', users, broadcast=True)

@socketio.on('enter-room')
def on_enter_room(message):
    User.enter_room(message['user']['userId'], message['room'])
    users = User.get_active_users_by_room()
    emit('user-event', users, broadcast=True)
