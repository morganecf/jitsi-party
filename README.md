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
brew install node

# Install client dependencies
cd app/client/
npm install
```

### Running the app locally
```bash
# Make sure your virtual env is activated
source venv/bin/activate
cd app/

# Export env variables. Use setup_prod.sh for prod
source setup.sh

# Create db
flask create-db

# Run flask app
flask run

# Run webpack
cd client/
bash run.sh
```

The app should now be running on localhost:5000.

### Configuration

App configuration is done with a collection of JSON files in app/config.
`base.conf` is the root configuration, and is merged with/superceded by the values in `development.json` and `production.json` when in those respective environments.
`rooms.json` contains the room layout that is loaded into the database and used by all connected clients.

To use a custom configuration, add a `config.json` and/or `rooms.json` to `app/config/overrides/`.
`app/config/overrides/config.json` will be merged with/supercede the default configs, while `app/config/overrides/rooms.json` will completely replace the default rooms.

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

### Documentation for Kacy
1. Open power shell: `cmd` in windows file explorer and open
2. Navitate to jitsi directory in Desktop: `cd C:\Users\KacyCrider\Desktop\jitsi` 
3. Activate the virtual environment: `venv\Scripts\activate.bat`

To update code (make sure steps 1-3 have been run):
```
# from the Desktop\jitsi folder
cd jitsi-party
git pull
```

To update Python depencencies (ask Morg or someone if you need to do this and make sure steps 1-3 have been run)
```
# from the Desktop\jitsi folder
cd jitsi-party
pip install -r requirements.txt
```

To update Javascript depencencies (ask Morg or someone if you need to do this and make sure steps 1-3 have been run)
```
# from the Desktop\jitsi folder
cd jitsi-party\app\client
npm install
```
