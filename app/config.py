import os
import json
import sys
import rooms_pb2 as rooms
import google.protobuf.json_format as json_format

basedir = os.path.abspath(os.path.dirname(__file__))
configdir = os.path.join(basedir, 'config')
overridedir = os.path.join(configdir, 'overrides')

def get_json_dict(path):
    try:
        with open(path) as file:
            json_dict = json.load(file)
            json_format.ParseDict(json_dict, rooms.Rooms())
            return json_dict
    except:
        print(sys.exc_info()[0])
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
    CONFIG_PATHS = [os.path.join(configdir, file) for file in [
        'base.json',
        'rooms.json',
        'adventures.json',
        'events.json'
    ]]
    OVERRIDE_PATHS = [os.path.join(overridedir, file) for file in [
        'config.json',
        'rooms.json',
        'events.json',
        'imagemaps.json'
    ]]

    MAIL_USERNAME = os.getenv('MAIL_USERNAME')
    MAIL_PASSWORD = os.getenv('MAIL_PASSWORD')
    
    TWILIO_NUMBER = os.getenv('TWILIO_NUMBER')
    TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID')
    TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN')

    @staticmethod
    def init_app(app):
        pass

    def __init__(self):
        self.merged_cfg = make_merged_cfg(self.CONFIG_PATHS)

    # have to be all caps for flask to allow access
    @property
    def ROOMS(self):
        return self.merged_cfg['rooms']

    @property
    def ADVENTURES(self):
        return self.merged_cfg.get('adventures', {})

    @property
    def EVENTS(self):
        return self.merged_cfg.get('events', {})

    @property
    def MODERATOR_EMAILS(self):
        return self.merged_cfg.get('moderation', {}).get('moderatorEmails')

    @property
    def MODERATOR_NUMBER(self):
        return self.merged_cfg.get('moderation', {}).get('moderatorNumber')

    @property
    def IMAGE_MAPS(self):
        return self.merged_cfg.get('imagemaps', {})

    @property
    def NUM_PROXIES(self):
        return self.merged_cfg['numProxies']


class DevelopmentConfig(Config):
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'db.sqlite')
    CONFIG_PATHS = Config.CONFIG_PATHS + [os.path.join(configdir, 'development.json')] + Config.OVERRIDE_PATHS


class ProductionConfig(Config):
    SQLALCHEMY_DATABASE_URI = 'postgresql+psycopg2://waa:woo@jitsi-party-db:5432/jitsi'
    CONFIG_PATHS = Config.CONFIG_PATHS + [os.path.join(configdir, 'production.json')] + Config.OVERRIDE_PATHS


config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
