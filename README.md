# jitsi-party

A virtual party space.

## Contributing

### Installation
```bash
# Set up a virtualenv
virtualenv venv
source venv/bin/activate
pip install -r requirements.txt

# Make sure you have node/npm installed
brew install node # on Linux: `apt install npm`

# Make sure you have protoc installed
brew install protobuf # on Linux: `apt install protobuf-compiler`

# Install client dependencies
cd app/client/
npm install
```

### Running the app locally
```bash
# Make sure your virtual env is activated
source venv/bin/activate
cd app/

# Export env variables.
source setup.sh

# Build proto schemas for config files
# Equivalent to `make schema`. Run `make clean` to clean
make

# Create db
flask create-db

# Run flask app
flask run

# Run webpack
cd client/
bash run.sh
```

The default app installation should now be running on localhost:3000.

### Configuration

App configuration is done with a collection of JSON files in app/config.
`base/config.conf` is the root configuration, which is merged with/superceded by the values in `development.json` and `production.json` when in those respective environments.
`base/rooms.json` contains the room layout that is loaded into the database and used by all connected clients.

To use a custom configuration, symlink a `config.json` and/or `rooms.json` to `app/config/overrides/`.
`app/config/overrides/config.json` will be merged with/supercede the default configs, while `app/config/overrides/rooms.json` will completely replace the default rooms.

Advanced configuration for events (`overrides/events.json`) and image maps (`overrides/imagemaps.json`) are also supported.
// TODO document these

By convention, different installations of the application are stored as folders under `config/` e.g. `config/cabin-weekend`.
To set up your local build as one of the existing configurations, simply symlink all the files is that in configuration's folder into `config/overrides`, then run `flask create-db`.

There is a helpful script that does all of this for you:
```bash
./set_config <name_of_config_directory>
```

### Themes

The easiest way to style the app is to add a theme. Themes live in `app/client/styles/themes`. The active theme, or the theme that is currently initialized for the app, is `app/client/styles/themes/_active.scss` and is imported in the main stylesheet. You can activate a theme by symlinking a theme stylesheet to `_active.scss`, or use this script for convenience:

```
./set_theme _name_of_stylesheet.scss
```

### Querying the DB
Using sqlite directly
```
sqlite3
.open db.sqlite
.tables
select * from rooms;
```

Using flask shell
```
flask shell
Room.query.all()
```

### Running with eventlet
If you want websockets to actually work:
```
flask run-eventlet
```


### Jitsi API documentation
API doc:
https://github.com/jitsi/jitsi-meet/blob/master/doc/api.md

Definition of JitsiMeetExternalAPI():
https://github.com/jitsi/jitsi-meet/blob/master/modules/API/external/external_api.js

Config options:
https://github.com/jitsi/jitsi-meet/blob/master/config.js

Interface config options:
https://github.com/jitsi/jitsi-meet/blob/master/interface_config.js

### A slightly irritating note
It seems like the Jitsi Meet library isn't intended to be consumed the way you'd use a regular JS library in a modern app, i.e., it seems you can't import it. We have to use a script tag to get it working, and then access the global variable:
```html
<body>
  ...
  <script src='https://meet.jit.si/external_api.js'></script>
  <script type="text/javascript" src="js/bundle.js"></script>
</body>
```

```javascript
// To use inside a React component
const JitsiAPI = window.JitsiMeetExternalAPI
```
