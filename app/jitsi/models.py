import logging

from . import db
from collections import defaultdict
from datetime import datetime
from sqlalchemy import UniqueConstraint
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import relationship
from sqlalchemy_serializer import SerializerMixin


USER_TIMEOUT = 30
logger = logging.getLogger(__name__)


class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100))
    avatar = db.Column(db.String())
    last_seen = db.Column(db.Integer, default=lambda: datetime.utcnow().timestamp())

    room_id = db.Column(db.Integer, db.ForeignKey('rooms.id'))
    room = relationship('Room')

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
        user = User.query.filter_by(id=user_id).first()

        if not user.room:
            # Navigated from one hallway to another.
            return

        if user.room.name != room_name:
            logger.warning(f"User {user.id} ({user.username}) tried to leave room {room_name} but was in room {room.name}")
            return

        user.room = None
        db.session.commit()

    @classmethod
    def enter_room(cls, user_id, room_name):
        room = Room.query.filter_by(name=room_name).first()
        if not room:
            logger.error(f"Couldn't find room for name {room_name}")
            return
        user = User.query.filter_by(id=user_id).first()
        if not user:
            logger.error(f"Couldn't find user for id {user_id}")
            return

        user.room = room

        # Make room discovered by user
        user_room_state = UserRoomState.find_or_create(user_id=user_id, room_id=room.id)
        user_room_state.discovered = True

        db.session.commit()

    @classmethod
    def get_active_users_by_room(cls):
        '''Return room:user_list mapping for all active users'''
        users = cls.query.filter(cls.is_active).all()
        user_lists = defaultdict(list)
        for user in users:
            user_dict = user.to_dict()
            if user.room:
                user_lists[user.room.name].append(user_dict)
            else:
                user_lists['hallway'].append(user_dict)
        return user_lists

    def to_dict(self):
        user_dict = super().to_dict()
        user_dict['avatar'] = self.get_avatar()
        return user_dict

    def to_json(self):
        return {
            'id': self.id,
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


class UserRoomState(db.Model, SerializerMixin):
    __tablename__ = 'user_room_states'
    __table_args__ = (
        UniqueConstraint('user_id', 'room_id', name='_unique_user_room'),
    )

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    room_id = db.Column(db.Integer, db.ForeignKey('rooms.id'))
    discovered = db.Column(db.Boolean)

    @classmethod
    def find_or_create(cls, user_id, room_id):
        user_room_state = cls.query.filter_by(user_id=user_id, room_id=room_id).one_or_none()
        if not user_room_state:
            user_room_state = cls(user_id=user_id, room_id=room_id)
            db.session.add(user_room_state)
            db.session.commit()
        return user_room_state

    def __repr__(self):
        visited = 'visited' if self.discovered else 'not visited'
        return 'User {0} has {1} Room {2}'.format(self.user_id, visited, self.room_id)
