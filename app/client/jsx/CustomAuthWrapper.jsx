import React from 'react'

export default ({ options, onAuthentication }) => {
    document.addEventListener('onCustomAuthentication', onAuthentication)
    const { iframe, descriptionHtml } = options
    return (
        <div className="custom-login">
            <div className="custom-login-description" dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
            <iframe className="auth-frame" src={iframe}></iframe>
        </div>
    )
}
