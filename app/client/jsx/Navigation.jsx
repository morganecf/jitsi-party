import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp, faArrowDown, faArrowLeft, faArrowRight, faMap, faCalendar } from '@fortawesome/free-solid-svg-icons'
import Config from './Config.jsx'
import AudioPlayer from './AudioPlayer.jsx';
import reducers from './reducers.jsx'

class Navigation extends Component {
    constructor(props) {
        super(props)

        this.socketApi = this.props.socketApi
    }

    componentDidMount() {
        document.addEventListener("keydown", this.handleKeydown.bind(this));
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeydown.bind(this))
    }

    handleKeydown(e) {
        e = e || window.event;
        const onClick = this.props.onClick;
        const { north, south, east, west } = this.props.directions || {};
        switch(e.which || e.keyCode) {
            case 37:
                //left
                west && onClick(west);
                break;
            case 38:
                //up
                north && onClick(north);
                break;
            case 39:
                //right
                east && onClick(east);
                break;
            case 40:
                south && onClick(south);
                //down
                break;
        }
    }

    handleAudioChanged({ autoPlay }) {
        this.props.updateRoomAudio(this.props.currentRoom.room, autoPlay)
    }

    render() {
        const onClick = this.props.onClick
        const { north, south, east, west } = this.props.directions || {}
        const mapButtonClass = this.props.showMapTooltip ? "map-button animated" : "map-button"
        const room = this.props.currentRoom.room
        const audio = this.props.rooms[room].audio
        const events = this.props.events
        
        const handleClickMap = () => this.props.handleOpenModal('map')
        const handleClickEvents = () => this.props.handleOpenModal('events')

        return (
            <div className="navigation-container">
                <div className="column settings-container">
                    <div className="map-button-container">
                        {this.props.showMapButton &&
                            <button className={mapButtonClass} disabled={false} onClick={handleClickMap}>
                                <FontAwesomeIcon icon={faMap}/>
                            </button>
                        }
                        {this.props.showMapTooltip &&
                            <div className="map-tooltip">you have unlocked the party map!</div>
                        }
                    </div>
                    <div className="audio-button-container">
                        {audio &&
                            <AudioPlayer
                                src={audio.path}
                                autoPlay={audio.autoPlay}
                                hide={audio.hideControls}
                                onChange={this.handleAudioChanged.bind(this)}>
                            </AudioPlayer>
                        }
                    </div>
                    <div className="events-button-container">
                        {events && events.length > 0 &&
                            <button className="events-button" onClick={handleClickEvents}>
                                <FontAwesomeIcon icon={faCalendar}/>
                            </button>
                        }
                    </div>
                </div>
                <div className="column">
                    <button className="west" disabled={!west} onClick={() => onClick(west)}>
                        <FontAwesomeIcon icon={faArrowLeft}/>
                        <span className="navigation-room-name">{_.get(this.props.rooms[west], 'name')}</span>
                    </button>
                </div>
                <div className="column">
                    <button className="north" disabled={!north} onClick={() => onClick(north)}>
                        <FontAwesomeIcon icon={faArrowUp}/>
                        <span className="navigation-room-name">{_.get(this.props.rooms[north], 'name')}</span>
                    </button>
                    <button className="south" disabled={!south} onClick={() => onClick(south)}>
                        <FontAwesomeIcon icon={faArrowDown}/>
                        <span className="navigation-room-name">{_.get(this.props.rooms[south], 'name')}</span>
                    </button>
                </div>
                <div className="column">
                    <button className="east" disabled={!east} onClick={() => onClick(east)}>
                        <FontAwesomeIcon icon={faArrowRight}/>
                        <span className="navigation-room-name">{_.get(this.props.rooms[east], 'name')}</span>
                    </button>
                </div>
                <div className="column column-avatar">
                    <div className="puck-wrapper">
                      <img src={Config.avatars[this.props.user.avatar.type][this.props.user.avatar.color]}/>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(state => state, {
    updateRoomAudio: reducers.updateRoomAudioActionCreator
})(Navigation)
