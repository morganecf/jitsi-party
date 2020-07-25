import React, { useState, useRef, useEffect } from 'react'
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

// Calculate the full width that can fit in the space, given the
// bounding box defined by (maxWidth, maxHeight) and the aspect ratio
// defined by (curWidth, curHeight)
function calculateFullWidth(maxWidth, maxHeight, curWidth, curHeight) {
    var ratio = curWidth / curHeight;
    var maxWidthFromHeight = maxHeight * ratio;
    return Math.floor(Math.min(maxWidth, maxWidthFromHeight));
}

export default props => {
    const [isShown, setIsShown] = useState(false)
    const [area, setArea] = useState({})

    // Get the width of the actual image file
    const [imgSize, setImgSize] = useState({})
    var img = new Image()
    img.onload = () =>
        setImgSize({"width":img.naturalWidth, "height":img.naturalHeight})
    img.src = props.imageMapOptions.img

    // Get the max width supported by the room
    const [maxWidth, setMaxWidth] = useState(0)
    const divRef = useRef(null)
    useEffect(() => {
        var newMaxWidth =
            calculateFullWidth(
                divRef.current.clientWidth,
                divRef.current.clientHeight,
                imgSize.width,
                imgSize.height)
        if (!isNaN(newMaxWidth) && newMaxWidth !== maxWidth) {
            setMaxWidth(newMaxWidth)
        }
    }, [divRef.current && divRef.current.clientWidth, imgSize.width])

    return (
        <div className="imagemap-room" ref={divRef}>
            <ImageMapper
                src={props.imageMapOptions.img}
                map={{"name":"img", "areas":formatAreas(props.imageMapOptions.areas)}}
                fillColor="rgba(255,255,255,0.25)"
                onClick={onDisplayModal(props.imageMapOptions.areas, setIsShown, setArea)}
                imgWidth={imgSize.width}
                width={maxWidth}
            />

            <Modal
                isOpen={isShown}
                onRequestClose={() => setIsShown(false)}>
                    <ImageMapContents area={area} handleClose={() => setIsShown(false)}></ImageMapContents>
            </Modal>
        </div>
    )
}
