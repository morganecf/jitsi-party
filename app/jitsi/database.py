from . import db
from datetime import datetime
from .models import User, Room, UserRoomState, UserLocation

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
