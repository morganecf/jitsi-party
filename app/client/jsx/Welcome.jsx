import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import reducers from './reducers.jsx'
import { Redirect } from 'react-router-dom'
import PuckSelect from './PuckSelect.jsx'
import { HttpApi } from './WebAPI.jsx'

class Welcome extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: null,
            avatar: null,
            redirect: null
        }
        this.httpApi = new HttpApi()
    }

    async fetchRooms() {
        const { success, rooms } = await this.httpApi.getRooms()
        if (success) {
            this.props.addRooms(rooms)
        }
    }

    componentDidMount() {
        this.fetchRooms()
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
            this.props.updateUser({
                username,
                avatar,
                userId: response.userId
            })
            this.props.updateCurrentRoom({
                room: 'vestibule',
                entered: false
            })
            this.setState({ redirect: '/party' })
        }
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect}/>
        }

        let text_entry = {
          padding: '6px 10px',
          border: '2px solid #D6D3CD',
          backgroundColor: '#D6D3CD',
          borderRadius: '7px',
          color: '#1B1E1F',
          outline: 'none',
          boxShadow: 'none',
          fontSize: '20px'
        }

        let name_opacity = 'form-fade'
        let avatar_opacity = 'form-fade'
        let party_opacity = 'form-fade-party'
        if (this.state.username === null) { name_opacity = 'form' }
        if (this.state.username) { avatar_opacity = 'form' }
        if (this.state.username && this.state.avatar) { party_opacity = 'form-party' }

        return (
            <div className="vestibule">
                <br/>
                <div className='serif'>You've met with a terrible fate, haven't you?</div>
                <h1>Cabin Weekend is Dead. Long Live Cabin Fever.</h1>
                <img className='splash' src='./js/images/cabinfeverhighres.png'/>
                <input style={text_entry} autoComplete="off" className={name_opacity} type="text" placeholder="Name" name="name" minLength="1" onChange={this.handleUsernameChange.bind(this)}/><br/>
                <PuckSelect opacity={avatar_opacity} handleSelect={this.handleAvatarSelect.bind(this)} />
                <input id='button' className={party_opacity} type="button" onClick={this.handleReady.bind(this)} value="Party" disabled={!this.state.username||!this.state.avatar} />
            </div>
        )

    }
}

export default connect(
    state => state,
    {
        addRooms: reducers.addRoomsActionCreator,
        updateUser: reducers.updateUserActionCreator,
        updateCurrentRoom: reducers.updateCurrentRoomActionCreator
     })(Welcome)
