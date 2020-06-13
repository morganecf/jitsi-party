import React from 'react'
import User from './User.jsx'

const MAX_DISPLAYED_USERS = 8

export default ({ users, truncate, anonymize }) => {
    let more
    if (truncate && users.length > MAX_DISPLAYED_USERS) {
        users = users.slice(0, MAX_DISPLAYED_USERS)
        more = <div>...and more! Join them :)</div>
    }
    return (
        <div className="user-list">
            {
                users.map(user => (
                    <User key={user.username} user={user} anonymize={anonymize} />
                ))
            }
            { more }
        </div>
    )
}
