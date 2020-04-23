import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import reducers from './reducers.jsx'
import { Redirect } from 'react-router-dom'
import RoomLayout from './RoomLayout.jsx'
import MapVisualization from './MapVisualization.js'

class Map extends Component { 
    constructor(props) {
        super(props)
        this.state = {
            redirect: null,
            highlighted: null
        }

        this.rooms = Object.keys(RoomLayout)
            .filter(key => _.has(RoomLayout[key], 'map'))
            .map(key => {
                const room = Object.assign({}, RoomLayout[key])
                room.key = key
                return _.cloneDeep(room)
            })

        this.visited = this.props.path.reduce((map, room) => {
            map[room] = true;
            return map;
        }, {});
    }

    componentDidMount() {
        const width = document.querySelector('.map').clientWidth / 2;
        const height = 600;
        const padding = 10;
        const mouseEvents = {
            onRoomClick: roomId => {
                this.props.updateCurrentRoom(roomId)
                this.setState({ redirect: true })
            },
            onRoomEnter: roomId => {
                this.setState({ highlighted: roomId })
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
        map.draw(this.rooms, this.visited)
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to='/party'/>
        }
        return (
            <div className="map">
                <h1>You unlocked the party map! =O</h1>
                <p>Teleport into any room by clicking on it.</p>
                <div className="map-area">
                    <div id="map-key">
                        <div className="room-key">
                            {this.rooms.map((d, i) => {
                                const className = d.key === this.state.highlighted ?
                                    'map-key-item highlighted-key-item' :
                                    'map-key-item'
                                return (
                                    <div key={d.key} className={className}>
                                        <span className="map-key-item-number">{i}</span>
                                        <span className="map-key-item-name">{d.name}</span>
                                    </div>
                                )
                            })}
                        </div>
                        <div className="visited-key">
                            <span id="visited-block" className="map-key-item-number"></span>
                            <span>Visited</span>
                        </div>
                    </div>
                    <div id="d3-map"></div>
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
