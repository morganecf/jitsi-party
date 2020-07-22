import React from 'react'

function getAreasHtml(areasList) {
    return areasList.map((a,i) =>
        <area
            key={i}
            className="imagemap-area"
            shape={a.shape}
            coords={a.coords}
            alt={a.label}
            title={a.label}
            // This is just a dummy onClick, to show interaction with the area
            onClick={() => console.log(a.label)}
        />
    );
}

export default props => {
    return (
        <div className="imagemap-room">
            <img src={props.imageMapOptions.img} useMap="#imgmap" />

            <map name="imgmap">
                {getAreasHtml(props.imageMapOptions.areas)}
            </map>
        </div>
    )
}
