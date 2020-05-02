import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO
from flask_cors import CORS
from config import config, basedir

staticdir = os.path.join(basedir, 'client/js')

db = SQLAlchemy()
socketio = SocketIO()

# Register socket events with SocketIO instance
from . import events  # noqa


def create_app(config_name):
    '''
    Factory function that returns the created application instance
    '''
    app = Flask(__name__, static_folder=staticdir)
    app.config.from_object(config[config_name])
    config[config_name].init_app(app)

    from jitsi import main

    # Endpoints
    app.register_blueprint(main.main)

    # Enable cross-origin requests
    CORS(app)

    # Database
    db.init_app(app)

    # SocketIO
    queue = config[config_name].MESSAGE_QUEUE
    socketio.init_app(app, cors_allowed_origins='*', message_queue=queue)

    return app


def run_eventlet(app):
    socketio.init_app(app, async_mode="eventlet")
    socketio.run(app, host='0.0.0.0', port=os.getenv('FLASK_RUN_PORT'))
