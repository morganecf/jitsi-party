import React, { Component } from 'react'
import { connect } from 'react-redux'
import reducers from './reducers.jsx'
import { Link } from 'react-router-dom'

class Map extends Component { 
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    render() {
        return (
            <div className="map">
                <h1>Marauder's Map</h1>
                <Link to="/party" activeclassname="active">Back</Link>
            </div>
        )
    }
}

export default connect(state => state, { updateState: reducers.exampleActionCreator })(Map)
