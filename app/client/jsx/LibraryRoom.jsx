import React, { Component } from 'react'

class LibraryRoom extends Component {

    getAreasHtml() {
        return this.props.libOptions.areas.map(a =>
            <area shape=a.shape coords=a.coords alt=a.label>
        )
    }

    render() {
        return (
        <div className="library-room">
            <div className="library-map">
                <img src={this.props.libOptions.img} usemap="#libmap">

                <map name="libmap">
                    {this.getAreasHtml()}
                </map>
            </div>
        </div>
    )
    }
}