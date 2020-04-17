import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import reducers from './reducers.jsx'
import Room from './Room.jsx'
import { Link } from 'react-router-dom'

class Vestibule extends Component { 
    constructor(props) {
        super(props)
        this.state = {}
    }

    async componentDidMount() {
        // Example usage of redux
        this.props.updateState('test')
    }

    /*
        - Enter username
        - Map network of rooms to generated routes
        - Keep track of where the user is and their path, show path on map
        - Session!?
        - Create map
            - "You are here"
            - Who's in which room
        - Covid sprites floating in the background
    */

    render() {
        return (
            <div className="vestibule">
                <Link to="/about" activeclassname="active">About</Link>
                <Room roomName='testjitsiroom' displayName='morg'></Room>
            </div>
        )
    }
}

// Example usage of redux
export default connect(state => state, { updateState: reducers.exampleActionCreator })(Vestibule)
