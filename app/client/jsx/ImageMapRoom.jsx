import React, { useState } from 'react'
import Modal from 'react-modal'
import ImageMapContents from './ImageMapContents.jsx'

function getAreasHtml(areasList, onClickFunc) {
    return areasList.map((a,i) =>
        <area
            key={i}
            className="imagemap-area"
            shape={a.shape}
            coords={a.coords}
            alt={a.label}
            title={a.label}
            // This is just a dummy onClick, to show interaction with the area
            onClick={() => onClickFunc(a.label)}
        />
    );
}

export default props => {
    const [dir, setDir] = useState("")
    return (
        <div className="imagemap-room">
            <img src={props.imageMapOptions.img} useMap="#imgmap" />

            <map name="imgmap">
                {getAreasHtml(props.imageMapOptions.areas, setDir)}
            </map>

            <Modal
                isOpen={dir !== ""}
                onRequestClose={() => setDir("")}>
                    <ImageMapContents contentsLabel={dir} handleClose={() => setDir("")}></ImageMapContents>
            </Modal>
        </div>
    )
}
