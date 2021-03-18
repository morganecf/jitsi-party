import React, { useEffect } from "react";

export const StreamingRoom = ({
  id: roomId,
  displayName,
  boshUrl,
  iframeOptions: { src },
}) => {
  // initialize converse
  useEffect(() => {
    window.converse.initialize({
      authentication: "anonymous",
      auto_login: true,
      auto_join_rooms: [
        { jid: `${roomId}@muc.party.jitsi`, nick: displayName },
      ],
      bosh_service_url: boshUrl,
      jid: "guest.party.jitsi",
      singleton: true,
      view_mode: "embedded",
    });
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
