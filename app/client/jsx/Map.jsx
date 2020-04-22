import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import reducers from './reducers.jsx'
import RoomLayout from './RoomLayout.jsx'
import MapVisualization from './MapVisualization.js'

class Map extends Component { 
    constructor(props) {
        super(props)
        this.state = {}
    }

    // TODO add key 
    // TODO add "you are here" puck
    // TODO option to see rooms visited
    // TODO change mapping such that id is key and name is attr
    // TODO onClick events --> teleport
    // TODO resizable width and height
    // TODO figure out why styles don't work in scss

    componentDidMount() {
        const width = document.querySelector('.map').clientWidth / 2;
        const height = 600;
        const padding = 20;

        const rooms = _.filter(RoomLayout, d => _.has(d, 'map'))

        const map = new MapVisualization('#d3-map', width, height, padding)
        map.draw(rooms)
    }

    render() {
        return (
            <div className="map">
                <h1>You've unlocked the party map!</h1>
                <div id="d3-map"></div>
                <p>Teleport into any room by clicking on it.</p>
            </div>
        )
    }
}

export default connect(state => state, { updateState: reducers.exampleActionCreator })(Map)
