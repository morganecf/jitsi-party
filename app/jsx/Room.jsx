import React, { Component } from 'react'
import { connect } from 'react-redux'
import reducers from './reducers.jsx'
import RoomLayout from './RoomLayout.jsx'
import JitsiVideo from './JitsiVideo.jsx'
import ArtRoom from './ArtRoom.jsx'
import Exit from './Exit.jsx'
import Navigation from './Navigation.jsx'

class Room extends Component {
    /*
    * A room has the following:
    *   1. Name of room
    *   2. Optional description
    *   3. Content (video, art, text explanations, whatever)
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
        *   2. Art room which has a small video panel and one art piece
        *   3. The Great Outdoors, an exit page that can send you to a random room
        *   4. Room that just has some text content
        */
       const jitsiData = {
           displayName: this.props.displayName,
           roomName: this.state.room,
           height: RoomLayout[this.state.room].height
       }
       return {
           art: <ArtRoom jitsiData={jitsiData} art={RoomLayout[this.state.room].art}></ArtRoom>,
           jitsi: <JitsiVideo jitsiData={jitsiData}></JitsiVideo>,
           exit: <Exit></Exit>
       }[RoomLayout[this.state.room].type]
    }

    getRoomDescription() {
        if (RoomLayout[this.state.room].description) {
            return <p className="room-content">{RoomLayout[this.state.room].description}</p>
        }
    }

    onSwitchRoom(room) {
        this.setState({ room })
        this.props.updateCurrentRoom(room)
    }

    render() {
       return (
            <div className="room">
                <div className="room-header">
                    <h2 className="room-header">{this.state.room}</h2>
                </div>
                {this.getRoomDescription()}
                {this.getRoomType()}
                <div id="nav-container">
                    <Navigation directions={RoomLayout[this.state.room].directions} onClick={this.onSwitchRoom.bind(this)}></Navigation>
                </div>
            </div>
        )
    }
}

export default connect(state => state, {
    updateCurrentRoom: reducers.updateCurrentRoomActionCreator
})(Room)
