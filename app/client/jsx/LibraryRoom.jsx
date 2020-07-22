import React, { Component } from 'react'

class LibraryRoom extends Component {

    getAreasHtml() {
        return this.props.libOptions.areas.map((a,i) =>
            <area
                key={i}
                className="library-topic"
                shape={a.shape}
                coords={a.coords}
                alt={a.category}
                title={a.category}
                // This is just a dummy onClick, to show interaction with the area
                onClick={() => console.log(a.category)}
            />
        );
    }

    render() {
        return (
            <div className="library-room">
                <img src={this.props.libOptions.img} useMap="#libmap" />

                <map name="libmap">
                    {this.getAreasHtml()}
                </map>
            </div>
        )
    }
}

export default LibraryRoom;
