import React, { useState } from 'react'

export default ({ options, onAuthentication }) => {
    const { iframe, descriptionHtml } = options
    const [loading, setLoading] = useState(true)

    document.addEventListener('onCustomAuthentication', event => {
        setLoading(false)
        if (event.token) {
            onAuthentication()
        }
    })
    
    return (
        <div className="custom-login">
            {loading && <div className="custom-login-loading">Loading...</div>}
            <div className={`custom-login-container ${loading ? 'loading' : ''}`}>
                <div className="custom-login-description" dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
                <iframe className="auth-frame" src={iframe}></iframe>
            </div>
        </div>
    )
}
