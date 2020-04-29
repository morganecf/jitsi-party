from jitsi import db

# TODO is there anything we should have indexed?
# TODO We could make usernames unique=True, but we'd have to do validation

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100))
    avatar = db.Column(db.String())

    def __repr__(self):
        return 'User {0}'.format(self.username)

class Room(db.Model):
    __tablename__ = 'rooms'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True)

    def __repr__(self):
        return 'Room {0}'.format(self.name)

class RoomUser(db.Model):
    __tablename__ = 'room_users'
    id = db.Column(db.Integer, db.ForeignKey('rooms.id'), primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

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


# class Room(db.Model):
#     __tablename__ = 'rooms'
#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(100), unique=True)
#     description = db.Column(db.Text())
#     capacity = db.Column(db.SmallInteger, nullable=True)
#     room_type = db.Column(db.String(64))
#     # One-to-one
#     navigation = db.relationship('Navigation', backref='room', uselist=False)
#     map_config = db.relationship('MapConfig', backref='room', uselist=False)
#     art = db.relationship('Art', backref='room', uselist=False)

#     def __repr__(self):
#         return 'Room {0}'.format(self.name)

# class Navigation(db.Model):
#     __tablename__ = 'directions'
#     id = db.Column(db.Integer, primary_key=True)
#     # TODO or could just use strings? 
#     north = db.Column(db.Integer, db.ForeignKey('rooms.id'))
#     south = db.Column(db.Integer, db.ForeignKey('rooms.id'))
#     east = db.Column(db.Integer, db.ForeignKey('rooms.id'))
#     west = db.Column(db.Integer, db.ForeignKey('rooms.id'))

#     def __repr__(self):
#         return ''

# class MapConfig(db.Model):
#     __tablename__ = 'map'
#     id = db.Column(db.Integer, primary_key=True)
#     x = db.Column(db.Integer)
#     y = db.Column(db.Integer)
#     width = db.Column(db.Integer)
#     height = db.Column(db.Integer)
#     north_door = db.Column(db.Integer)
#     south_door = db.Column(db.Integer)
#     east_door = db.Column(db.Integer)
#     west_door = db.Column(db.Integer)

#     def __repr__(self):
#         return ''

# class Art(db.Models):
#     __tablename__ = 'art'
#     id = db.Column(db.Integer, primary_key=True)