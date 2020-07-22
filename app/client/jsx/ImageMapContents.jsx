import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

export default props => {
    return (
        <div className="imagemap-modal">
            <div className="header">
                <b>{props.contentsLabel}</b>
                <button onClick={props.handleClose}>
                    <FontAwesomeIcon icon={faTimes}/>
                </button>
            </div>
            <div className="contents">
                <b>Random Text</b>
            </div>
        </div>
    )
}
