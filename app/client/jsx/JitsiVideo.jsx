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
        switch (e.which || e.keyCode) {
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

    makeJitsiTransparent() {
        const iframe = document.querySelector('#jitsi-container iframe')
        iframe.setAttribute('allowtransparency', 'true')
        try {
            const iframeDocument = iframe.contentWindow.document
            const css = `
                body {
                    background-color: transparent !important;
                }
                body #largeVideoContainer.videoContainer {
                    background-color: transparent !important;
                }
                .tOoji {
                    background-color: transparent !important;
                }
            `
            const style = iframeDocument.createElement('style')
            iframeDocument.head.appendChild(style);
            style.type = 'text/css';
            style.appendChild(iframeDocument.createTextNode(css));
        } catch (err) {
            console.log("%c******************************************************", 'background: #222; color: #bada55')
            console.log("Can't make Jitsi transparent! Must be running locally.")
            console.log("To test the background, inspect the document inside the iframe and paste this code into the console:")
            console.log(`
const css = \`
body {
    background-color: transparent !important;
}
body #largeVideoContainer.videoContainer {
    background-color: transparent !important;
}
.tOoji {
    background-color: transparent !important;
}
\`
const style = document.createElement('style')
document.head.appendChild(style);
style.type = 'text/css';
style.appendChild(document.createTextNode(css));
            `)
            console.log("%c******************************************************", 'background: #222; color: #bada55')
        }
    }

    connect() {
        try {
            // If muteRoom=true in room settings, remove microphone controls.
            let toolbarButtons = this.toolbarButtons;
            if (this.props.jitsiData.muteRoom) {
                toolbarButtons = _.without(this.toolbarButtons, 'microphone')
            }

            const domain = 'party.gbre.org/jitsi/'
            // const domain = 'jitsi.gbre.org'
            // const domain = 'meet.jit.si';
            const options = {
                roomName: this.props.jitsiData.roomName,
                parentNode: document.getElementById('jitsi-container'),
                interfaceConfigOverwrite: {
                    // filmStripOnly: true,
                    SHOW_JITSI_WATERMARK: false,
                    DEFAULT_REMOTE_DISPLAY_NAME: 'Fellow Clarendonite',
                    SHOW_WATERMARK_FOR_GUESTS: false,
                    TOOLBAR_BUTTONS: toolbarButtons,

                },
                configOverwrite: {
                    disableSimulcast: false
                }
            }

            this.api = new window.JitsiMeetExternalAPI(domain, options)
            this.api.addEventListener('videoConferenceJoined', () => {
                this.makeJitsiTransparent()
                const commands = {
                    displayName: this.props.jitsiData.displayName,
                    avatarUrl: this.props.jitsiData.avatar,
                }
                // Persist audio/video muted settings unless acquired by muteRoom room setting
                if (this.isAudioMuted || this.props.jitsiData.muteRoom) {
                    commands.toggleAudio = []
                }
                if (this.isVideoMuted) {
                    commands.toggleVideo = []
                }
                this.api.executeCommands(commands)
                this.api.addEventListener('audioMuteStatusChanged', ({ muted }) => {
                    if (!this.props.jitsiData.muteRoom) {
                        this.isAudioMuted = muted
                    }
                })
                this.api.addEventListener('videoMuteStatusChanged', ({ muted }) => {
                    this.isVideoMuted = muted
                })
            })
        } catch (err) {
            console.log('failed:', err)
        }
    }

    shouldComponentUpdate(nextProps) {
        return this.props.jitsiData.roomName != nextProps.jitsiData.roomName
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
                    <FontAwesomeIcon icon={faSpinner} spin />
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
