import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from config import config
from jitsi import main, api

parentdir = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir))
staticdir = os.path.join(parentdir, 'client/js')

db = SQLAlchemy()

# Factory function that returns the created application instance
def create_app(config_name):
    app = Flask(__name__, static_folder=staticdir)
    app.config.from_object(config[config_name])
    config[config_name].init_app(app)

    # Serves static files
    app.register_blueprint(main.main)

    # Endpoints 
    app.register_blueprint(api.api)

    db.init_app(app)

    return app
