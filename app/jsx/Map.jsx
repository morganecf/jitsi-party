import React, { Component } from 'react'
import { connect } from 'react-redux'
import reducers from './reducers.jsx'

class Map extends Component { 
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    async componentDidMount() {
        
    }

    render() {
        return (
            <h1>MAP</h1>
        )
    }
}

export default connect(state => state, { updateState: reducers.exampleActionCreator })(Map)
