import _ from 'lodash';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import reducers from './reducers.jsx';
import MapVisualization from './MapVisualization.js';
import MapRoomInfo from './MapRoomInfo.jsx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons';

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      highlighted: null,
      users: [],
    };
  }

  componentDidMount() {
    this.rooms = Object.keys(this.props.rooms)
        .filter((key) => _.has(this.props.rooms[key], 'map'))
        .map((key) => {
          const room = _.cloneDeep(this.props.rooms[key]);
          room.key = key;
          return room;
        });

    const width = document.querySelector('.map').clientWidth / 1.5;
    const height = document.querySelector('.map').clientHeight / 1.25;
    const padding = 10;
    const mouseEvents = {
      onRoomClick: (room) => {
        if (room !== 'room314') {
          this.props.onRoomClick(room);
          this.props.handleCloseMap();
        }
      },
      onRoomEnter: (room) => {
        this.setState({highlighted: room});
      },
      onRoomLeave: () => {
        this.setState({highlighted: null});
      },
    };

    this.map = new MapVisualization(
        '#d3-map',
        width,
        height,
        padding,
        mouseEvents,
    );
    this.map.draw(this.rooms);
  }

  getGlobalStats() {
    const users = this.props.users;

    const numInHouse = _.sumBy(Object.keys(users), (room) => users[room].length);
    const numInHallways = (users.hallway || []).length;
    const numInBathrooms = _.sumBy(
        Object.keys(users).filter(
            (room) => room.endsWith('bathroom'),
        ),
        (room) => users[room].length,
    );
    const numInRooms = numInHouse - numInHallways - numInBathrooms;

    return (
      <div className="map-stats">
        <div className="map-stat-column">
          <span className="map-stat-emoji">🏚️</span>
          {numInHouse} in house
        </div>
        <div className="map-stat-column">
          <span className="map-stat-emoji">🎊</span>
          {numInRooms} partying
        </div>
        <div className="map-stat-column">
          <span className="map-stat-emoji">🚽</span>
          {numInBathrooms} taking bathroom break
        </div>
        <div className="map-stat-column">
          <span className="map-stat-emoji">🌓</span>
          {numInHallways} roaming
        </div>
      </div>
    );
  }

  render() {
    if (this.map) {
      this.map.update(this.props.users);
    }

    const roomId = this.state.highlighted;
    const room = (this.props.rooms || {})[roomId];
    // TODO not lock unvisited rooms for now; this can be a future feature
    const isVisited = true;
    // const isVisited = this.props.visited && this.props.visited[roomId]
    const currentRoomUsers = this.props.users[roomId] || [];

    return (
      <div className="map">
        <div className="map-header">
          {this.getGlobalStats()}
          <div className="map-header-tagline">Hover over rooms to see who's where!</div>
          <button className="map-close-button" onClick={this.props.handleCloseMap}>
            <FontAwesomeIcon icon={faTimes}/>
          </button>
        </div>
        <div className="map-area">
          <div id="d3-map"></div>
          <MapRoomInfo room={room} isVisited={isVisited} users={currentRoomUsers}></MapRoomInfo>
        </div>
      </div>
    );
  }
}

export default connect(
    (state) => state,
    {
      updateCurrentRoom: reducers.updateCurrentRoomActionCreator,
    })(Map);
