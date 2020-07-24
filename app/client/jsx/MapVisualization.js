import _ from 'lodash'
import * as d3 from 'd3';

const DOOR_SIZE = 0.8
const DOOR_GAP = 0.3

// Transition time for colors in heat map
const ROOM_TRANSITION_DURATION = 500

const ROOM_OPACITY = 0.8
const EMPTY_ROOM_OPACITY = 0.5

// If the # of users on the map is less than this number, the heat map
// colors will scale between 0 and this number. This prevents colors
// from being misleadingly bright when there are very few users in a
// room
const DEFAULT_MIN_USERS_FOR_COLOR_SCALE = 5


export default class MapVisualization {
    constructor(container, width, height, padding, mouseEvents) {
        _.assign(this, mouseEvents)

        // Svg container for map
        this.svg = d3.select(container)
            .append('svg')
            .attr('width', width + padding)
            .attr('height', height + padding)

        this.xscale = d3.scaleLinear().range([padding, width - padding])
        this.yscale = d3.scaleLinear().range([padding, height - padding])
        this.colorScale = d3.scaleSequential(d3.interpolateCividis)
        this.opacityScale = d3.scaleLinear().range([
            EMPTY_ROOM_OPACITY,
            1
        ])
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

    draw(rooms, visited) {
        // A 30x30 grid was used to derive the values in rooms.json.
        // This makes sure those values are scaled to this view while
        // using the space efficiently
        this.xscale.domain([
            d3.min(rooms, d => d.map.x),
            d3.max(rooms, d => d.map.x + d.map.width)
        ])
        this.yscale.domain([
            d3.min(rooms, d => d.map.y),
            d3.max(rooms, d => d.map.y + d.map.height)
        ])

        // Create extra space for doors
        padRooms(rooms)

        // Room groups
        const groups = this.svg
            .selectAll('.map-room')
            .data(rooms)
            .enter()
            .append('g')
            .attr('class', 'map-room')

        // Draw rooms
        this.rooms = groups.append('path')
            .attr('d', d => this.getRoomShape(d.map))
            // .attr('fill-opacity', EMPTY_ROOM_OPACITY)
            .on('mouseenter', d => {
                this.onRoomEnter(d.key)
                d3.select(d3.event.target)
                    .classed('highlighted-room', true)
            })
            .on('mouseleave', d => {
                this.onRoomLeave(d.key)
                d3.select(d3.event.target)
                    .classed('highlighted-room', false)
            })
            .on('click', d => this.onRoomClick(d.key))
            // .classed('unvisited', d => !visited[d.key])
    }

    update(users, transition) {
        const numUsers = _.sumBy(Object.values(users), d => d.length)
        const maxUsersInRoom = (_.maxBy(Object.values(users), u => u.length) || []).length

        this.colorScale.domain([
            0,
            Math.max(DEFAULT_MIN_USERS_FOR_COLOR_SCALE, numUsers)
        ])
        this.opacityScale.domain([0, maxUsersInRoom])

        const selector = transition ?
            this.rooms
                .interrupt()
                .transition()
                .duration(ROOM_TRANSITION_DURATION)
            : this.rooms

        selector
            // .attr('fill', room => this.colorScale((users[room.key] || []).length + 1))
            // .attr('fill-opacity', room => users[room.key] ? ROOM_OPACITY : EMPTY_ROOM_OPACITY)
            .attr('fill-opacity', room => numUsers ? this.opacityScale((users[room.key] || []).length) : 1)
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
