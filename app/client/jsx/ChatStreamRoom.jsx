import React, { useEffect } from "react";
import Config from "./Config.jsx";

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
      muc_history_max_stanzas: 500,
    });

    // use mutation observer to reposition the conversejs div
    const convObserver = new MutationObserver((muts) => {
      // reposition the conversejs div
      if (document.querySelector('#conversejs') !== null) {
        document.querySelector('.chatstream-section').appendChild(document.querySelector('#conversejs'))
        convObserver.disconnect()
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
        document.querySelector(".chat-head").remove();
      }

      if (document.querySelector(".chat-textarea") !== null) {
        document.querySelector(".chat-textarea").addEventListener("keydown", (e) => {
          if ([37, 38, 39, 40].includes(e.keyCode)) e.stopImmediatePropagation();
        })
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

    // listen to beforeunload to logout and cleanup
    window.addEventListener("beforeunload", () => {
      plugins["jitsi-plugin"] = undefined;
      logout();
    });

    // call the converse api logout at cleanup
    return () => {
      plugins["jitsi-plugin"] = undefined;
      logout();
    };
  }, []);

  return (
    <div className="iframe-room">
      <div className="chatstream-section"></div>
      <div className="iframe-section">
        <iframe src={src} height="100%" width="100%" frameBorder="0px"></iframe>
      </div>
    </div>
  );
};
