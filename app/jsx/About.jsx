import React, { Component } from 'react';
import { Link } from 'react-router-dom'

export default class About extends Component {
    render() {
        return (
            <div className="about">
                <h3>About us?!</h3>
                <p>We are a team that communicates with hearts, and has seen each other naked.</p>
                <div className="footer-area">
                    <Link to="/" activeclassname="active">Back</Link>
                </div>
            </div>
        )
    }
}
