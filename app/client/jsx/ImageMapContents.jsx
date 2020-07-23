import React, { useState } from 'react'
import { PDFObject } from 'react-pdfobject'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faArrowLeft } from '@fortawesome/free-solid-svg-icons'

function getContentsHtml(contentsList, onClickFunc) {
    return contentsList.map((c,i) => 
        <div className="item" key={i} onClick={() => onClickFunc(c)}>{c.title}</div>
    )
}

function displayList(props, onClickFunc) {
    return (
        <div className="imagemap-modal">
            <div className="header">
                <b>{props.area.label}</b>
                <button onClick={props.handleClose}>
                    <FontAwesomeIcon icon={faTimes}/>
                </button>
            </div>
            <div className="contents">
                {getContentsHtml(props.area.contents, onClickFunc)}
            </div>
        </div>
    )
}

function onSelectItem(setItemIsShown, setItem) {
    return item => {
        setItem(item)
        setItemIsShown(true)
    }
}

function displayItem(props, item, returnFunc) {
    return (
        <div className="imagemap-modal">
            <div className="header">
                <button onClick={returnFunc}>
                    <FontAwesomeIcon icon={faArrowLeft}/>
                </button>
                <b>{item.title}</b>
                <button onClick={props.handleClose}>
                    <FontAwesomeIcon icon={faTimes}/>
                </button>
            </div>
            <div className="contents">
                <PDFObject url={item.path} />
            </div>
        </div>
    )
}

export default props => {
    const [itemIsShown, setItemIsShown] = useState(false)
    const [item, setItem] = useState({})
    if (!itemIsShown) {
        return displayList(props, onSelectItem(setItemIsShown, setItem))
    }
    return displayItem(props, item, () => setItemIsShown(false))
}
