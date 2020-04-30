from . import socketio, db
from flask_socketio import emit
from .models import User

@socketio.on('ping-user')
def on_ping(message):
    user = User.query.filter_by(id=message['user_id']).first()
    if user:
        user.ping()

@socketio.on('leave-room')
def on_leave_room(message):
    old_room = User.leave_room(message['user_id'], message['room'])
    emit('user-left-room', old_room.name, broadcast=True)

@socketio.on('enter-room')
def on_enter_room(message):
    new_room = User.enter_room(message['user_id'], message['room'])
    emit('user-entered-room', new_room.name, broadcast=True)
