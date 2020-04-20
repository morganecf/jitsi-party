import React from 'react'
import JitsiVideo from './JitsiVideo.jsx'

export default props => {
    const { src, title, artist } = props.art
    return (
        <div className="art-room">
            <JitsiVideo jitsiData={props.jitsiData}></JitsiVideo>
            <div className="art-section">
                <img src={src}/>
                <p><i>{title}</i> by {artist}</p>
            </div>
        </div>
    )
}