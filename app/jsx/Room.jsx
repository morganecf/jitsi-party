import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import reducers from './reducers.jsx'
import Navigation from './Navigation.jsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import directions from './directions.jsx'

class Room extends Component { 
    constructor(props) {
        super(props)
        this.state = {
            room: this.props.currentRoom,
            hasLoaded: false
        }
    }

    componentDidMount() {
        this.connectToRoom(this.state.room)
    }

    componentWillUnmount() {
        if (this.api) {
            this.api.dispose()
        }
    }

    connectToRoom(room) {
        if (this.api) {
            this.api.dispose()
        }
        // TODO need to disable the ability to hang up I think
        // TODO persist video/sound on/off
        try {
            const domain = 'meet.jit.si'
            const options = {
                roomName: room,
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
            this.api = new window.JitsiMeetExternalAPI(domain, options)
            this.setState({ hasLoaded: true })
            this.api.addEventListener('videoConferenceJoined', () => {
                this.api.executeCommand('displayName', this.props.displayName)
                // this.api.executeCommand('avatarUrl', this.props.avatar)
            })
        } catch (err) {
            console.log('failed:', err)
        }
    }

    onSwitchRoom(room) {
        this.setState({ room })
        this.props.updateCurrentRoom(room)
        this.connectToRoom(room)
    }

    getLoadingSpinner() {
        if (!this.state.hasLoaded) {
            return <FontAwesomeIcon icon={faSpinner}/>
        }
    }

    render() {
        return (
            <div className="room">
                <h2 className="room-name">{this.state.room}</h2>
                {this.getLoadingSpinner()}
                <div id="jitsi-container"></div>
                <Navigation directions={directions[this.state.room]} onClick={this.onSwitchRoom.bind(this)}></Navigation>
                <Link to="/map" activeclassname="active">Map</Link>
            </div>
        )
    }
}

export default connect(
    state => state, 
    {
        updateCurrentRoom: reducers.updateCurrentRoomActionCreator
     })(Room)
