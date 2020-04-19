import React, { Component } from 'react'
import JitsiVideo from './JitsiVideo.jsx'

export default class ArtRoom extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { src, title, artist } = this.props.art
        return (
            <div className="art-room">
                <JitsiVideo jitsiData={this.props.jitsiData}></JitsiVideo>
                <div className="art-section">
                    <img src={src}/>
                    <p><i>{title}</i> by {artist}</p>
                </div>
            </div>
        )
    }
}