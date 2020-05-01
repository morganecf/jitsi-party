import React, { Component } from 'react'

class Door extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const userStr = this.props.users.length > 1 ?
            `${props.users.length} people are in this room!` :
            '1 person is in this room!'
        const users = this.props.users.length ?
            (
                <div className="user-list">
                    <div>{userStr} Join them :)</div>
                    {this.props.users.map(user => (
                        <div className="user-list-item">{user.username}</div>
                    ))}
                </div>
            ) :
            <div>No one is in this room :(</div>


        return (
            <div className="door-wrapper">
                <div className="door-background"></div>
                <div className="door-target">
                    {users}
                    <button onClick={this.props.onClick.bind(this)}>Enter {this.props.room}</button>
                </div>
                <div id="door" className="door">
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
