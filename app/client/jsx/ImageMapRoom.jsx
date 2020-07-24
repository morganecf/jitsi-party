import React, { useState } from 'react'
import Modal from 'react-modal'
import ImageMapper from 'react-image-mapper'
import ImageMapContents from './ImageMapContents.jsx'

function formatAreas(areasList) {
    return areasList.map(a =>
        ({
            "shape": a.shape,
            "coords": a.coords.split(",")
        })
    );
}

function onDisplayModal(areasList, setIsShown, setArea) {
    return (area,index,event) => {
        setArea(areasList[index])
        setIsShown(true)
    }
}

export default props => {
    const [isShown, setIsShown] = useState(false)
    const [area, setArea] = useState({})
    return (
        <div className="imagemap-room">
            <ImageMapper
                src={props.imageMapOptions.img}
                map={{"name":"img", "areas":formatAreas(props.imageMapOptions.areas)}}
                fillColor="rgba(255,255,255,0.25)"
                onClick={onDisplayModal(props.imageMapOptions.areas, setIsShown, setArea)}
            />

            <Modal
                isOpen={isShown}
                onRequestClose={() => setIsShown(false)}>
                    <ImageMapContents area={area} handleClose={() => setIsShown(false)}></ImageMapContents>
            </Modal>
        </div>
    )
}
