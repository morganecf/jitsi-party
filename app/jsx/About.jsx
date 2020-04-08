import React, { Component } from 'react';
import { Link } from 'react-router-dom'

export default class About extends Component {
    render() {
        return (
            <div>
                <h3>About</h3>
                <div>Some content</div>
                <div className="footer-area">
                    <Link to="/" activeclassname="active">Back</Link>
                </div>
            </div>
        )
    }
}
