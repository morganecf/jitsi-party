import React, { Component } from 'react'

class ImageMapRoom extends Component {

    getAreasHtml() {
        return this.props.imageMapOptions.areas.map((a,i) =>
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

    render() {
        return (
            <div className="imagemap-room">
                <img src={this.props.imageMapOptions.img} useMap="#imgmap" />

                <map name="imgmap">
                    {this.getAreasHtml()}
                </map>
            </div>
        )
    }
}

export default ImageMapRoom;
