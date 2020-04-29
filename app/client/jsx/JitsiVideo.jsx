import React, { Component } from 'react'
import { connect } from 'react-redux'
import reducers from './reducers.jsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

class JitsiVideo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            hasLoaded: false
        }
        this.toolbarButtons = [
            'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
            'fodeviceselection', 'profile', 'chat', 'recording',
            'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
            'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
            'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone',
            'e2ee'
        ]

        // These should not be stored in state for the duration of the Jitsi video,
        // since any change to state currently triggers a render and reconnect
        this.isAudioMuted = this.props.isAudioMuted
        this.isVideoMuted = this.props.isVideoMuted
    }

    componentDidMount() {
        this.connect()
        document.addEventListener("keydown", this.handleKeydown.bind(this));
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeydown.bind(this))
        if (this.api) {
            this.api.dispose()
        }
        // Persist audio/video muted settings
        this.props.updateAudioMuted(this.isAudioMuted)
        this.props.updateVideoMuted(this.isVideoMuted)
    }

    handleKeydown(e) {
        if (!this.api) { return; }
        e = e || window.event;
        switch(e.which || e.keyCode) {
            case 65:
                // a
                this.api.executeCommand('toggleAudio');
                break;
            case 86:
                // v
                this.api.executeCommand('toggleVideo');
                break;
        }
    }

    connect() {
        try {
            // If muteRoom=true in room settings, mute Jitsi and remove microphone controls.
            let toolbarButtons = this.toolbarButtons;
            if (this.props.jitsiData.muteRoom) {
                toolbarButtons = _.without(this.toolbarButtons, 'microphone')
                this.isAudioMuted = true
            }

            const domain = 'jitsi.gbre.org'
            // const domain = 'meet.jit.si'
            const options = {
                roomName: this.props.jitsiData.roomName,
                parentNode: document.getElementById('jitsi-container'),
                interfaceConfigOverwrite: {
                    // filmStripOnly: true,
                    SHOW_JITSI_WATERMARK: false,
                    DEFAULT_REMOTE_DISPLAY_NAME: 'Fellow Clarendonite',
                    SHOW_WATERMARK_FOR_GUESTS: false,
                    TOOLBAR_BUTTONS: toolbarButtons,
                    DEFAULT_BACKGROUND: 'transparent',

                },
                configOverwrite: {
                    disableSimulcast: false
                }
            }

            this.api = new window.JitsiMeetExternalAPI(domain, options)
            this.api.addEventListener('videoConferenceJoined', () => {
                const commands = {
                    displayName: this.props.jitsiData.displayName,
                    avatarUrl: this.props.jitsiData.avatar,
                }
                // Persist audio/video muted settings
                if (this.isAudioMuted) {
                    console.log('adding mute command')
                    commands.toggleAudio = []
                }
                if (this.isVideoMuted) {
                    commands.toggleVideo = []
                }
                this.api.executeCommands(commands)
                this.api.addEventListener('audioMuteStatusChanged', ({ muted }) => {
                    this.isAudioMuted = muted
                })
                this.api.addEventListener('videoMuteStatusChanged', ({ muted }) => {
                    this.isVideoMuted = muted
                })
            })
        } catch (err) {
            console.log('failed:', err)
        }
    }

    render() {
        // TODO it feels a bit weird having to reconnect on each render. Will this slow
        // things down?
        if (this.api) {
            this.api.dispose()
            this.connect()
        }

        return (
            <div className="jitsi-video">
                <div id="jitsi-placeholder">
                    <FontAwesomeIcon icon={faSpinner} spin/>
                </div>
                <div id="jitsi-container"></div>
            </div>
        )
    }
}

export default connect(state => state, {
    updateAudioMuted: reducers.updateAudioMutedActionCreator,
    updateVideoMuted: reducers.updateVideoMutedActionCreator
})(JitsiVideo)
