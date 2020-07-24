import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import reducers from './reducers.jsx'
import { HttpApi } from './WebAPI.jsx'
import Config from './Config.jsx'
import Login from './Login.jsx'
import CustomAuthWrapper from './CustomAuthWrapper.jsx'


class Welcome extends Component {
    constructor(props) {
        super(props)
        this.httpApi = new HttpApi()
        this.state = {
            authenticated: false
        }
    }

    componentDidMount() {
        this.fetchConfig()
    }

    async fetchConfig() {
        const { success, config } = await this.httpApi.getConfig()
        if (success) {
            this.props.addConfig(config)
            this.loadAssets(config)
        }
    }

    loadAssets({ rooms, events }) {
        _.forEach(events, event => {
            if (event.image) {
                const img = new Image()
                img.src = event.image
            }
        })
        _.forEach(rooms, room => {
            if (room.backgroundImage) {
                const img = new Image()
                img.src = room.backgroundImage
            }
            if (room.art && room.art.src) {
                const img = new Image()
                img.src = room.art.src
            }
        })
        _.forEach(Config.avatars, avatarGroup => {
            _.forEach(Object.values(avatarGroup), avatar => {
                const img = new Image()
                img.src = avatar
            })
        })
    }

    onAuthentication() {
        this.setState({ authenticated: true })
    }

    render() {
        const config = Config.welcomePage
        const splash = config.backgroundImagePath
            ? <img className="splash" src={config.backgroundImagePath}/>
            : null

        const login = !_.isEmpty(config.auth) && !this.state.authenticated ?
            <CustomAuthWrapper options={config.auth} onAuthentication={this.onAuthentication.bind(this)} /> :
            <Login/>

        return (
            <div className="vestibule">
                <div className="header" dangerouslySetInnerHTML={{ __html: config.headerHtml }} />
                {splash}
                {login}
            </div>
        )
    }
}

export default connect(
    state => state,
    {
        addConfig: reducers.addConfigActionCreator,
     })(Welcome)
