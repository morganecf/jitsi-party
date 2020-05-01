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

### Running the app locally in production mode
We use multiple workers in production, so we've added an experimental message queue that only gets activated in production mode. This is a tentative plan for Celery; don't worry about this for now. 
```bash
# Install kombu (this also comes installed as part of your dev env)
source venv/bin/activate
pip install kombu
# or
pip install -r requirements.txt

# Install rabbitmq
brew install rabbitmq

# If not in path, add it
export PATH=$PATH:/usr/local/opt/rabbitmq/sbin

# Start server
rabbitmq-server

# Run the app in production mode
cd add/
source setup_prod.sh
flask run

# To shut down the rabbitmq server
rabbitmqctl shutdown
```

### Jitsi API documentation
https://github.com/jitsi/jitsi-meet/blob/master/doc/api.md

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
