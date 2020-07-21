import React, { Component } from 'react'
import { connect } from 'react-redux'
import reducers from './reducers.jsx'
import { Redirect } from 'react-router-dom'
import { Beforeunload } from 'react-beforeunload';
import Modal from 'react-modal';
import JitsiVideo from './JitsiVideo.jsx'
import ArtRoom from './ArtRoom.jsx'
import IFrameRoom from './IFrameRoom.jsx'
import Map from './Map.jsx'
import EventList from './EventList.jsx'
import Door from './Door.jsx'
import Adventure from './Adventure.jsx'
import Navigation from './Navigation.jsx'
import { PokeNotification } from './Poke.jsx'
import { WebSocketApi } from './WebAPI.jsx'
import LocalStorage from './LocalStorage.jsx'
import Config from './Config.jsx'

class Room extends Component {
    /*
    * A room has the following:
    *   1. Name of room
    *   2. Optional description
    *   3. Content (video, art, text, etc)
    *   4. Navigation component used to move through rooms
    *   5. Optional artifact, i.e. something the user finds or unlocks, like a map
    * Add new rooms to rooms.json, where individual rooms are defined. Add new TYPES of rooms
    * by creating a new component for that room and updating the getRoomType() mapping.
    */
    constructor(props) {
        super(props)

        this.useLocalSessions = Config.useLocalSessions || false

        // These are the room types for which we show the map button
        this.roomTypesWithMap = {
            jitsi: true,
            iframe: true,
            content: true
        }

        // These are the room types which require doors
        this.roomTypesWithDoors = {
            jitsi: true,
            iframe: true
        }

        this.state = {
            room: this.props.currentRoom.room,
            entered: false,
            users: []
        }

        this.socketApi = new WebSocketApi()
        this.socketApi.startPinging(this.props.user.id)
        this.socketApi.on('user-event', this.props.updateUsers.bind(this))
        this.socketApi.on(`poke-${this.props.user.id}`, this.handlePoke.bind(this))
        
        this.computePokeUnlockedState()
    }

    getRoomData() {
        return this.props.rooms[this.state.room]
    }

    getRoomContent() {
        /*
        * There are currently 3 different types of rooms:
        *   1. Regular Jitsi room that just has video
        *   2. Art room which has a small video panel and an image
        *   3. Text-based adventure rooms where you have to make a decision
        *   4. Library room to display an organized set of PDFs
        *   5. Special purpose rooms that exist at a different route
        */
        const roomData = this.getRoomData()
        const jitsiData = {
            displayName: this.props.user.username,
            avatar: this.props.user.avatar,
            roomName: this.state.room,
            muteRoom: roomData.muteRoom,
        }
        return {
            art: <ArtRoom jitsiData={jitsiData} art={roomData.art}></ArtRoom>,
            jitsi: <JitsiVideo jitsiData={jitsiData}></JitsiVideo>,
            iframe: <IFrameRoom jitsiData={jitsiData} iframeOptions={roomData.iframeOptions}></IFrameRoom>,
            adventure: <Adventure options={roomData} onClick={this.onAdventureClick.bind(this)}></Adventure>,
            library: <Library libOptions={roomData.libOptions}></Library>
        }[roomData.type]
    }

    getRoomDescription() {
        if (this.props.rooms[this.state.room].description) {
            return (
                <div className="room-content">
                    {this.props.rooms[this.state.room].description}
                </div>
            )
        }
    }

    setBackground() {
        const roomData = this.getRoomData()
        if (roomData.backgroundImage) {
            document.querySelector('.room').style.backgroundImage = `url(${roomData.backgroundImage})`
        } else {
            this.clearBackground()
        }
    }

    clearBackground() {
        if (document.querySelector('.room')) {
            document.querySelector('.room').style.backgroundImage = ""
        }
    }

    onAdventureClick(room) {
        this.setState({ room, entered: true })
        this.socketApi.enterRoom(this.props.user, room)
    }

    updateRoom(room) {
        // Leave current room
        this.clearBackground()
        this.socketApi.leaveRoom(this.props.user, this.state.room)

        // Go to new room, but don't open the door for rooms that have doors
        const entered = !this.roomTypesWithDoors[this.props.rooms[room].type]
        this.setState({ room, entered })
        this.props.updateCurrentRoom({ room, entered })

        // reset door anim
        const door = document.getElementById('door')
        if (door) {
            door.style.webkitAnimation = "none";
            setTimeout(() => { door.style.webkitAnimation = "" })
        }
    }

    onSwitchRoom(room) {
        if (window.api) {
            window.api.executeCommand('hangup')
            window.api = null
            setTimeout(this.updateRoom.bind(this, room), 500)
        } else {
            this.updateRoom(room)
            document.activeElement.blur()
        }
    }

