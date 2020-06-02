import React from 'react'
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock, faCompass } from '@fortawesome/free-solid-svg-icons'

function formatEventTime(event) {
    // moment converts UTC dates to local time on all browsers so it's safer
    // to use than the native Date constructor or Date.parse
    const start = moment(event.start)
    const end = moment(event.end)
    return `${start.format('dddd, MMMM Do h:mm A')}  —  ${end.format('h:mm A')}`
}

const EventGroup = props => {
    const className = `event-list ${props.className}`
    return (
        <div className={className}>
            {props.events.map((event, index) => (
                <div className="event-item" key={`event-${index}`}>
                    <div className="event-info">
                        <div className="event-name">
                            {event.name}
                        </div>
                        <div className="event-description">
                            {event.description}
                        </div>
                        <div className="event-coordinates">
                            <div className="event-time">
                                <FontAwesomeIcon icon={faClock}/>
                                {formatEventTime(event)}
                            </div>
                            <div className="event-room">
                                <FontAwesomeIcon icon={faCompass}/>
                                {event.roomName}
                            </div>
                        </div>
                    </div>
                    <div className="event-image">
                        <img src={event.image}/>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default props => {
    const now = []
    const later = []
    const past = []

    const localTime = moment()

    props.events.forEach(event => {
        event.roomName = props.rooms[event.room].name
        const start = moment(event.start)
        const end = moment(event.end)
        if (localTime >= start && localTime <= end) {
            now.push(event)
        } else if (localTime < start) {
            later.push(event)
        } else {
            past.push(event)
        }
    })

    return (
        <div className="events-view">
            {now.length > 0 && <div className="events-header">Happening now</div>}
            <EventGroup className="events-now" events={now}></EventGroup>
            {later.length > 0 && <div className="events-header">Happening later</div>}
            <EventGroup className="events-later" events={later}></EventGroup>
            {past.length > 0 && <div className="events-header">Past events</div>}
            <EventGroup className="events-past" events={past}></EventGroup>
        </div>
    )
}
