import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import reducers from './reducers.jsx'
import MapVisualization from './MapVisualization.js'
import MapRoomInfo from './MapRoomInfo.jsx'
import Config from './Config.jsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

class Map extends Component {
    constructor(props) {
        super(props)
        this.state = {
            highlighted: null,
            users: []
        }
    }

    componentDidMount() {
        this.rooms = Object.keys(this.props.rooms)
            .filter(key => _.has(this.props.rooms[key], 'map'))
            .map(key => {
                const room = _.cloneDeep(this.props.rooms[key])
                room.key = key
                return room
            })

        const width = document.querySelector('.map').clientWidth / 1.5
        const height = document.querySelector('.map').clientHeight / 1.25
        const padding = 10;
        const mouseEvents = {
            onRoomClick: room => {
                if (room !== 'room314') {
                    this.props.onRoomClick(room)
                    this.props.handleCloseMap()
                }
            },
            onRoomEnter: room => {
                this.setState({ highlighted: room })
            },
            onRoomLeave: () => {
                this.setState({ highlighted: null })
            }
        }

        this.map = new MapVisualization(
            '#d3-map',
            width,
            height,
            padding,
            mouseEvents
        )
        this.map.draw(this.rooms)
        this.updateMap(false)
    }

    updateMap(transition) {
        this.map.update(
            _.pickBy(this.props.users,  (val, key) => key !== 'hallway'),
            transition
        )
    }

    getGlobalStats() {
        const users = this.props.users

        const numInHouse = _.sumBy(Object.keys(users), room => users[room].length)
        const numInHallways = (users.hallway || []).length
        const numInRooms = numInHouse - numInHallways

        const { stats: config } = Config.map

        const mapStats = [
            {
                key: 'numberInHouse',
                count: numInHouse
            },
            {
                key: 'numberInRooms',
                count: numInRooms
            },
            {
                key: 'numberInHallways',
                count: numInHallways
            }
        ]
        .filter(({ key }) => config[key].display)
        .map(({ key, count }) => (
            config[key].text.replace('{count}', count)
        ))

        config.additionalStats.forEach(({ text, match }) => {
            const rooms = _.isArray(match) ?
                _.intersection(Object.keys(users), match) :
                Object.keys(users).filter(room => new RegExp(match).test(room))
            const count = _.sumBy(rooms, room => users[room].length)
            mapStats.push(text.replace('{count}', count))
        })

        return (
            <div className="map-stats">
                {mapStats.map((text, index) => (
                    <div key={`stat-${index}`} className="map-stat-column">
                        {text}
                    </div>
                ))}
            </div>
        )
    }

    render() {
        if (this.map) {
            this.updateMap(true)
        }
        
        const roomId = this.state.highlighted
        const room = (this.props.rooms || {})[roomId]
        // TODO not lock unvisited rooms for now; this can be a future feature
        const isVisited = true;
        // const isVisited = this.props.visited && this.props.visited[roomId]
        const currentRoomUsers = this.props.users[roomId] || []
        const eventsForRoom = this.props.events.filter(event => event.room === roomId)

        return (
            <div className="map">
                <div className="map-header">
                    {this.getGlobalStats()}
                    <button className="map-close-button" onClick={this.props.handleCloseMap}>
                        <FontAwesomeIcon icon={faTimes}/>
                    </button>
                </div>
                <div className="map-area">
                    <div id="d3-map"></div>
                    <MapRoomInfo
                        room={room}
                        events={eventsForRoom}
                        users={currentRoomUsers}
                        isVisited={isVisited}>
                    </MapRoomInfo>
                </div>
            </div>
        )
    }
}

export default connect(
    state => state,
    {
        updateCurrentRoom: reducers.updateCurrentRoomActionCreator
    })(Map)