    onEnterRoom() {
        // Open the door
        this.setBackground()
        this.setState({ entered: true })
        this.props.updateCurrentRoom({
            room: this.state.room,
            entered: true
        })
        this.socketApi.enterRoom(this.props.user, this.state.room)
    }

    handleBeforeUnload() {
        // Update server if user closes tab or refreshes
        this.socketApi.leaveRoom(this.props.user, this.state.room)
    }

    handleOpenMap() {
        this.setState({ showMap: true })
    }

    handleCloseMap() {
        this.setState({ showMap: false })
    }

    handleOpenEvents() {
        this.setState({ showEvents: true })
    }

    handleCloseEvents() {
        this.setState({ showEvents: false })
    }

    computeMapState(room) {
        const mapAlreadyUnlocked = LocalStorage.get("MAP_UNLOCKED")
        const mapUnlockThreshold = parseInt(Config.mapUnlockThreshold)
        const visitedRooms = Object.values(this.props.visited).filter(x => x).length
        const isMapUnlocked =
            Config.debug ||
            mapAlreadyUnlocked ||
            (_.has(this.roomTypesWithMap, room.type) && (visitedRooms >= mapUnlockThreshold))
        const showMapTooltip = !mapAlreadyUnlocked && isMapUnlocked
        LocalStorage.set("MAP_UNLOCKED", isMapUnlocked)
        return {
            mapVisible: isMapUnlocked,
            showMapTooltip: showMapTooltip
        }
    }

    computePokeUnlockedState() {
        if (Config.poke) {
            if (this.useLocalSessions && LocalStorage.get('POKE_UNLOCKED')) {
                this.props.unlockPoking()
            } else {
                const timeout = parseFloat(Config.poke.unlockAfterMinutes) * 60 * 1000
                setTimeout(() => {
                    this.props.unlockPoking()
                    LocalStorage.set('POKE_UNLOCKED', true)
                }, timeout)
            }
        }
    }

    handlePoke(pokeData) {
        this.setState({ pokeData })
        setTimeout(() => {
            this.setState({ pokeData: null })
        }, 5000)
    }

    render() {
        if (Object.keys(this.props.rooms).length === 0) {
            // room config not loaded yet
            return null
        }

        this.useLocalSessions && LocalStorage.touch("USER") // keep session alive

        const room = this.props.rooms[this.state.room]

        if (room.type === 'redirect') {
            this.socketApi.enterRoom(this.props.user, this.state.room)
            return <Redirect to={room.route} />
        }

        const userList = this.props.users[this.state.room] || []
        const content = this.state.entered ?
            this.getRoomContent() :
            <Door room={room} users={userList} tintColor={room.doorTint} onClick={this.onEnterRoom.bind(this)}></Door>

        const roomClass = this.state.entered ? "room entered" : "room"
        const mapState = this.computeMapState(room)

        // Allows modal to have access to react components and state
        Modal.setAppElement('.app')

        return (
            <div className={roomClass}>
                <div className="room-header">
                    <h2 className="room-header">{room.name}</h2>
                </div>
                {content}
                {this.getRoomDescription()}
                <Navigation
                    directions={room.directions}
                    onClick={this.onSwitchRoom.bind(this)}
                    showMapButton={mapState.mapVisible}
                    showMapTooltip={mapState.showMapTooltip}
                    hideSettings={room.type === 'adventure'}
                    handleOpenMap={this.handleOpenMap.bind(this)}
                    handleOpenEvents={this.handleOpenEvents.bind(this)}></Navigation>
                <Beforeunload onBeforeunload={this.handleBeforeUnload.bind(this)} />
                <Modal
                    isOpen={this.state.showMap}
                    onAfterOpen={this.handleOpenMap.bind(this)}
                    onRequestClose={this.handleCloseMap.bind(this)}>
                        <Map onRoomClick={this.onSwitchRoom.bind(this)} handleCloseMap={this.handleCloseMap.bind(this)}></Map>
                </Modal>
                <Modal
                    isOpen={this.state.showEvents}
                    onRequestClose={this.handleCloseEvents.bind(this)}
                    className="event-modal">
                        <EventList rooms={this.props.rooms} events={this.props.events}></EventList>
                </Modal>
                {!!this.state.pokeData && <PokeNotification {...this.state.pokeData} />}
            </div>
        )
    }
}

export default connect(state => state, {
    updateUsers: reducers.updateUsersActionCreator,
    updateCurrentRoom: reducers.updateCurrentRoomActionCreator,
    unlockPoking: reducers.unlockPokingActionCreator 
})(Room)
