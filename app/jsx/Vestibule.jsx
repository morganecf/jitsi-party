import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import reducers from './reducers.jsx'
import Room from './Room.jsx'
import { Link } from 'react-router-dom'

class Vestibule extends Component { 
    constructor(props) {
        super(props)
        this.state = {
            displayName: this.props.displayName,
            avatar: this.props.vatar,
            isReady: !!(this.props.displayName)
        }
    }

    handleDisplayNameChange(event) {
        this.setState({ displayName: event.target.value })
        this.props.updateDisplayName(event.target.value)
    }

    handleReady() {
        this.setState({ isReady: true })
    }

    getContent() {
        if (this.state.isReady) {
            return <Room roomName='Clarendon Vestibule' displayName={this.state.displayName}></Room>
        }
        return (
            <div className="display-name">
                <input type="text" name="name" onChange={this.handleDisplayNameChange.bind(this)}/>
                <input type="button" onClick={this.handleReady.bind(this)} value="Go!"/>
            </div>
        )
    }

    render() {
        return (
            <div className="vestibule">
                <Link to="/about" activeclassname="active">About</Link>
                {this.getContent()}
            </div>
        )
    }
}

export default connect(state => state, { updateDisplayName: reducers.updateDisplayNameActionCreator })(Vestibule)
