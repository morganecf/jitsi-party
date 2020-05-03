from . import socketio, db
from flask_socketio import emit
from .models import User

@socketio.on('disconnect')
def on_disconnect():
    emit('user-disconnected', broadcast=True)

@socketio.on('ping-user')
def on_ping(message):
    user = User.query.filter_by(id=message['user_id']).first()
    if user:
        user.ping()

@socketio.on('leave-room')
def on_leave_room(message):
    user, room = message
    User.leave_room(user['userId'], room)
    message = {
        'user': user,
        'room': room
    }
    emit('user-left-room', message, broadcast=True)

@socketio.on('enter-room')
def on_enter_room(message):
    user, room = message
    User.enter_room(user['userId'], room)
    message = {
        'user': user,
        'room': room
    }
    emit('user-entered-room', message, broadcast=True)
