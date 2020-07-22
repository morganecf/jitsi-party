import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

function getContentsHtml(contentsList) {
    return contentsList.map(c => 
        <b>{c.title}</b>
    )
}

export default props => {
    return (
        <div className="imagemap-modal">
            <div className="header">
                <b>{props.area.label}</b>
                <button onClick={props.handleClose}>
                    <FontAwesomeIcon icon={faTimes}/>
                </button>
            </div>
            <div className="contents">
                {getContentsHtml(props.area.contents)}
            </div>
        </div>
    )
}
