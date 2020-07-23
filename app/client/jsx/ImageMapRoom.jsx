import React, { useState } from 'react'
import Modal from 'react-modal'
import ImageMapContents from './ImageMapContents.jsx'

function getAreasHtml(areasList, onClickFunc) {
    return areasList.map((a,i) =>
        <area
            key={i}
            shape={a.shape}
            coords={a.coords}
            alt={a.label}
            title={a.label}
            // This is just a dummy onClick, to show interaction with the area
            onClick={() => onClickFunc(a)}
        />
    );
}

function onDisplayModal(setIsShown, setArea) {
    return area => {
        setArea(area)
        setIsShown(true)
    }
}

export default props => {
    const [isShown, setIsShown] = useState(false)
    const [area, setArea] = useState({})
    return (
        <div className="imagemap-room">
            <img src={props.imageMapOptions.img} useMap="#imgmap" />

            <map name="imgmap">
                {getAreasHtml(props.imageMapOptions.areas, onDisplayModal(setIsShown, setArea))}
            </map>

            <Modal isOpen={isShown}>
                    <ImageMapContents area={area} handleClose={() => setIsShown(false)}></ImageMapContents>
            </Modal>
        </div>
    )
}
