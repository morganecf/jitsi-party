import _ from 'lodash'
import React from 'react'
import Map from './Map.jsx'
import EventList from './EventList.jsx'
import CustomComponents from './CustomComponents'

export default ({ room, modal, props = {} }) => {
    if (modal in CustomComponents) {
        const Component = CustomComponents[modal]
        return <Component room={room} {...props} />
    }
    const map = (
        <Map
            onRoomClick={room.onSwitchRoom.bind(room)}
            handleCloseMap={() => room.handleModalChange(null)}>
        </Map>
    )
    const events = (
        <EventList
            rooms={room.props.rooms}
            events={room.props.events}>
        </EventList>
    )
    return { map, events }[modal] || null
}
