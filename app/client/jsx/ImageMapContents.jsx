import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

export default props => {
    return (
        <div className="imagemap-contents">
            <div className="imagemap-header">
                <b>{props.contentsLabel}</b>
                <button className="contents-close-button" onClick={props.handleClose}>
                    <FontAwesomeIcon icon={faTimes}/>
                </button>
            </div>
        </div>
    )
}
