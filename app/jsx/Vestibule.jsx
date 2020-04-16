import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import reducers from './reducers.jsx'

class Vestibule extends Component { 
    constructor(props) {
        super(props)
        this.roomNames = [
            'matt',
            'daniel',
            'morg',
            'sean',
            'andrew'
        ]
        this.state = {

        }

        console.log('jitsi api:', window.JitsiMeetExternalAPI)
    }

    async componentDidMount() {
        // Example usage of redux
        this.props.updateState('test')

        try {
            const domain = 'meet.jit.si'
            const options = {
                roomName: 'morgane',
                height: 500,
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
                console.log('user joined')
                api.executeCommand('displayName', 'morg')
            })
        } catch (err) {
            console.log('failed:', err)
        }
    }

    render() {
        return (
            <div>
                <ul className="room-list">
                    {this.roomNames.map((name, index) => {
                        return (
                            <li key={index.toString()}>
                                <a href={`https://meet.jit.si/${name}`}>{name}</a>
                            </li>
                        )
                    })}
                </ul>
                <div id="jitsi-container"></div>
            </div>
        )
    }
}

// Example usage of redux
export default connect(state => state, { updateState: reducers.exampleActionCreator })(Vestibule)
