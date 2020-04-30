from . import db
from datetime import datetime
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

    @staticmethod
    def create(username, avatar):
        # TODO change this once Daniel fixes avatars
        avatar = '-'.join(map(str, avatar))
        user = User(username=username, avatar=avatar)
        db.session.add(user)
        db.session.commit()
        return user

    @staticmethod
    def leave_room(user_id, room_name):
        room = Room.query.filter_by(name=room_name).first()
        user_location = UserLocation.query.filter_by(user_id=user_id, room_id=room.id).first()
        if user_location:
            db.session.delete(user_location)
            db.session.commit()
        return room

    @staticmethod
    def enter_room(user_id, room_name):
        room = Room.query.filter_by(name=room_name).first()

        # Update location
        user_location = UserLocation(user_id=user_id, room_id=room.id)
        db.session.add(user_location)

        # Make room discovered by user
        user_room_state = UserRoomState(user_id=user_id, room_id=room.id, discovered=True)
        db.session.add(user_room_state)

        db.session.commit()
        return room

    @staticmethod
    def get_active_users():
        users = User.query.filter(User.is_active).all()
        for user in users:
            user_dict = user.to_dict()
            location = UserLocation.query.filter_by(user_id=user.id).first()
            if location:
                room = Room.query.filter_by(id=location.room_id).first()
                user_dict['room'] = room.name if room else None
            yield user_dict
    
    @staticmethod
    def get_active_users_for_room(room_name):
        room = Room.query.filter_by(name=room_name).first()
        if room:
            locations = UserLocation.query.filter_by(room_id=room.id).all()
            for location in locations:
                user = User.query.filter_by(id=location.user_id).first()
                if user.is_active:
                    yield user.to_dict()

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
