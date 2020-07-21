import React, { useState } from 'react'
import { HttpApi } from './WebAPI.jsx'


export default ({ user }) => {
    const MIN_WORDS = 10
    const MAX_WORDS = 500

    const httpApi = new HttpApi()

    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [sending, setSending] = useState(false)
    const [sent, setSent] = useState(false)

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
        // TODO don't modify inputs while sending
        setSending(true)
        const { success } = await httpApi.emailModerators(message, email, user)
        if (success) {
            setSent(true)
        }
    }

    return sent ?
        (
            <div className="email-form">
                <div className="email-sent">Message sent!</div>
            </div>
        ) :
        (
            <div className="email-form">
                <section className="email-form-instructions">
                    If you have any questions or concerns, please send us a message and our moderators will address it as soon as possible.
                    Please include your email address if you want a moderator to contact you back directly. 
                </section>
                <section className="email-form-message">
                    <div>Your message <span className={wordCountClass}>({numWords} / {MAX_WORDS})</span></div>
                    <textarea
                        // placeholder={PLACEHOLDER}
                        autoFocus="autofocus"
                        disabled={sending}
                        value={message}
                        onChange={handleMessageInput}/>
                </section>
                <section className="email-form-email">
                    <span>Email (optional)</span><input type="email" onChange={handleEmailInput} />
                </section>
                <section className="email-form-button">
                    <button disabled={sending || numWords < MIN_WORDS || numWords > MAX_WORDS} onClick={handleSubmit}>
                        {sending ? 'Sending' : 'Send'}
                    </button>
                </section>
            </div>
        )
}
