import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import reducers from './reducers.jsx'

class Vestibule extends Component { 
    constructor(props) {
        super(props)
        this.roomNames = [
            'matt',
            'daniel',
            'morg',
            'sean',
            'andrew'
        ]
        this.state = {

        }

        console.log('jitsi api:', window.JitsiMeetExternalAPI)
    }

    async componentDidMount() {
        // Example usage of redux
        this.props.updateState('test')
    }

    render() {
        return (
            <ul className="room-list">
                {this.roomNames.map((name, index) => {
                    return (
                        <li key={index.toString()}>
                            <a href={`https://meet.jit.si/${name}`}>{name}</a>
                        </li>
                    )
                })}
            </ul>
        )
    }
}

// Example usage of redux
export default connect(state => state, { updateState: reducers.exampleActionCreator })(Vestibule)
