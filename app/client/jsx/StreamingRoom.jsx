import React, { useEffect, useState } from "react";

export const StreamingRoom = ({ boshUrl, iframeOptions: { src } }) => {
  const [chat, setChat] = useState(false);

  // initialize converse
  useEffect(() => {
    window.converse.initialize({
      bosh_service_url: boshUrl,
      authentication: "anonymous",
      prebind_url: "https://localhost/jitsi",
      jid: "localhost/jitsi/guest.party.jitsi",
      view_mode: "embedded",
      auto_login: true,
      auto_reconnect: true,
      allow_logout: true,
    });
  }, []);

  useEffect(() => {
    return () => setChat(false);
  }, []);

  return (
    <div className="iframe-room">
      <div className="jitsi-video">
        <div className="jitsi-container">
          {chat ? (
            <div id="conversejs"></div>
          ) : (
            <button onClick={() => setChat(true)}>Start Chat</button>
          )}
        </div>
      </div>
      <div className="iframe-section">
        <iframe src={src} height="100%" width="100%" frameBorder="0px"></iframe>
      </div>
    </div>
  );
};
