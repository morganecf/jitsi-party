import _ from 'lodash'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp, faArrowDown, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { Avatars } from './avatars.jsx'

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

    getMapLink() {
        if (this.props.showMap) {
            return (
                <div className="column">
                    <Link to="/map">Map</Link>
                </div>
            )
        }
    }

    render() {
        const onClick = this.props.onClick
        const { north, south, east, west } = this.props.directions || {}
        return (
            <div className="navigation-container">
                {this.getMapLink()}
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
                      <img src={Avatars[this.props.user.avatar[0]][this.props.user.avatar[1]]}/>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(state => state, {})(Navigation)
