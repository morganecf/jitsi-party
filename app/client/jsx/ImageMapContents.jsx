import React, { useState, useEffect } from 'react'
import { PDFObject } from 'react-pdfobject'
import { ReactAudio } from 'reactjs-media'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faArrowLeft } from '@fortawesome/free-solid-svg-icons'

/**
 * Wrapper component for handling various content displays.
 * 
 * @param {*} props 
 * @returns 
 */
 const ContentWrapper = ({ label, handleClose, children }) => (
    <div className="imagemap-modal">
        <div className="header">
            <b>{label}</b>
            <button onClick={handleClose}>
                <FontAwesomeIcon icon={faTimes}/>
            </button>
        </div>
        <div className="contents">
            {children}
        </div>
    </div>
)

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

    if (props.area.contents.length === 1) {
        const {type, path} = props.area.contents[0]

        switch (type) {
            case "MP3":
                return (
                    <ContentWrapper label={props.area.label} handleClose={props.handleClose}>
                        <ReactAudio src={path} autoPlay />
                    </ContentWrapper>
                )
            case "HTML":
                window.open(path, "_blank");
                props.handleClose();
                return null;
            default:
                return null;
        }
    }

    if (!itemIsShown) {
        return displayList(props, onSelectItem(setItemIsShown, setItem))
    }

    return displayItem(props, item, () => setItemIsShown(false))
}
