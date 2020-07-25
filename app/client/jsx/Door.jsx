import _ from 'lodash'
import React, { Component } from 'react'
import UserList from './UserList.jsx';


const CapacitySticker = ({ capacity }) => {
    if (!capacity) {
        return null
    }
    return (
        <div className="capacity-sticker">
            Fits {capacity}
        </div>
    )
}


class Door extends Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        const userStr = this.props.users.length > 1 ?
            `${this.props.users.length} people are in this room!` :
            '1 person is in this room!'
        const isPrivate = _.has(this.props.room, 'capacity')
        const isLocked = this.props.room.locked
        const users = this.props.users.length ?
            (
                <div className="user-list">
                    <div>{userStr}</div>
                    <UserList users={this.props.users} truncate={true} anonymize={isPrivate}></UserList>
                </div>
            ) :
            null

        const tintStyle = this.props.tintColor ? { background: this.props.tintColor } : {}
        const isAtCapacity = this.props.room.capacity && this.props.users.length >= this.props.room.capacity
        const buttonText = isAtCapacity ? 'Room is full' : `Enter ${this.props.room.name}`

        return (
            <div className="door-wrapper">
                <div className="door-background"></div>
                <div className="door-target">
                    <div className="door-info">
                        {users}
                        <button disabled={isAtCapacity || isLocked} onClick={this.props.onClick.bind(this)}>{buttonText}</button>
                        <CapacitySticker capacity={this.props.room.capacity} />
                    </div>
                </div>
                <div id="door" className={isLocked ? "door locked-door" : "door unlocked-door"}>
                    <div className="tint" style={tintStyle}></div>
                    <div className="knob"></div>
                    <div className="spacer"></div>
                    <div className="panel-column">
                        <div className="panel top-panel"></div>
                        <div className="panel"></div>
                        <div className="panel"></div>
                    </div>
                    <div className="spacer"></div>
                    <div className="panel-column">
                        <div className="panel top-panel"></div>
                        <div className="panel"></div>
                        <div className="panel"></div>
                    </div>
                    <div className="spacer"></div>
                </div>
            </div>
        )
    }
}

export default Door;
