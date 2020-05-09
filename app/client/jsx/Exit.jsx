import React, { Component } from 'react'
import { connect } from 'react-redux'
import { SpecialAvatars } from './avatars.jsx'

class Exit extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="exit">
                <h1>Goodbye!</h1>
                <img src={SpecialAvatars.thumb[this.props.user.avatar.color]}/>
            </div>
        )
    }
}

export default connect(state => state, {})(Exit)

