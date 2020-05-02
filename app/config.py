import os

basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    # Need to change this
    SECRET_KEY = 'figure-this-out'
    # To silence deprecation warning
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    BASE_DIR = basedir

    @staticmethod
    def init_app(app):
        pass

class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'db.sqlite')
    MESSAGE_QUEUE = None

class ProductionConfig(Config):
    # These URIs are the same for now. If we ever introduce tests we'll want to have
    # a test config that has its own db that doesn't interfere with these.
    SQLALCHEMY_DATABASE_URI = 'postgresql+psycopg2://waa:woo@jitsi-party-db:5432/jitsi'
    # We use multiple workers in production, so we need a message queue to coordinate
    # websocket broadcasting
    MESSAGE_QUEUE = None

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
