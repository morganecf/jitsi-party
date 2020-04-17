import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class Room extends Component { 
    constructor(props) {
        super(props)
        this.state = {}
    }

    async componentDidMount() {
        // TODO need to disable the ability to hang up I think
        try {
            const domain = 'meet.jit.si'
            const options = {
                roomName: this.props.roomName,
                height: 800,
                parentNode: document.getElementById('jitsi-container'),
                interfaceConfigOverwrite: {
                    filmStripOnly: false,
                    SHOW_JITSI_WATERMARK: false
                },
                configOverwrite: {
                    disableSimulcast: false
                }
            }
            const api = new window.JitsiMeetExternalAPI(domain, options)
            api.addEventListener('videoConferenceJoined', () => {
                api.executeCommand('displayName', this.props.displayName)
            })
        } catch (err) {
            console.log('failed:', err)
        }
    }

    render() {
        return (
            <div className="room">
                <div id="jitsi-container"></div>
                <Link to="/map" activeclassname="active">Map</Link>
            </div>
        )
    }
}
