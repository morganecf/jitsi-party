import os
import json
import sys
from jitsi.schema import adventures_pb2,config_pb2,events_pb2,imagemaps_pb2,rooms_pb2
from google.protobuf import json_format

basedir = os.path.abspath(os.path.dirname(__file__))
basecfgdir = os.path.join(basedir, 'config', 'base')
overridedir = os.path.join(basedir, 'config', 'overrides')

def get_json_dict(path):
    try:
        with open(path) as file:
            return json.load(file)
    except OSError:
        # Failed to open the file, e.g. file not found
        return dict()
    except Exception as e:
        print("Error on path ", path, e)
        return dict()

def make_merged_cfg(paths):
    return {k: v for path in paths for k, v in get_json_dict(path).items()}

def load_and_validate_rooms(paths):
    baseRooms = make_merged_cfg(paths)
    try:
        json_format.ParseDict(baseRooms, rooms_pb2.Rooms())
    except Exception as e:
        print("Error validating rooms: ", e)
    return {r['id']: r for r in baseRooms.get('rooms', [])}

def load_and_validate_adventures(paths):
    baseAdventures = make_merged_cfg(paths)
    try:
        json_format.ParseDict(baseAdventures, adventures_pb2.Adventures())
    except Exception as e:
        print("Error validating adventures: ", e)
    adventures = baseAdventures.get('adventures', [])
    for adventure in adventures:
        for room in adventure.pop('rooms'):
            adventure[room['id']] = room
    return adventures

def load_and_validate_events(paths):
    baseEvents = make_merged_cfg(paths)
    try:
        json_format.ParseDict(baseEvents, events_pb2.Events())
    except Exception as e:
        print("Error validating events: ", e)
    return baseEvents.get('events', [])

def load_and_validate_imagemaps(paths):
    baseImagemaps = make_merged_cfg(paths)
    try:
        json_format.ParseDict(baseImagemaps, imagemaps_pb2.ImageMaps())
    except Exception as e:
        print("Error validating imagemaps: ", e)
    return {i['id']: i for i in baseImagemaps.get('imagemaps', [])}

def load_and_validate_config(paths):
    baseConfig = make_merged_cfg(paths)
    try:
        json_format.ParseDict(baseConfig, config_pb2.Config())
    except Exception as e:
        print("Error validating config: ", e)
    return baseConfig

class Config:
    # Need to change this
    SECRET_KEY = 'figure-this-out'
    # To silence deprecation warning
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    BASE_DIR = basedir
    # MESSAGE_QUEUE = 'amqp://localhost:5672'
    MESSAGE_QUEUE = None

    ROOM_PATHS = [
        os.path.join(basecfgdir, 'rooms.json'),
        os.path.join(overridedir, 'rooms.json')
    ]
    ADVENTURE_PATHS = [
        os.path.join(overridedir, 'adventures.json'),
    ]
    EVENT_PATHS = [
        os.path.join(basecfgdir, 'events.json'),
        os.path.join(overridedir, 'events.json')
    ]
    IMAGEMAP_PATHS = [
        os.path.join(overridedir, 'imagemaps.json')
    ]
    BASE_CONFIG_PATHS = [os.path.join(basecfgdir, 'config.json')]
    OVERRIDE_CONFIG_PATHS = [os.path.join(overridedir, 'config.json')]
    CONFIG_PATHS = BASE_CONFIG_PATHS + OVERRIDE_CONFIG_PATHS

    MAIL_USERNAME = os.getenv('MAIL_USERNAME')
    MAIL_PASSWORD = os.getenv('MAIL_PASSWORD')
    
    TWILIO_NUMBER = os.getenv('TWILIO_NUMBER')
    TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID')
    TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN')

    @staticmethod
    def init_app(app):
        pass

    def __init__(self):
        self.rooms = load_and_validate_rooms(self.ROOM_PATHS)
        self.adventures = load_and_validate_adventures(self.ADVENTURE_PATHS)
        self.events = load_and_validate_events(self.EVENT_PATHS)
        self.imagemaps = load_and_validate_imagemaps(self.IMAGEMAP_PATHS)
        self.config = load_and_validate_config(self.CONFIG_PATHS)

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

    @property
    def PAGE_TITLE(self):
        return self.config['page_title']

    @property
    def EVENT_TIMES(self):
        return self.config.get('eventTimes', {})


class DevelopmentConfig(Config):
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'db.sqlite')
    CONFIG_PATHS = Config.BASE_CONFIG_PATHS + [os.path.join(basecfgdir, 'development.json')] + Config.OVERRIDE_CONFIG_PATHS


class ProductionConfig(Config):
    SQLALCHEMY_DATABASE_URI = 'postgresql+psycopg2://waa:woo@jitsi-party-db:5432/jitsi'
    CONFIG_PATHS = Config.BASE_CONFIG_PATHS + [os.path.join(basecfgdir, 'production.json')] + Config.OVERRIDE_CONFIG_PATHS


config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
