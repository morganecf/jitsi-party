import React, { useEffect, useState } from "react";
import Config from "./Config.jsx";
import { imgURLtoDataURL } from "./utils.js";

/**
 * This function is used to remove info cached
 * in the local and session storage for converse.js
 */
function clearStorage() {
  // clear localStorage
  for (let i = 0; i < localStorage.length; i++) {
    const lsKey = localStorage.key(i);
    if (lsKey.includes("converse")) {
      localStorage.removeItem(lsKey);
    }
  }

  // clear sessionStorage
  for (let i = 0; i < sessionStorage.length; i++) {
    const ssKey = sessionStorage.key(i);
    if (ssKey.includes("converse")) {
      sessionStorage.removeItem(ssKey);
    }
  }

  // clear IndexedDB
  window.indexedDB.deleteDatabase("converse-persistent");
}

/**
 * This component is used to render a Converse.js chat component on the
 * left side and an IFrame on the right. While this component does have
 * the jitsi-video class in the render it is only for placement: there
 * is no jitsi video in this component.
 *
 * This component works in conjunction with the CHATSTREAM room type.
 *
 * @param props a combo of roomData and jitsiData
 * @returns
 */
export const ChatStreamRoom = ({
  id: roomId,
  displayName,
  avatar,
  iframeOptions: { src },
}) => {
  // used for resetting the chat when it disappears
  const [resetTime, setResetTime] = useState(0);

  // register the 'jitsi-plugin' and initialize converse and cleanup after close
  useEffect(() => {
    let logout = null;
    let plugins = null;

    clearStorage();

    // configure the 'jitsi-plugin' to get our hands on the converse api logout
    try {
      window.converse.plugins.add("jitsi-plugin", {
        initialize: function () {
          logout = this._converse.api.user.logout;
          plugins = this._converse.pluggable.plugins;

          // set the user's profile image
          this._converse.api.listen.on("VCardsInitialized", () => {
            const avatarUrl = Config.avatars[avatar.type].images[avatar.color];
            imgURLtoDataURL(avatarUrl, (dataUrl) => {
              const base64img = dataUrl.split(",")[1];
              this._converse.api.vcard.set(this._converse.bare_jid, {
                image: base64img,
              });
            });
          });
        },
      });
    } catch (error) {
      // do nothing since the plugin is already registered
      console.error(error);
    }

    // initialize converse
    window.converse.initialize({
      authentication: "anonymous",
      auto_login: true,
      auto_join_rooms: [
        // gotta lowercase the roomId cuz for some reason uppercase breaks converse
        { jid: `${roomId.toLowerCase()}@muc.party.jitsi`, nick: displayName },
      ],
      auto_reconnect: true,
      bosh_service_url: `${Config.baseUrl}jitsi/http-bind`,
      jid: "guest.party.jitsi",
      singleton: true,
      hide_offline_users: true,
      clear_cache_on_logout: true,
      time_format: "hh:mm a",
      visible_toolbar_buttons: {
        call: false,
        spoiler: false,
        emoji: true,
        toggle_occupants: false,
      },
      whitelisted_plugins: ["jitsi-plugin"],
      view_mode: "embedded",
      message_archiving: "always",
      debug: true,
      persistent_store: "IndexedDB",
      muc_history_max_stanzas: 500,
    });

    // use mutation observer to reposition the conversejs div
    const convObserver = new MutationObserver((muts) => {
      // reposition the conversejs div
      if (document.querySelector("#conversejs") !== null) {
        document
          .querySelector(".chatstream-section")
          .appendChild(document.querySelector("#conversejs"));
        convObserver.disconnect();
      }
    });

    convObserver.observe(document, {
      childList: true,
      attributes: true,
      subtree: true,
    });

    // use MutationObserver to restucture the chatbox
    const observer = new MutationObserver((muts) => {
      if (document.querySelector(".chatbox-title__buttons") !== null) {
        document.querySelector(".chat-head").innerHTML = "";
      }

      if (document.querySelector(".chat-textarea") !== null) {
        document
          .querySelector(".chat-textarea")
          .addEventListener("keydown", (e) => {
            if ([37, 38, 39, 40].includes(e.keyCode))
              e.stopImmediatePropagation();
          });
      }

      if (document.querySelector(".send-button") !== null) {
        document.querySelector(".send-button").remove();
        observer.disconnect();
      }
    });

    observer.observe(document, {
      childList: true,
      attributes: true,
      subtree: true,
    });

    // use MutationObserver to resurect the chatbox when it vanishes
    setTimeout(() => {
      const vanObserver = new MutationObserver((muts) => {
        if (document.querySelector(".chatroom") === null) {
          console.log("### CHATBOX VANISHED ###");
          clearStorage();
          plugins["jitsi-plugin"] = undefined;
          // logout();
          setResetTime(new Date().getTime());
          vanObserver.disconnect();
        }
      });

      vanObserver.observe(document, {
        childList: true,
        attributes: true,
        subtree: true,
      });
    }, 5000);

    // listen to beforeunload to logout and cleanup
    window.addEventListener("beforeunload", () => {
      plugins["jitsi-plugin"] = undefined;
      logout();
      clearStorage();
    });

    // call the converse api logout at cleanup
    return () => {
      plugins["jitsi-plugin"] = undefined;
      logout();
      clearStorage();
    };
  }, [resetTime]);

  return (
    <div className="iframe-room">
      <div className="chatstream-section"></div>
      <div className="iframe-section">
        <iframe src={src} height="100%" width="100%" frameBorder="0px"></iframe>
      </div>
    </div>
  );
};
