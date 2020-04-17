import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp, faArrowDown, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'

export default class Navigation extends Component { 
    constructor(props) {
        super(props)
    }

    render() {
        const onClick = this.props.onClick
        const { north, south, east, west } = this.props.directions
        return (
            <div className="navigation-container">
                <div className="top-row">
                    <button className="north" disabled={!north} onClick={() => onClick(north)}>
                        <FontAwesomeIcon icon={faArrowUp}/>
                        <span className="navigation-room-name">{north}</span>
                    </button>
                </div>
                <div className="middle-row">
                    <button className="west" disabled={!west} onClick={() => onClick(west)}>
                        <FontAwesomeIcon icon={faArrowLeft}/>
                        <span className="navigation-room-name">{west}</span>
                    </button>
                    <button className="east" disabled={!east} onClick={() => onClick(east)}>
                        <FontAwesomeIcon icon={faArrowRight}/>
                        <span className="navigation-room-name">{east}</span>
                    </button>
                </div>
                <div className="bottom-row">
                    <button className="south" disabled={!south} onClick={() => onClick(south)}>
                        <FontAwesomeIcon icon={faArrowDown}/>
                        <span className="navigation-room-name">{south}</span>
                    </button>
                </div>
            </div>
        )
    }
}
