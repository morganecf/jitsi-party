import React from 'react'
import Config from './Config.jsx'

const MAX_DISPLAYED_USERS = 8

export default props => {
    let more
    let users = props.users
    if (props.truncate && users.length > MAX_DISPLAYED_USERS) {
        users = users.slice(0, MAX_DISPLAYED_USERS)
        more = <div>...and more! Join them :)</div>
    }

    const isPrivate = _.has(props.room, 'capacity')

    return (
        <div className="user-list">
            {users.map(user => {
                const { type, color } = user.avatar
                const imgClass = isPrivate ? 'private' : ''
                const username = isPrivate ? 'anonymous' : user.username

                return (
                    <div key={user.username} className="room-user">
                        <img className={imgClass} src={Config.avatars[type][color]}></img>
                        <div>{username}</div>
                    </div>
                )
            })}
            {more}
        </div>
    )
}
