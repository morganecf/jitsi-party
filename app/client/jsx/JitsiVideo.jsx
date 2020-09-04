import React, { Component } from 'react'
import { connect } from 'react-redux'
import reducers from './reducers.jsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import Config from './Config.jsx'
import { transparentJitsi } from './utils.js'

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
        if (window.api) {
            window.api.dispose()
        }
        // Persist audio/video muted settings
        this.props.updateJitsiAudioMuted(this.isAudioMuted)
        this.props.updateJitsiVideoMuted(this.isVideoMuted)
    }

    handleKeydown(e) {
        if (!window.api) { return; }
        e = e || window.event;
        switch (e.which || e.keyCode) {
            case 65:
                // a
                window.api.executeCommand('toggleAudio');
                break;
            case 86:
                // v
                window.api.executeCommand('toggleVideo');
                break;
        }
    }

    makeJitsiTransparent() {
        const iframe = document.querySelector('#jitsi-container iframe')
        iframe.setAttribute('allowtransparency', 'true')
        try {
            const iframeDocument = iframe.contentWindow.document
            const style = iframeDocument.createElement('style')
            iframeDocument.head.appendChild(style);
            style.type = 'text/css';
            style.appendChild(iframeDocument.createTextNode(transparentJitsi.css));
        } catch (err) {
            transparentJitsi.printInstructions()
        }
    }

    hideSpinner() {
        const placeholder = document.getElementById('jitsi-placeholder')
        placeholder.style.display = "none";
    }

    connect() {
        try {
            // If muteRoom=true in room settings, remove microphone controls.
            let toolbarButtons = this.toolbarButtons;
            if (this.props.jitsiData.muteRoom) {
                toolbarButtons = _.without(this.toolbarButtons, 'microphone')
            }

            let domain = Config.jitsiServerUrl
            if (Config.overrideJitsiServerUrlWithWindowHost) {
                domain = `${window.location.host}/jitsi`
            }

            const options = {
                noSSL: Config.noJitsiServerSSL,
                roomName: this.props.jitsiData.roomName,
                parentNode: document.getElementById('jitsi-container'),
                interfaceConfigOverwrite: {
                    // filmStripOnly: true,
                    SHOW_JITSI_WATERMARK: false,
                    DEFAULT_REMOTE_DISPLAY_NAME: Config.videoDisplayName,
                    SHOW_WATERMARK_FOR_GUESTS: false,
                    TOOLBAR_BUTTONS: toolbarButtons
                },
                configOverwrite: {
                    disableSimulcast: false
                }
            }

            window.api = new window.JitsiMeetExternalAPI(domain, options)
            window.api.addEventListener('videoConferenceJoined', () => {
                this.makeJitsiTransparent()
                this.hideSpinner()
                const { type, color } = this.props.jitsiData.avatar
                const avatarUrl = Config.baseUrl + Config.avatars[type].images[color]
                const commands = {
                    displayName: this.props.jitsiData.displayName,
                    avatarUrl
                }
                // Persist audio/video muted settings unless acquired by muteRoom room setting
                if (this.isAudioMuted || this.props.jitsiData.muteRoom) {
                    commands.toggleAudio = []
                }
                if (this.isVideoMuted) {
                    commands.toggleVideo = []
                }
                window.api.executeCommands(commands)
                window.api.addEventListener('audioMuteStatusChanged', ({ muted }) => {
                    if (!this.props.jitsiData.muteRoom) {
                        this.isAudioMuted = muted
                    }
                })
                window.api.addEventListener('videoMuteStatusChanged', ({ muted }) => {
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
        if (window.api) {
            window.api.executeCommand('hangup')
            window.api.dispose()
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
    updateJitsiAudioMuted: reducers.updateJitsiAudioMutedActionCreator,
    updateJitsiVideoMuted: reducers.updateJitsiVideoMutedActionCreator
})(JitsiVideo)
