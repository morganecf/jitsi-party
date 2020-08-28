import os
import json
from jitsi import create_app, db, run_eventlet
from jitsi.models import Room, User
from config import load_and_validate_rooms

basedir = os.path.abspath(os.path.dirname(__file__))
configdir = os.path.join(basedir, 'config', 'base')
overridedir = os.path.join(configdir, 'overrides')

# Create the application context
app = create_app(os.getenv('FLASK_ENV') or 'default')

# The following are custom flask commands

@app.shell_context_processor
def make_shell_context():
    '''Usage: flask shell

    Used to conveniently access db/models in the flask shell'''
    return dict(db=db, Room=Room, User=User)


@app.cli.command('run-eventlet')
def run_eventlet_cmd():
    run_eventlet(app)


@app.cli.command('create-db')
def create_db():
    '''Usage: flask create-db

    Run this custom flask command to create or update the DB. This will wipe the existing DB and populate
    it with rooms from rooms.json. No default users will be created. All existing users will be wiped, which
    is necessary between parties. Since the data we're dealing with is exceptionally small, we can just drop
    or recreate each time and not worry about migrations for now.'''
    # Remove old tables
    db.drop_all()

    # Create tables corresponding to models defined in models.py
    db.create_all()

    # Create rooms and insert
    db_rooms = [Room(name=room_name, room_type=room['type'])
                for room_name, room in app.config['ROOMS'].items()]
    db.session.add_all(db_rooms)
    db.session.commit()


@app.cli.command('create-imagemap-config')
def create_imagemap_config():
    '''Usage: flask create-imagemap-config

    Running this will generate a config file based on the contents of js/imagemap-content. Each subdirectory
    corresponds to an HTML image map, and each subdirectory within that corresponds to an area of the map.
    Some values are filled with placeholders and are left up to the user to fill in. This simply outputs the
    json, letting the user pipe it to their config file of choice.
    '''
    def listdir(dir):
        return filter(lambda i: not i.startswith('.'), os.listdir(dir))
    
    def format_item_path(imagemap_dir, topic, item):
        return os.path.join('js', 'imagemap-content', imagemap_dir, topic, item)

    basedir = os.path.join(
        os.path.abspath(os.path.dirname(__file__)),
        'client',
        'js',
        'imagemap-content'
    )

    if not os.path.exists(basedir):
        print('There is no image map content')
        return

    config = {}
    imagemaps = listdir(basedir)

    for imagemap in imagemaps:
        topic_dir = os.path.join(basedir, imagemap)
        topics = listdir(topic_dir)
        areas = [{
            'shape': '<AREA SHAPE:str>',
            'coords': '<AREA COORDS:str>',
            'label': topic,
            'contents': [
                {
                    'title': '',
                    'path': format_item_path(imagemap, topic, item)
                } for item in listdir(os.path.join(topic_dir, topic))
            ]
        } for topic in topics]

        config[imagemap] = {
            'img': '<PATH TO IMAGE:str>',
            'areas': areas
        }

    print(json.dumps({ 'imagemaps': config }, indent=4))


