# Configuration

This folder contains the default configuration files for the jitsi-party application.
Both the server and the client use these files.
Do not alter them directly.

To configure your custom installation of jitsi-party, drop new files into the `overrides` folder here.

`overrides/config.json` is read by the server at runtime and also bundled into the built javascript client - any values entered there will supercede the values in the default configuration.
This file is used to configure parts of the application such as the welcome screen, handling of user sessions, and various other details.

`overrides/rooms.json` is read by the server only in order to establish the layout of your virtual space.
If this file is present, it will completely replace the default layout.

There are template files in `overrides` that are not active.
You can do e.g. `cp overrides/rooms.template.json overrides/rooms.json` to start the customization process.
