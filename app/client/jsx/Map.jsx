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
            roomId: null
        }
        this.rooms = Object.keys(RoomLayout)
            .filter(key => _.has(RoomLayout[key], 'map'))
            .map(key => {
                const room = Object.assign({}, RoomLayout[key])
                room.key = key
                return room
            })
    }

    // TODO add "you are here" puck
    // TODO option to see rooms visited
    // TODO resizable width and height
    // TODO figure out why styles don't work in scss

    componentDidMount() {
        const width = document.querySelector('.map').clientWidth / 2;
        const height = 600;
        const padding = 10;
        const map = new MapVisualization(
            '#d3-map',
            width,
            height,
            padding,
            // onClick callback function
            roomId => {
                this.props.updateCurrentRoom(roomId)
                this.setState({ roomId })
            }
        )
        map.draw(this.rooms)
    }

    render() {
        if (this.state.roomId) {
            return <Redirect to='/party'/>
        }
        return (
            <div className="map">
                <h1>You unlocked the party map!</h1>
                <div className="map-area">
                    <div id="map-key">
                        {this.rooms.map((d, i) => {
                            return (
                                <div key={`map-key-${i}`} className="map-key-item">
                                    <span className="map-key-item-number">{i}</span>
                                    <span className="map-key-item-name">{d.name}</span>
                                </div>
                            )
                        })}
                    </div>
                    <div id="d3-map"></div>
                </div>
                <p>Teleport into any room by clicking on it.</p>
            </div>
        )
    }
}

export default connect(
    state => state,
    {
        updateCurrentRoom: reducers.updateCurrentRoomActionCreator
    })(Map)
