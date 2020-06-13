import React from 'react'
import Config from './Config.jsx'

export default ({ user, anonymize, children }) => {
    const { type, color } = user.avatar
    const imgClass = anonymize ? 'private' : ''
    const username = anonymize ? 'anonymous' : user.username
    return (
        <div className="room-user">
            <img className={imgClass} src={Config.avatars[type][color]}></img>
            <div>{username}</div>
            {children}
        </div>
    )
}
