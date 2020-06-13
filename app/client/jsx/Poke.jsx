import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import User from './User.jsx'
import Config from './Config.jsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export const PokeOptions = ({ users, handlePoke }) => {
    const [poked, setPoked] = useState(null)

    const onPoke = user => {
        setPoked(user)
        setTimeout(() => handlePoke(user), 1000)
    }

    if (poked) {
        return (
            <div className="poke poke-options">
                {Config.poke.toText.replace('{user}', poked.username)}
            </div>
        )
    }

    return (
        <div className="poke poke-options">
            <div className="poke-header">{Config.poke.text}</div>
            {
                users.map(user => (
                    <User key={user.username} user={user}>
                        <button className="poke-user-button" onClick={() => onPoke(user)}>
                            <FontAwesomeIcon icon={Config.poke.fontAwesomeIcon} />
                        </button>
                    </User>
                ))
            }
        </div>
    )
}

export const PokeNotification = ({ to, from }) => {
    const text = to.id === from.id ?
        Config.poke.selfPoke :
        Config.poke.fromText.replace('{user}', from.username)
    return createPortal(
        <div className="poke poke-notification">
            <div className="poke-icon">
                <FontAwesomeIcon icon={Config.poke.fontAwesomeIcon} />
            </div>
            <div className="poke-notification-text">{text}</div>
        </div>,
        document.body
    )
}
