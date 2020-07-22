import React, { Component } from 'react'

class LibraryRoom extends Component {

    getAreasHtml() {
        return this.props.libOptions.areas.map((a,i) =>
            <area key={i} className="library-topic" shape={a.shape} coords={a.coords} alt={a.category} onClick={console.log(a.category)} />
        );
    }

    render() {
        return (
            <div className="library-room">
                <div className="library-map">
                    <img src={this.props.libOptions.img} useMap="#libmap" />

                    <map name="libmap">
                        {this.getAreasHtml()}
                    </map>
                </div>
            </div>
        )
    }
}

export default LibraryRoom;