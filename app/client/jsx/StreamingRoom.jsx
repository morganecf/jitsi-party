import React, { useEffect } from "react";

export const StreamingRoom = ({
  id: roomId,
  displayName,
  boshUrl,
  iframeOptions: { src },
}) => {
  // register the 'jitsi-plugin' and initialize converse and cleanup after close
  useEffect(() => {
    // placeholder variable for the logout
    let logout;

    // configure the 'jitsi-plugin' to get our hands on the converse api logout
    try {
      window.converse.plugins.add("jitsi-plugin", {
        initialize: function () {
          this._converse.log.log("This had better work.");
          console.dir(this);
          logout = this._converse.api.user.logout;
        },
      });
    } catch (error) {
      // do nothing since the plugin is already registered
    }

    // initialize converse
    window.converse.initialize({
      authentication: "anonymous",
      auto_login: true,
      auto_join_rooms: [
        { jid: `${roomId}@muc.party.jitsi`, nick: displayName },
      ],
      bosh_service_url: boshUrl,
      jid: "guest.party.jitsi",
      singleton: true,
      clear_cache_on_logout: true,
      whitelisted_plugins: ["jitsi-plugin"],
      view_mode: "embedded",
    });

    // call the converse api logout at cleanup
    return () => logout();
  }, []);

  return (
    <div className="iframe-room">
      <div className="jitsi-video">
        <div className="jitsi-container"></div>
      </div>
      <div className="iframe-section">
        <iframe src={src} height="100%" width="100%" frameBorder="0px"></iframe>
      </div>
    </div>
  );
};
