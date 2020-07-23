import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

function getContentsHtml(contentsList, onClickFunc) {
    return contentsList.map((c,i) => 
        <div className="item" key={i} onClick={onClickFunc(c)}>{c.title}</div>
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
                {getContentsHtml(props.area.contents, () => console.log(c.path))}
            </div>
        </div>
    )
}
