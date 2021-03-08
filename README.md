# jitsi-party

A virtual party space.

## Contributing

### Prerequisites
This document assumes an environment with docker/docker-compose, with a user account able to interact with the daemon (*without* needing sudo).

### Running the app locally
```bash
make up && make db
```

The default app installation should now be running on localhost:443 with a self-signed certificate.

To allow self-signed certs for localhost in Chrome, toggle this debug flag: chrome://flags/#allow-insecure-localhost

### Configuration

App configuration is done with a collection of JSON files in app/config.
`base/config.conf` is the root configuration, which is merged with/superceded by the values in `development.json` and `production.json` when in those respective environments.
`base/rooms.json` contains the room layout that is loaded into the database and used by all connected clients.

To use a custom configuration, symlink a `config.json` and/or `rooms.json` to `app/config/overrides/`.
`app/config/overrides/config.json` will be merged with/supercede the default configs, while `app/config/overrides/rooms.json` will completely replace the default rooms.

Advanced configuration for events (`overrides/events.json`) and image maps (`overrides/imagemaps.json`) are also supported.
// TODO document these

By convention, different installations of the application are stored as folders under `config/` e.g. `config/cabin-weekend`.

To set up your local build as one of the existing configurations, simply symlink that configuration's folder to `config/overrides`, then run `make clean-webpack && make webpack`

There is a helpful script that does all of this for you:
```bash
app/set_config.sh <name_of_config>
```

### Themes

The easiest way to style the app is to add a theme.
Themes live in `app/client/styles/themes`.
There is a default theme, which you can override by creating a symlink at `app/client/styles/themes/_active.scss`.

There is a helpful script that does all of this for you:
```bash
app/set_theme.sh <name_of_theme>
```

### Frontend development flow
When modifying (S)CSS or JS or HTML, you will need to rerun webpack, which is dockerized.

```bash
make webpack
```

Currently watch mode is not supported.

### Backend development flow
It's a bit overkill, but for now the simplest thing to do after modifying python code is to restart all containers:

```bash
make restart
```

### Changing configs
After changing configs with `app/set_config.sh`, you should rerun webpack and restart, then once the db is running reinitialize it:

```bash
make webpack && make restart; sleep 15; make db
```

### Changing themes
After changing themes with `app/set_theme.sh`, you should rerun webpack:

```bash
make webpack
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
