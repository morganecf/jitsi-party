import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMusic } from '@fortawesome/free-solid-svg-icons'

/*
TODO 
-- test with adventures
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

    async play() {
        try {
            await this.audio.play()
            this.setState({ paused: false })
        } catch (err) {
            console.log('User was not interacting with document during play start')
        }
    }

    pause() {
        this.audio.pause()
        this.setState({ paused: true })
    }

    toggle() {
        if (this.state.paused) {
            this.play()
            this.props.onChange({ autoPlay: true })
        } else {
            this.pause()
            this.props.onChange({ autoPlay: false })
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
        const buttonClasses = [
            'audio-button'
        ]
        if (!this.state.paused) {
            buttonClasses.push('focused')
        }
        if (this.props.hide) {
            buttonClasses.push('hidden')
        }
        const buttonClassname = buttonClasses.join(' ')
        return (
            <button onClick={this.toggle.bind(this)} className={buttonClassname}>
                <FontAwesomeIcon icon={faMusic}></FontAwesomeIcon>
            </button>
        )
    }
}
