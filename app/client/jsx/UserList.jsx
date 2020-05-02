import React from 'react'
import { Avatars } from './avatars.jsx'

const MAX_DISPLAYED_USERS = 8

export default props => {
    let more
    let users = props.users
    if (props.truncate && users.length > MAX_DISPLAYED_USERS) {
        users = users.slice(0, MAX_DISPLAYED_USERS)
        more = <div>...and more! Join them :)</div>
    }
    return (
        <div className="user-list">
            {users.map(user => {
                const [ type, color ] = user.avatar.split('-')
                return (
                    <div key={user.username} className="room-user">
                        <img src={Avatars[type][color]}></img>
                        <div>{user.username}</div>
                    </div>
                )
            })}
            {more}
        </div>
    )
}
