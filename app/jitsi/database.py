from . import db
from .models import User, Room, RoomState, RoomUser

def create_user(username, avatar):
    # TODO change this once Daniel fixes avatars
    avatar = '-'.join(map(str, avatar))
    user = User(username=username, avatar=avatar)
    db.session.add(user)
    db.session.commit()
    return user

def update_user_location(user_id, room):
    room = Room.query.filter_by(name=room).first()

    # Delete previous room user was in
    room_user = RoomUser.query.filter_by(user_id=user_id).first()
    if room_user:
        db.session.delete(room_user)

    # Add user to current room
    room_user = RoomUser(id=room.id, user_id=user_id)
    db.session.add(room_user)

    # Make room discovered by user
    room_state = RoomState(id=user_id, room_id=room.id, discovered=True)
    db.session.add(room_state)

    db.session.commit()

def refresh_user(user_id):
    user = User.query.filter_by(id=user_id).first()
    print('refreshing user:', user)
    if user:
        user.ping()
        db.session.add(user)
        db.session.commit()
