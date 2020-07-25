import React from 'react'
import JitsiVideo from './JitsiVideo.jsx'

export default props => {
    const { src, showVideo } = props.iframeOptions
    return (
        <div className="iframe-room">
            {showVideo && <JitsiVideo jitsiData={props.jitsiData}></JitsiVideo>}
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
    )
}
