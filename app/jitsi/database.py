from . import db
from datetime import datetime
from .models import User, Room, UserRoomState, UserLocation

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
    user_location = UserLocation.query.filter_by(user_id=user_id).first()
    if user_location:
        db.session.delete(user_location)

    # Add user to current room
    user_location = UserLocation(room_id=room.id, user_id=user_id)
    db.session.add(user_location)

    # Make room discovered by user
    user_room_state = UserRoomState(user_id=user_id, room_id=room.id, discovered=True)
    db.session.add(user_room_state)

    db.session.commit()

def refresh_user(user_id):
    user = User.query.filter_by(id=user_id).first()
    if user:
        user.ping()
        db.session.add(user)
        db.session.commit()

def get_all_active_users():
    users = User.query.filter(User.is_active).all()
    for user in users:
        user_dict = user.to_dict()
        location = UserLocation.query.filter_by(user_id=user.id).first()
        if location:
            room = Room.query.filter_by(id=location.room_id).first()
            user_dict['room'] = room.name if room else None
        yield user_dict

def get_active_users_for_room(room_name):
    room = Room.query.filter_by(name=room_name).first()
    locations = UserLocation.query.filter_by(room_id=room.id).all()
    for location in locations:
        user = User.query.filter_by(id=location.user_id).first()
        if user.is_active:
            yield user.to_dict()
