import os
import json
import sys
from jitsi.schema import adventures_pb2,config_pb2,events_pb2,imagemaps_pb2,rooms_pb2
from google.protobuf import json_format

basedir = os.path.abspath(os.path.dirname(__file__))
configdir = os.path.join(basedir, 'config')
overridedir = os.path.join(configdir, 'overrides')

def get_json_dict(path):
    try:
        with open(path) as file:
            return json.load(file)
    except Exception as e:
        print(e)
        return dict()

def make_merged_cfg(paths):
    return {k: v for path in paths for k, v in get_json_dict(path).items()}

class Config:
    # Need to change this
    SECRET_KEY = 'figure-this-out'
    # To silence deprecation warning
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    BASE_DIR = basedir
    # MESSAGE_QUEUE = 'amqp://localhost:5672'
    MESSAGE_QUEUE = None

    # TODO: Should we add adventures & imagemaps to both dirs?
    ROOM_PATHS = [
        os.path.join(configdir, 'rooms.json'),
        os.path.join(overridedir, 'rooms.json')
    ]
    ADVENTURE_PATHS = [
        os.path.join(configdir, 'adventures.json')
    ]
    EVENT_PATHS = [
        os.path.join(configdir, 'events.json'),
        os.path.join(overridedir, 'events.json')
    ]
    IMAGEMAP_PATHS = [
        os.path.join(overridedir, 'imagemaps.json')
    ]
    # TODO: Need to separate these to put dev/prod in-between
    CONFIG_PATHS = [
        os.path.join(configdir, 'base.json'),
        os.path.join(overridedir, 'config.json')
    ]

    MAIL_USERNAME = os.getenv('MAIL_USERNAME')
    MAIL_PASSWORD = os.getenv('MAIL_PASSWORD')
    
    TWILIO_NUMBER = os.getenv('TWILIO_NUMBER')
    TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID')
    TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN')

    @staticmethod
    def init_app(app):
        pass

    def __init__(self):
        baseRooms = make_merged_cfg(self.ROOM_PATHS)
        try:
            json_format.ParseDict(baseRooms, rooms_pb2.Rooms())
        except Exception as e:
            print(e)
        self.rooms = {r['id']: r for r in baseRooms.get('rooms', [])}

        baseAdventures = make_merged_cfg(self.ADVENTURE_PATHS)
        try:
            json_format.ParseDict(baseAdventures, adventures_pb2.Adventures())
        except Exception as e:
            print(e)
        self.adventures = baseAdventures.get('adventures', [])
        for adventure in self.adventures:
            adventure['rooms'] = {r['id']: r for r in adventure['rooms']}

        baseEvents = make_merged_cfg(self.EVENT_PATHS)
        try:
            json_format.ParseDict(baseEvents, events_pb2.Events())
        except Exception as e:
            print(e)
        self.events = baseEvents.get('events', [])

        baseImagemaps = make_merged_cfg(self.IMAGEMAP_PATHS)
        try:
            json_format.ParseDict(baseImagemaps, imagemaps_pb2.ImageMaps())
        except Exception as e:
            print(e)
        self.imagemaps = {i['id']: i for i in baseImagemaps.get('imagemaps', [])}

        baseConfig = make_merged_cfg(self.CONFIG_PATHS)
        try:
            json_format.ParseDict(baseConfig, config_pb2.Config())
        except Exception as e:
            print(e)
        self.config = baseConfig

    # have to be all caps for flask to allow access
    @property
    def ROOMS(self):
        return self.rooms

    @property
    def ADVENTURES(self):
        return self.adventures

    @property
    def EVENTS(self):
        return self.events

    @property
    def MODERATOR_EMAILS(self):
        return self.config.get('moderation', {}).get('moderatorEmails')

    @property
    def MODERATOR_NUMBER(self):
        return self.config.get('moderation', {}).get('moderatorNumber')

    @property
    def IMAGE_MAPS(self):
        return self.imagemaps

    @property
    def NUM_PROXIES(self):
        return self.config['numProxies']


class DevelopmentConfig(Config):
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'db.sqlite')
    CONFIG_PATHS = Config.CONFIG_PATHS + [os.path.join(configdir, 'development.json')]


class ProductionConfig(Config):
    SQLALCHEMY_DATABASE_URI = 'postgresql+psycopg2://waa:woo@jitsi-party-db:5432/jitsi'
    CONFIG_PATHS = Config.CONFIG_PATHS + [os.path.join(configdir, 'production.json')]


config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
