import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp, faArrowDown, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'

export default class Navigation extends Component { 
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="navigation-container">
                <div className="top-row">
                    <button className="north" disabled={!this.props.directions.north}>
                        <FontAwesomeIcon icon={faArrowUp}/>
                        <span className="navigation-room-name">{this.props.directions.north}</span>
                    </button>
                </div>
                <div className="middle-row">
                    <button className="west" disabled={!this.props.directions.west}>
                        <FontAwesomeIcon icon={faArrowLeft}/>
                        <span className="navigation-room-name">{this.props.directions.west}</span>
                    </button>
                    <button className="east" disabled={!this.props.directions.east}>
                        <FontAwesomeIcon icon={faArrowRight}/>
                        <span className="navigation-room-name">{this.props.directions.east}</span>
                    </button>
                </div>
                <div className="bottom-row">
                    <button className="south" disabled={!this.props.directions.south}>
                        <FontAwesomeIcon icon={faArrowDown}/>
                        <span className="navigation-room-name">{this.props.directions.south}</span>
                    </button>
                </div>
            </div>
        )
    }
}
