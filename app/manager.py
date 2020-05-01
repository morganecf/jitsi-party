import os
import json
from jitsi import create_app, db
from jitsi.models import Room, User

# Create the application context 
app = create_app(os.getenv('FLASK_CONFIG') or 'default')

# The following are custom flask commands

@app.shell_context_processor
def make_shell_context():
    '''Usage: flask shell

    Used to conveniently access db/models in the flask shell'''
    return dict(db=db, Room=Room, User=User)


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

    # Load room definition
    rooms = json.load(open('rooms.json'))

    # Create rooms and insert
    db_rooms = [Room(name=room_name, room_type=room['type']) for room_name, room in rooms.items()]
    db.session.add_all(db_rooms)
    db.session.commit()
