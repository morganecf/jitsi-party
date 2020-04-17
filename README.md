# jitsi-party

### Installation
```
# Make sure you have node/npm installed
brew install node

# Install local app dependencies
cd app/
npm install
```

### Running the app locally 
```
cd app/
bash run.sh
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
