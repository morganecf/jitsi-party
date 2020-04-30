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
from . import events

# Factory function that returns the created application instance
def create_app(config_name):
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
    socketio.init_app(app, cors_allowed_origins='*')

    return app
