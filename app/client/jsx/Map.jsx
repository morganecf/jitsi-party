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

    // TODO resizable width and height
    // TODO compute scaling factor
    componentDidMount() {
        const width = 600;
        const height = 400;
        const padding = 200;
        const doorSize = 0.8
        const doorGap = 0.3

        const rooms = _.filter(RoomLayout, d => _.has(d, 'map'))

        const svg = d3.select('#d3-map')
            .append('svg')
            .attr('width', width + padding)
            .attr('height', height + padding)
            .style('background', '#fff')

        const room = ({ x, y, width, height, doors={} }) => {
            // Optional doors
            let westDoor = [];
            let southDoor = [];
            let eastDoor = [];
            let northDoor = [];

            // Create extra space for doors
            if (doors.west) {
                x += doorGap
                width -= doorGap
            }
            if (doors.east) {
                width -= doorGap
            }
            if (doors.north) {
                y += doorGap
                height -= doorGap
            }
            if (doors.south) {
                height -= doorGap
            }

            // Define coordinates for doors and create space for them
            if (doors.west) {
                westDoor = [
                    [x, doors.west],
                    [x - doorGap, doors.west],
                    [x - doorGap, doors.west + doorSize],
                    [x, doors.west + doorSize]
                ]
            }
            if (doors.south) {
                southDoor = [
                    [doors.south, y + height],
                    [doors.south, y + height + doorGap],
                    [doors.south + doorSize, y + height + doorGap],
                    [doors.south + doorSize, y + height]
                ]
            }
            if (doors.east) {
                eastDoor = [
                    [x + width, doors.east + doorSize],
                    [x + width + doorGap, doors.east + doorSize],
                    [x + width + doorGap, doors.east],
                    [x + width, doors.east]
                ]
            }
            if (doors.north) {
                northDoor = [
                    [doors.north + doorSize, y],
                    [doors.north + doorSize, y - doorGap],
                    [doors.north, y - doorGap],
                    [doors.north, y]
                ]
            }

            // Coordinate definition of a room
            const points = [
                [x, y],
                ...westDoor,
                [x, y + height],
                ...southDoor,
                [x + width, y + height],
                ...eastDoor,
                [x + width, y],
                ...northDoor,
                [x, y]
            ]

            // Generate shape
            return d3.line().curve(d3.curveCardinal.tension(0.9))(points)
        }

        svg.append('g')
            .selectAll('.room')
            .data(rooms)
            .enter()
            .append('path')
            .attr('d', d => room(d.map))
            .attr('transform', d => `scale(25)`)
            .style('stroke', 'black')
            .style('stroke-width', 2)
            .style('fill', 'grey')
            .style('vector-effect', 'non-scaling-stroke')
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
