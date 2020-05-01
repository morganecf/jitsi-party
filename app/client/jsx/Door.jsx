import React, { Component } from 'react'

class Door extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isHovered: false,
            isDoorClicked: false,
        };
        this.handleHover = this.handleHover.bind(this);
    }

    handleHover() {
        this.setState({
            isButtonHovered: !this.state.isButtonHovered
        });
    }

    handleDoorClick() {
        this.setState({
            isDoorClicked: !this.state.isDoorClicked
        });
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

        const doorClass = this.state.isButtonHovered || this.state.isDoorClicked ? "door open" : "door"

        return (
            <div className="door-wrapper">
                <div className="door-background"></div>
                <div onClick={this.handleDoorClick.bind(this)} className="door-target">
                    {users}
                    <button onMouseEnter={this.handleHover} onMouseLeave={this.handleHover} onClick={this.props.onClick.bind(this)}>Enter {this.props.room}</button>
                </div>
                <div className={doorClass}>
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
