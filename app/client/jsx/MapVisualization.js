import _ from 'lodash'
import * as d3 from 'd3';

const DOOR_SIZE = 0.8
const DOOR_GAP = 0.3
const ROOM_COLOR = '#9292b0'
const ROOM_HOVER_COLOR = '#b85f5f'
const TRANSITION_DURATION = 250

export default class MapVisualization {
    constructor(container, width, height, padding, mouseEvents) {
        _.assign(this, mouseEvents)

        this.svg = d3.select(container)
            .append('svg')
            .attr('width', width + padding)
            .attr('height', height + padding)

        this.xscale = d3.scaleLinear().range([padding, width - padding])
        this.yscale = d3.scaleLinear().range([padding, height - padding])
    }

    getRoomShape({ x, y, width, height, doors={} }) {
        // Optional doors
        let westDoor = [];
        let southDoor = [];
        let eastDoor = [];
        let northDoor = [];

        // Define coordinates for doors and create space for them
        if (doors.west) {
            westDoor = [
                [x, doors.west],
                [x - DOOR_GAP, doors.west],
                [x - DOOR_GAP, doors.west + DOOR_SIZE],
                [x, doors.west + DOOR_SIZE]
            ]
        }
        if (doors.south) {
            southDoor = [
                [doors.south, y + height],
                [doors.south, y + height + DOOR_GAP],
                [doors.south + DOOR_SIZE, y + height + DOOR_GAP],
                [doors.south + DOOR_SIZE, y + height]
            ]
        }
        if (doors.east) {
            eastDoor = [
                [x + width, doors.east + DOOR_SIZE],
                [x + width + DOOR_GAP, doors.east + DOOR_SIZE],
                [x + width + DOOR_GAP, doors.east],
                [x + width, doors.east]
            ]
        }
        if (doors.north) {
            northDoor = [
                [doors.north + DOOR_SIZE, y],
                [doors.north + DOOR_SIZE, y - DOOR_GAP],
                [doors.north, y - DOOR_GAP],
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
        ].map(d => [this.xscale(d[0]), this.yscale(d[1])])

        // Generate shape
        return d3.line().curve(d3.curveCardinal.tension(0.9))(points)
    }

    draw(data) {
        // A 30x30 grid was used to derive the values in RoomLayout
        // This makes sure those values are scaled to this view while
        // using the space efficiently
        this.xscale.domain([
            d3.min(data, d => d.map.x),
            d3.max(data, d => d.map.x + d.map.width)
        ])
        this.yscale.domain([
            d3.min(data, d => d.map.y),
            d3.max(data, d => d.map.y + d.map.height)
        ])

        // Create extra space for doors
        padRooms(data)

        const room = this.svg
            .selectAll('.map-room')
            .data(data)
            .enter()
            .append('g')
            .attr('class', 'map-room')

        room.append('path')
            .attr('d', d => this.getRoomShape(d.map))
            .style('stroke', '#000')
            .style('fill', ROOM_COLOR)
            .style('cursor', 'pointer')
            .on('mouseenter', d => this.enterRoom(d.key))
            .on('mouseleave', d => this.leaveRoom(d.key))
            .on('click', d => this.onRoomClick(d.key))

        room.append('text')
            .attr('x', d => this.xscale(d.map.x + d.map.width) - 4)
            .attr('y', d => this.yscale(d.map.y + d.map.height) - 6)
            .text((d, i) => i)
            .style('text-anchor', 'end')
            .style('font-size', 15)
            .style('font-family', 'Georgia')
    }

    enterRoom(roomId) {
        this.onRoomEnter(roomId)
        d3.select(d3.event.target)
            .interrupt()
            .transition()
            .duration(TRANSITION_DURATION)
            .style('fill', ROOM_HOVER_COLOR)
    }

    leaveRoom(roomId) {
        this.onRoomLeave(roomId)
        d3.select(d3.event.target)
            .interrupt()
            .transition()
            .duration(TRANSITION_DURATION)
            .style('fill', ROOM_COLOR)
    }
}

function padRooms(data) {
    data.forEach(room => {
        const doors = room.map.doors || {}
        if (doors.west) {
            room.map.x += DOOR_GAP
            room.map.width -= DOOR_GAP
        }
        if (doors.east) {
            room.map.width -= DOOR_GAP
        }
        if (doors.north) {
            room.map.y += DOOR_GAP
            room.map.height -= DOOR_GAP
        }
        if (doors.south) {
            room.map.height -= DOOR_GAP
        }
    })
}
