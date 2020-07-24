import React from 'react'
import JitsiVideo from './JitsiVideo.jsx'

export default props => {
    /* secondSrc is TEMPORARY TST-SPECIFIC THING */
    const { src, secondSrc } = props.iframeOptions
    const left = secondSrc ? (
        <div className="iframe-section">
                <iframe
                    src={secondSrc}
                    height="100%"
                    width="100%"
                    frameBorder="0px"
                >
                </iframe>
            </div>
    ) : <JitsiVideo jitsiData={props.jitsiData}></JitsiVideo>
    return (
        <div className="iframe-room">
            {left}
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
