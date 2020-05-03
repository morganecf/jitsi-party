import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import reducers from './reducers.jsx'
import MapVisualization from './MapVisualization.js'
import MapRoomInfo from './MapRoomInfo.jsx'
import { HttpApi } from './WebAPI.jsx'

class Map extends Component {
    constructor(props) {
        super(props)

        this.state = {
            highlighted: null,
            users: []
        }

        this.httpApi = new HttpApi()

        this.props.socketApi.on('user-left-room', this.fetchUsers.bind(this))
        this.props.socketApi.on('user-entered-room', this.fetchUsers.bind(this))
        this.props.socketApi.on('user-disconnected', this.fetchUsers.bind(this))
    }

    async fetchUsers() {
        const { success, users } = await this.httpApi.getUsers()
        if (success) {
            const usersByRoom = _.reduce(users, (result, user) => {
                (result[user.room] || (result[user.room] = [])).push(user)
                return result
              }, {});

            this.setState({
                users,
                usersByRoom
            })
        }
    }

    async componentDidMount() {
        await this.fetchUsers()

        // Format room definition into array where each entry is a room
        // with users
        this.rooms = Object.keys(this.props.rooms)
            .filter(key => _.has(this.props.rooms[key], 'map'))
            .map(key => {
                const room = Object.assign({}, this.props.rooms[key])
                room.key = key
                room.users = this.state.usersByRoom[key] || []
                return _.cloneDeep(room)
            })

        const width = document.querySelector('.map').clientWidth / 1.5;
        const height = 600;
        const padding = 10;
        const mouseEvents = {
            onRoomClick: room => {
                if (room !== 'room314') {
                    this.props.onRoomClick(room)
                }
            },
            onRoomEnter: room => {
                this.setState({ highlighted: room })
            },
            onRoomLeave: () => {
                this.setState({ highlighted: null })
            }
        }

        const map = new MapVisualization(
            '#d3-map',
            width,
            height,
            padding,
            mouseEvents
        )
        map.draw(this.rooms, this.props.visited)
    }

    getGlobalStats() {
        const numInHallways = this.state.users.filter(user => !user.room).length
        const numInBathrooms = this.state.users.filter(
            user => user.room && user.room.endsWith('bathroom')
        ).length
        const numInRooms = this.state.users.filter(user => user.room).length - numInBathrooms

        return (
            <div className="map-stats">
                <div className="map-stat-column">
                    <span className="map-stat-emoji">🏚️</span>
                    {this.state.users.length} in house
                </div>
                <div className="map-stat-column">
                    <span className="map-stat-emoji">🎊</span>
                    {numInRooms} partying
                </div>
                <div className="map-stat-column">
                    <span className="map-stat-emoji">🚻</span>
                    {numInBathrooms} taking bathroom break
                </div>
                <div className="map-stat-column">
                    <span className="map-stat-emoji">🌓</span>
                    {numInHallways} roaming
                </div>
            </div>
        )
    }

    render() {
        const roomId = this.state.highlighted
        const room = (this.props.rooms || {})[roomId]
        // TODO not lock unvisited rooms for now; this can be a future feature
        const isVisited = true;
        // const isVisited = this.props.visited && this.props.visited[roomId]
        const users = this.state.usersByRoom && this.state.usersByRoom[roomId] || []

        return (
            <div className="map">
                <div className="map-header">
                    {this.getGlobalStats()}
                    <div className="map-header-tagline">Hover over rooms to see who's where!</div>
                </div>
                <div className="map-area">
                    <div id="d3-map"></div>
                    <MapRoomInfo room={room} isVisited={isVisited} users={users}></MapRoomInfo>
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
