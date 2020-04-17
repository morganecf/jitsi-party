import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Navigation from './Navigation.jsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

export default class Room extends Component { 
    constructor(props) {
        super(props)
        this.state = {
            hasLoaded: false
        }
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
            this.setState({ hasLoaded: true })
            api.addEventListener('videoConferenceJoined', () => {
                api.executeCommand('displayName', this.props.displayName)
            })
        } catch (err) {
            console.log('failed:', err)
        }
    }

    getLoadingSpinner() {
        if (!this.state.hasLoaded) {
            return <FontAwesomeIcon icon={faSpinner}/>
        }
    }

    render() {
        const directions = {
            north: 'The Room of Disquiet',
            east: 'Literally hell',
            west: 'Bathroom'
        }
        return (
            <div className="room">
                {this.getLoadingSpinner()}
                <div id="jitsi-container"></div>
                <span className="room-name">{this.props.roomName}</span>
                <Link to="/map" activeclassname="active">Map</Link>
                <Navigation directions={directions}></Navigation>
            </div>
        )
    }
}
