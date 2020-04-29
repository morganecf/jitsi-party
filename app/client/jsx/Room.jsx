import React, { Component } from 'react'
import { connect } from 'react-redux'
import reducers from './reducers.jsx'
import { Redirect } from 'react-router-dom'
import RoomLayout from './RoomLayout.jsx'
import JitsiVideo from './JitsiVideo.jsx'
import ArtRoom from './ArtRoom.jsx'
import Adventure from './Adventure.jsx'
import Navigation from './Navigation.jsx'

class Room extends Component {
    /*
    * A room has the following:
    *   1. Name of room
    *   2. Optional description
    *   3. Content (video, art, text, etc)
    *   4. Navigation component used to move through rooms
    *   5. Optional artifact, i.e. something the user finds or unlocks, like a map
    * Add new rooms to RoomLayout.jsx, where individual rooms are defined. Add new TYPES of rooms
    * by creating a new component for that room and updating the getRoomType() mapping.
    */
    constructor(props) {
        super(props)
        this.state = {
            room: this.props.currentRoom
        }
    }

    getRoomType() {
        /*
        * There are currently 3 different types of rooms:
        *   1. Regular Jitsi room that just has video
        *   2. Art room which has a small video panel and an image
        *   3. Text-based adventure rooms where you have to make a decision
        *   4. Special purpose rooms that exist at a different route
        */
       const roomData = RoomLayout[this.state.room]
       const jitsiData = {
           displayName: this.props.displayName,
           avatar: this.props.avatar,
           roomName: roomData.name,
           height: roomData.videoHeight,
           muteRoom: roomData.muteRoom,
       }
       return {
           art: <ArtRoom jitsiData={jitsiData} art={roomData.art}></ArtRoom>,
           jitsi: <JitsiVideo jitsiData={jitsiData}></JitsiVideo>,
           adventure: <Adventure options={roomData.adventureOptions} onClick={this.onSwitchRoom.bind(this)}></Adventure>
       }[roomData.type]
    }

    getRoomDescription() {
        if (RoomLayout[this.state.room].description) {
            return (
                <div className="room-content">
                    {RoomLayout[this.state.room].description}
                </div>
            )
        }
    }

    onSwitchRoom(room) {
        this.setState({ room })
        this.props.updateCurrentRoom(room)
    }

    render() {
        if (RoomLayout[this.state.room].type === 'redirect') {
            return <Redirect to={RoomLayout[this.state.room].route}/>
        }
        return (
            <div className="room">
                <div className="room-header">
                    <h2 className="room-header">{RoomLayout[this.state.room].name}</h2>
                </div>
                {this.getRoomType()}
                {this.getRoomDescription()}
                <Navigation directions={RoomLayout[this.state.room].directions} onClick={this.onSwitchRoom.bind(this)}></Navigation>
            </div>
        )
    }
}

export default connect(state => state, {
    updateCurrentRoom: reducers.updateCurrentRoomActionCreator
})(Room)
