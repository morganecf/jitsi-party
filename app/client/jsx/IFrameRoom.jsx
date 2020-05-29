import React from 'react';
import JitsiVideo from './JitsiVideo.jsx';

const IFrameRoom = ({iframeOptions, jitsiData}) => {
  const {src} = iframeOptions;
  return (
    <div className="iframe-room">
      <JitsiVideo jitsiData={jitsiData}></JitsiVideo>
      <div className="iframe-section">
        <iframe
          src={src}
          height="100%"
          width="100%"
          frameBorder="0px"
        >
        </iframe>
      </div>
    </div>
  );
};

export default IFrameRoom;

