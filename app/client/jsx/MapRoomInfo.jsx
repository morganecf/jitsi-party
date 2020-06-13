import React from 'react'
import UserList from './UserList.jsx'
import { formatEventFromNow } from './utils.js'

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
        const isPrivate = _.has(props.room, 'capacity')
        userContent = (
            <div>
                <div className="room-info-content">{numPeople}</div>
                <UserList users={props.users} anonymize={isPrivate}></UserList>
            </div>
        )
    } else {
        const str = props.room.name === 'Room 314' ?
            "You can't just teleport here. Try finding an adventure first." :
            'No one is in this room yet. Click on it to teleport!'
        userContent = <div className="room-info-content"> {str}</div>
    }

    // Show announcements if any exist
    let announcements
    if (props.events && props.events.length > 0) {
        announcements = (
            <div className="map-room-announcements">
                <hr></hr>
                <ul>
                    {props.events.map((event, i) => (
                        <li key={`announcement-${i}`}>
                            <b>{event.name}</b> {formatEventFromNow(event)}
                        </li>
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
