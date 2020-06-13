from . import socketio, db
from flask_socketio import emit
from .models import User


def broadcast_state():
    users = User.get_active_users_by_room()
    emit('user-event', users, broadcast=True)


@socketio.on('disconnect')
def on_disconnect():
    broadcast_state()


@socketio.on('connect')
def on_connect():
    broadcast_state()


@socketio.on('ping-user')
def on_ping(message):
    user = User.query.filter_by(id=message['id']).first()
    if user:
        user.ping()


@socketio.on('leave-room')
def on_leave_room(message):
    User.leave_room(message['user']['id'], message['room'])
    broadcast_state()


@socketio.on('enter-room')
def on_enter_room(message):
    User.enter_room(message['user']['id'], message['room'])
    broadcast_state()


@socketio.on('poke')
def poke(message):
    emit('poke-{0}'.format(message['to']['id']), message, broadcast=True)
