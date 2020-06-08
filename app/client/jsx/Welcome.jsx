import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import reducers from './reducers.jsx'
import { Redirect } from 'react-router-dom'
import PuckSelect from './PuckSelect.jsx'
import { HttpApi } from './WebAPI.jsx'
import LocalStorage from './LocalStorage.jsx'
import Config from './Config.jsx'

class Welcome extends Component {
    constructor(props) {
        super(props)
        
        this.httpApi = new HttpApi()

        this.useLocalSessions = Config.useLocalSessions
        this.avatarSelectionEnabled = Config.welcomePage.avatarSelectionEnabled

        const user = this.useLocalSessions ? LocalStorage.get("USER") : null
        if (user) {
            this.state = {
                username: user.username,
                avatar: user.avatar,
                redirect: "/party"
            }
            this.handleUserSelected(user)
        } else {
            // TODO: pick random default avatar
            const avatar = this.avatarSelectionEnabled ? null :
                {
                    type: "normal",
                    color: "red"
                }

            this.state = {
                username: null,
                avatar,
                redirect: null
            }
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
    }

    handleUsernameChange(event) {
        this.setState({ username: event.target.value })
    }

    handleAvatarSelect(selection) {
        this.setState({ avatar: selection })
    }

    async handleReady() {
        const response = await this.httpApi.join(this.state.username, this.state.avatar)
        if (response.success) {
            const { username, avatar } = this.state
            const user = {
                username,
                avatar,
                userId: response.userId
            }
            this.props.updateUser(user)
            this.handleUserSelected(user)
            this.setState({redirect: '/party'})
        }
    }

    handleUserSelected(user) {
        this.useLocalSessions && LocalStorage.set("USER", user)
        this.props.updateUser(user)
        this.props.updateCurrentRoom({
            room: 'vestibule',
            entered: false
        })
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect}/>
        }

        let textEntry = {
          padding: '6px 10px',
          border: '2px solid #D6D3CD',
          backgroundColor: '#D6D3CD',
          borderRadius: '7px',
          color: '#1B1E1F',
          outline: 'none',
          boxShadow: 'none',
          fontSize: '20px'
        }

        let nameOpacity = 'form-fade'
        let avatarOpacity = 'form-fade'
        let partyOpacity = 'form-fade-party'
        if (this.state.username === null) { nameOpacity = 'form' }
        if (this.state.username) { avatarOpacity = 'form' }
        if (this.state.username && this.state.avatar) { partyOpacity = 'form-party' }

        const config = Config.welcomePage
        const bgStyle = {
            backgroundColor: config.backgroundColor
        }

        const splash = config.backgroundImagePath
            ? <img className="splash" src={config.backgroundImagePath}/>
            : <div className="splash" style={bgStyle}></div>

        const avatarSelect = this.avatarSelectionEnabled
            ? <PuckSelect opacity={avatarOpacity} handleSelect={this.handleAvatarSelect.bind(this)} />
            : null

        return (
            <div className="vestibule">
                <div className="header" dangerouslySetInnerHTML={{ __html: config.headerHtml }} />
                {splash}
                <input
                    style={textEntry}
                    autoComplete="off"
                    className={nameOpacity}
                    type="text"
                    placeholder="Name"
                    name="name"
                    minLength="1"
                    onChange={this.handleUsernameChange.bind(this)}
                />
                {avatarSelect}
                <input
                    id='button'
                    className={partyOpacity}
                    type="button"
                    onClick={this.handleReady.bind(this)}
                    value={config.enterSpaceButtonText}
                    disabled={!this.state.username||!this.state.avatar}
                />
            </div>
        )

    }
}

export default connect(
    state => state,
    {
        addConfig: reducers.addConfigActionCreator,
        updateUser: reducers.updateUserActionCreator,
        updateCurrentRoom: reducers.updateCurrentRoomActionCreator
     })(Welcome)
