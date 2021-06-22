import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import Config from './Config.jsx'
import AudioPlayer from './AudioPlayer.jsx'
import { PokeOptions } from './Poke.jsx'
import reducers from './reducers.jsx'
import { WebSocketApi } from './WebAPI.jsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faArrowUp,
    faArrowDown,
    faArrowLeft,
    faArrowRight,
    faMap,
    faCalendar,
    faEnvelope,
    faCommentAlt
} from '@fortawesome/free-solid-svg-icons'

class Navigation extends Component {
    constructor(props) {
        super(props)

        this.state = {
            showPokeOptions: false,
            hideChat: false
        }

        this.socketApi = new WebSocketApi()
    }

    componentDidMount() {
        document.addEventListener("keydown", this.handleKeydown.bind(this));
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeydown.bind(this))
    }

    componentDidUpdate() {
        const chatbox = document.querySelector('#conversejs')

        if(chatbox) {
            if(this.state.hideChat) {
                chatbox.style.visibility = "hidden";
                chatbox.style.opacity = 0;
                chatbox.style.transition = "visibility 0s linear 1s, opacity 1s";
            } else {
                chatbox.style.visibility = "visible";
                chatbox.style.opacity = 1;
                chatbox.style.transition = "visibility 0s linear 0s, opacity 1s";
            }
        }
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

    handlePoke(user) {
        this.setState({ showPokeOptions: false })
        this.socketApi.poke({
            to: user,
            from: this.props.user
        })
    }

    handleClickPokeButton() {
        this.setState({ showPokeOptions: !this.state.showPokeOptions })
    }

    render() {
        const onClick = this.props.onClick
        const { north, south, east, west } = this.props.directions || {}
        
        const mapButtonClass = this.props.showMapTooltip ? 'map-button animated' : 'map-button'
        const pokeButtonClass = this.state.showPokeOptions ? 'poke-button focused' : 'poke-button'

        const room = this.props.currentRoom.room
        const audio = this.props.rooms[room].audio
        const roomType = this.props.rooms[room].type
        const events = this.props.events
        const users = _.flatten(Object.values(this.props.users))

        const handleClickMap = () => this.props.handleOpenModal('map')
        const handleClickEvents = () => this.props.handleOpenModal('events')
        const handleClickEmail = () => this.props.handleOpenModal('email')

        console.dir(this.props)

        return (
            <div className="navigation-container">
                <div className="column settings-container">                    
                    <div className="map-button-container">
                        {this.props.showMapButton && !this.props.hideSettings &&
                            <button className={mapButtonClass} title={Config.tooltips.map} disabled={false} onClick={handleClickMap}>
                                <FontAwesomeIcon icon={faMap}/>
                            </button>
                        }
                        {/* {this.props.showMapTooltip &&
                            <div className="map-tooltip">you have unlocked the party map!</div>
                        } */}
                    </div>
                    <div className="events-button-container">
                        {events && events.length > 0 && !this.props.hideSettings &&
                            <button className="events-button" title={Config.tooltips.events} onClick={handleClickEvents}>
                                <FontAwesomeIcon icon={faCalendar}/>
                            </button>
                        }
                    </div>
                    <div className="email-button-container">
                        {Config.moderation && !_.isEmpty(Config.moderation.moderatorEmails) &&
                            <button className="email-button" title={Config.tooltips.moderator} onClick={handleClickEmail}>
                                <FontAwesomeIcon icon={faEnvelope}/>
                            </button>
                        }
                    </div>
                    {roomType.toUpperCase() === 'CHATSTREAM' && this.props.currentRoom.entered && !this.props.hideSettings ? (
                        <div className="chat-button-container">
                            <button 
                                className={mapButtonClass} 
                                title={Config.tooltips.chat} 
                                disabled={false} 
                                onClick={() => this.setState({hideChat: !this.state.hideChat})}>
                                    <FontAwesomeIcon icon={faCommentAlt}/>
                            </button>
                        </div>  
                    ) : null}                      
                    <div className="poke-button-container">
                        {Config.poke && this.props.isPokingUnlocked && !this.props.hideSettings &&
                            <button className={pokeButtonClass} title={Config.tooltips.poke} onClick={this.handleClickPokeButton.bind(this)}>
                                <FontAwesomeIcon icon={Config.poke.fontAwesomeIcon} />
                            </button>
                        }
                        {this.state.showPokeOptions && <PokeOptions users={users} handlePoke={this.handlePoke.bind(this)} />}
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
                      <img src={Config.avatars[this.props.user.avatar.type].images[this.props.user.avatar.color]}/>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(state => state, {
    updateRoomAudio: reducers.updateRoomAudioActionCreator
})(Navigation)
