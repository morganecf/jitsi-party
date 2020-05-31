import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMusic } from '@fortawesome/free-solid-svg-icons'

/*
TODO
-- save state (if pause don't replay) 
-- button styling
*/

export default class AudioPlayer extends Component {
    constructor(props) {
        super(props)

        this.state = { paused: true }
        this.start()
    }

    start() {
        this.audio = new Audio(this.props.src)
        this.audio.addEventListener('canplaythrough', () => {
            if (this.props.autoPlay) {
                this.play()
            }
        })
    }

    play() {
        this.audio.play()
        this.setState({ paused: false })
    }

    pause() {
        this.audio.pause()
        this.setState({ paused: true })
    }

    toggle() {
        if (this.state.paused) {
            this.play()
        } else {
            this.pause()
        }
    }

    cleanup() {
        this.audio.pause()
        this.audio.remove()
    }

    componentWillUnmount() {
        this.cleanup()
    }

    componentWillReceiveProps() {
        this.cleanup()
        this.start()
    }

    render() {
        const buttonClassname = this.props.hide ? 'audio-button hidden' : 'audio-button'
        return (
            <button onClick={this.toggle.bind(this)} className={buttonClassname}>
                <FontAwesomeIcon icon={faMusic}></FontAwesomeIcon>
            </button>
        )
    }
}
