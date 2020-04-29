import os
from jitsi import create_app, db
# from jitsi.models import User, Room
# from flask_migrate import Migrate

app = create_app(os.getenv('FLASK_CONFIG') or 'default')
# migrate = Migrate(app, db)

@app.shell_context_processor
def make_shell_context():
    # return dict(db=db, User=User, Room=Room)
    return dict(db=db)
