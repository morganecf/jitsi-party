import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp, faArrowDown, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'

export default class Navigation extends Component { 
    constructor(props) {
        super(props)
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

    render() {
        const onClick = this.props.onClick
        const { north, south, east, west } = this.props.directions || {}
        return (
            <div className="navigation-container">
                <div className="column">
                    <button className="west" disabled={!west} onClick={() => onClick(west)}>
                        <FontAwesomeIcon icon={faArrowLeft}/>
                        <span className="navigation-room-name">{west}</span>
                    </button>
                </div>
                <div className="column">
                    <button className="north" disabled={!north} onClick={() => onClick(north)}>
                        <FontAwesomeIcon icon={faArrowUp}/>
                        <span className="navigation-room-name">{north}</span>
                    </button>
                    <button className="south" disabled={!south} onClick={() => onClick(south)}>
                        <FontAwesomeIcon icon={faArrowDown}/>
                        <span className="navigation-room-name">{south}</span>
                    </button>
                </div>
                <div className="column">
                    <button className="east" disabled={!east} onClick={() => onClick(east)}>
                        <FontAwesomeIcon icon={faArrowRight}/>
                        <span className="navigation-room-name">{east}</span>
                    </button>
                </div>
                <div className="column">
                    <img id="navigation-puck" src="https://fcbk.su/_data/stickers/ninja_bear/ninja_bear_09.png"/>
                </div>
            </div>
        )
    }
}
