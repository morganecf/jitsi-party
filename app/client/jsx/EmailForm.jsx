import React, { useState } from 'react'
import { HttpApi } from './WebAPI.jsx'
import Config from './Config.jsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faCircleNotch,
    faEnvelope,
    faExclamationCircle
} from '@fortawesome/free-solid-svg-icons'


export default ({ user }) => {
    const MIN_WORDS = 10
    const MAX_WORDS = 500

    const STATUS = {
        sending: {
            label: 'Your message is being sent...',
            icon: faCircleNotch
        },
        succeeded: {
            label: 'Message sent!',
            icon: faEnvelope
        },
        failed: {
            label: `Something went wrong sending your message. Please close this box and try again, or email the moderator directly at ${Config.moderation.moderatorEmails[0]}.`,
            icon: faExclamationCircle
        }
    }

    const httpApi = new HttpApi()

    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [sent, setSent] = useState(false)
    const [status, setStatus] = useState('sending')

    const numWords = message.split(/\s+/).length - 1
    const wordCountClass = numWords < MIN_WORDS || numWords === MAX_WORDS ? 'bad-word-count' : ''

    const handleMessageInput = event => {
        if (numWords <= MAX_WORDS) {
            setMessage(event.target.value)
        }
    }
    const handleEmailInput = event => setEmail(event.target.value)
    const handleSubmit = async () => {
        // TODO email validation
        setSent(true)
        const { success } = await httpApi.emailModerators(message, email, user)
        setStatus(success ? 'succeeded' : 'failed')
    }

    return sent ?
        (
            <div className="email-form">
                <div className="email-status">
                    <span className="email-status-icon"><FontAwesomeIcon icon={STATUS[status].icon} spin={status === 'sending'}/></span>
                    <span className="email-status-label">{STATUS[status].label}</span>
                </div>
                {
                    status === 'failed' ? <section className="original-message">{message}</section> : ''
                }
            </div>
        ) :
        (
            <div className="email-form">
                <section className="email-form-instructions">
                    {Config.moderation.formDescription}
                </section>
                <section className="email-form-message">
                    <div>Your message <span className={wordCountClass}>({numWords} / {MAX_WORDS})</span></div>
                    <textarea
                        autoFocus="autofocus"
                        value={message}
                        onChange={handleMessageInput}/>
                </section>
                <section className="email-form-email">
                    <span>Email (optional)</span><input type="email" onChange={handleEmailInput} />
                </section>
                <section className="email-form-button">
                    <button disabled={numWords < MIN_WORDS || numWords > MAX_WORDS} onClick={handleSubmit}>
                        Send
                    </button>
                </section>
            </div>
        )
}
