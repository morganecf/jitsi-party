import React, { Component } from 'react'
import RoomLayout from './RoomLayout.jsx'
import { connect } from 'react-redux'
import reducers from './reducers.jsx'
import { Link } from 'react-router-dom'

class Exit extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const rooms = Object.keys(RoomLayout)
        const randomRoom = rooms[Math.floor(Math.random() * rooms.length)]
        this.props.updateCurrentRoom(randomRoom)

        return (
            <div className="exit">
                Are you sure you want to leave!?!? Why don't you pop into a <Link to="/party" activeclassname="active">random room</Link> instead?
            </div>
        )
    }
}

export default connect(
    state => state, 
    {
        updateCurrentRoom: reducers.updateCurrentRoomActionCreator
     })(Exit)
