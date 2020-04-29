from . import db
from datetime import datetime


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100))
    avatar = db.Column(db.String())
    last_seen = db.Column(db.DateTime(), default=datetime.utcnow)
    online = db.Column(db.Boolean, default=True)

    def ping(self):
        self.last_seen = datetime.utcnow()
        self.online = True

    def to_json(self):
        return {
            'userId': self.id,
            'username': self.username,
            'avatar': self.avatar
        }

    def __repr__(self):
        return 'User {0}'.format(self.username)


class Room(db.Model):
    __tablename__ = 'rooms'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, index=True)
    room_type = db.Column(db.String(50))
    capacity = db.Column(db.SmallInteger, nullable=True)

    def __repr__(self):
        return 'Room {0}'.format(self.name)


class RoomUser(db.Model):
    __tablename__ = 'room_users'
    id = db.Column(db.Integer, db.ForeignKey('rooms.id'), primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), index=True)

    def __repr__(self):
        return 'Room {0} has User {1}'.format(self.id, self.user_id)


class RoomState(db.Model):
    __tablename__ = 'room_states'
    id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    room_id = db.Column(db.Integer, db.ForeignKey('rooms.id'))
    discovered = db.Column(db.Boolean)

    def __repr__(self):
        visited = 'visited' if self.discovered else 'not visited'
        return 'User {0} has {1} Room {2}'.format(self.id, visited, self.room_id)
