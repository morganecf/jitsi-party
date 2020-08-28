# Configuration

This folder contains the default configuration files for the jitsi-party application.
Both the server and the client use these files.

`base` contains the basic/default configurations, on which your custom configs will build. Do not alter these files.

To configure your custom installation of jitsi-party, symlink your configuration files into the `overrides` folder.
The contents of this folder are gitignored, so the symlinks will not be stored in the repository.
By convention, a party name `my-party` will keep its configs in `config/my-party/`, and you can symlink `config/my-party/*` into `config/overrides` when you are ready to run your party server.

`overrides/config.json` is read by the server at runtime and also bundled into the built javascript client - any values entered there will supercede the values in the default configuration.
This file is used to configure parts of the application such as the welcome screen, handling of user sessions, and various other details.

`overrides/rooms.json` is read by the server only in order to establish the layout of your virtual space.
If this file is present, it will completely replace the default layout.
