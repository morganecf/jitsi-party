from . import db
from datetime import datetime
from collections import defaultdict
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.hybrid import hybrid_property

USER_TIMEOUT = 30

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100))
    avatar = db.Column(db.String())
    last_seen = db.Column(db.Integer, default=lambda: datetime.utcnow().timestamp())

    @hybrid_property
    def is_active(self):
         return self.last_seen > datetime.utcnow().timestamp() - USER_TIMEOUT

    def ping(self):
        self.last_seen = datetime.utcnow().timestamp()
        db.session.add(self)
        db.session.commit()

    def get_avatar(self):
        species, color = self.avatar.split('-')
        return {
            'type': species,
            'color': color
        }

    @classmethod
    def create(cls, username, avatar):
        avatar = '{0}-{1}'.format(avatar['type'], avatar['color'])
        user = cls(username=username, avatar=avatar)
        db.session.add(user)
        db.session.commit()
        return user

    @classmethod
    def leave_room(cls, user_id, room_name):
        room = Room.query.filter_by(name=room_name).first()
        user_location = UserLocation.query.filter_by(user_id=user_id, room_id=room.id).first()
        if user_location:
            db.session.delete(user_location)
            db.session.commit()

    @classmethod
    def enter_room(cls, user_id, room_name):
        room = Room.query.filter_by(name=room_name).first()

        # Update location
        user_location = UserLocation(user_id=user_id, room_id=room.id)
        db.session.add(user_location)

        # Make room discovered by user
        user_room_state = UserRoomState(user_id=user_id, room_id=room.id, discovered=True)
        db.session.add(user_room_state)

        db.session.commit()

    @classmethod
    def get_active_users(cls):
        '''Return list of all active users'''
        users = cls.query.filter(cls.is_active).all()
        for user in users:
            user_dict = user.to_dict()
            location = UserLocation.query.filter_by(user_id=user.id).first()
            if location:
                room = Room.query.filter_by(id=location.room_id).first()
                user_dict['room'] = room.name if room else None
            yield user_dict
    
    @classmethod
    def get_active_users_by_room(cls):
        '''Return room:user_list mapping for all active users'''
        user_lists = defaultdict(list)
        user_locations = UserLocation.query.all()
        for location in user_locations:
            room = Room.query.filter_by(id=location.room_id).first()
            user = cls.query.filter_by(id=location.user_id).first()
            user_lists[room.name].append(user.to_dict())
        return user_lists

    def to_dict(self):
        user_dict = super().to_dict()
        user_dict['avatar'] = self.get_avatar()
        return user_dict

    def to_json(self):
        return {
            'userId': self.id,
            'username': self.username,
            'avatar': self.avatar,
            'lastSeen': self.last_seen
        }

    def __repr__(self):
        return 'User {0}'.format(self.username)


class Room(db.Model, SerializerMixin):
    __tablename__ = 'rooms'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, index=True)
    room_type = db.Column(db.String(50))

    def __repr__(self):
        return 'Room {0}'.format(self.name)


class UserLocation(db.Model, SerializerMixin):
    __tablename__ = 'user_locations'
    id = db.Column(db.Integer, primary_key=True)
    room_id = db.Column(db.Integer, db.ForeignKey('rooms.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), index=True)

    def __repr__(self):
        return 'User {0} is in Room {1}'.format(self.user_id, self.room_id)


class UserRoomState(db.Model, SerializerMixin):
    __tablename__ = 'user_room_states'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    room_id = db.Column(db.Integer, db.ForeignKey('rooms.id'))
    discovered = db.Column(db.Boolean)

    def __repr__(self):
        visited = 'visited' if self.discovered else 'not visited'
        return 'User {0} has {1} Room {2}'.format(self.user_id, visited, self.room_id)
