import React from 'react'
import { Avatars } from './avatars.jsx'

export default props => {
    if (!props.room) {
        return <div id="map-info"></div>
    }

    // Case 1: User has not visited room, info is locked
    if (!props.isVisited) {
        return (
            <div id="map-info">
                <div className="room-info">
                    <div className="room-name">{props.room.name}</div>
                    <hr></hr>
                    <div className="room-info-content">
                        You have not unlocked this room yet. Click on it to teleport!
                    </div>
                </div>
            </div>
        )
    }

    // Case 2: User has visited room, info is unlocked
    let userContent
    if (props.users.length > 0) {
        const numPeople = props.users.length > 1 ?
            `There are ${props.users.length} people in this room!` :
            'There is one person in this room'
        userContent = (
            <div>
                <div className="room-info-content">{numPeople}</div>
                <div className="user-list">
                    {props.users.map(user => {
                        const [ type, color ] = user.avatar.split('-')
                        return (
                            <div key={user.username} className="room-user">
                                <img src={Avatars[type][color]}></img>
                                <div>{user.username}</div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    } else {
        userContent = (
            <div className="room-info-content">
                No one is in this room yet. Click on it to teleport!
            </div>
        )
    }

    // Show announcements if any exist
    let announcements
    if (props.room.announcements) {
        announcements = (
            <div className="map-room-announcements">
                <hr></hr>
                <ul>
                    {props.room.announcements.map((announcement, i) => (
                        <li key={`announcement-${i}`}>{announcement}</li>
                    ))}
                </ul>
            </div>
        )
    }

    return (
        <div id="map-info">
            <div className="room-info">
                <div className="room-name">{props.room.name}</div>
                {userContent}
                {announcements}
            </div>
        </div>
    )
}
