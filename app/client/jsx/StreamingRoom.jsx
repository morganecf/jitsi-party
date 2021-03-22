import React, { useEffect } from "react";

export const StreamingRoom = ({
  id: roomId,
  name: roomName,
  displayName,
  boshUrl,
  iframeOptions: { src },
}) => {
  // register the 'jitsi-plugin' and initialize converse and cleanup after close
  useEffect(() => {
    let logout = null;
    let plugins = null;

    // configure the 'jitsi-plugin' to get our hands on the converse api logout
    try {
      window.converse.plugins.add("jitsi-plugin", {
        initialize: function () {
          logout = this._converse.api.user.logout;
          plugins = this._converse.pluggable.plugins;

          // add event listener to restucture the chatbox
          this._converse.api.listen.on("chatBoxInsertedIntoDOM", () => {
            const title = document.querySelector(".chatbox-title__text");
            const dd = document.querySelector(".chatbox-title__buttons");

            title.innerHTML = roomName;
            dd.remove();
          });
        },
      });
    } catch (error) {
      // do nothing since the plugin is already registered
      console.error("Well, that didn't work");
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
    return () => {
      plugins["jitsi-plugin"] = undefined;
      logout();
    };
  }, []);

  return (
    <div className="iframe-room">
      <div className="jitsi-video">
        <div className="chat-content"></div>
      </div>
      <div className="iframe-section">
        <iframe src={src} height="100%" width="100%" frameBorder="0px"></iframe>
      </div>
    </div>
  );
};
