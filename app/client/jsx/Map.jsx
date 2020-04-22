import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import reducers from './reducers.jsx'
import * as d3 from 'd3';
import RoomLayout from './RoomLayout.jsx'

class Map extends Component { 
    constructor(props) {
        super(props)
        this.state = {}
    }

    // TODO width and height
    componentDidMount() {
        const rooms = _.filter(RoomLayout, d => _.has(d, 'directions'))
        const svg = d3.select('#d3-map')
            .append('svg')
            .attr('width', 600)
            .attr('height', 400)
    }

    render() {
        return (
            <div className="map">
                <h1>You've unlocked the party map!</h1>
                <p>Teleport into any room by clicking on it.</p>
                <div id="d3-map"></div>
            </div>
        )
    }
}

export default connect(state => state, { updateState: reducers.exampleActionCreator })(Map)
