import React from 'react'

export default props => {
    const userStr = props.users.length > 1 ?
        `${props.users.length} people are in this room!` :
        '1 person is in this room!'
    const users = props.users.length ?
        (
            <div className="user-list">
                <div>{userStr} Join them :)</div>
                {props.users.map(user => (
                    <div className="user-list-item">{user.username}</div>
                ))}
            </div>
        ) :
        <div>No one is in this room :(</div>
    return (
        <div className="door">
            <button onClick={props.onClick.bind(this)}>Enter {props.room}</button>
            {users}
        </div>
    )
}
