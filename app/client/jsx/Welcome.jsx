import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import reducers from './reducers.jsx'
import { Redirect } from 'react-router-dom'
import PuckSelect from './PuckSelect.jsx'
import { Api } from './FlaskInterface.jsx'

class Welcome extends Component {
    constructor(props) {
        super(props)
        this.state = {
            displayName: null,
            avatar: null,
            redirect: null
        }
        this.api = new Api()
    }

    async componentDidMount() {
        const { success, rooms } = await this.api.getRooms()
        if (success) {
            this.props.addRooms(rooms)
        }
    }

    handleDisplayNameChange(event) {
        this.setState({ displayName: event.target.value })
    }

    handleAvatarSelect(selection) {
        this.setState({ avatar: selection })
    }

    async handleReady() {
        const response = await this.api.join(this.state.displayName, this.state.avatar)
        if (response.success) {
            const { displayName, avatar } = this.state
            this.props.updateUser({
                displayName,
                avatar,
                userId: response.userId
            })
            this.props.updateCurrentRoom('vestibule')
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
          borderRadius: '7px',
        //   backgroundColor: '#222426',
          color: '#D6D3CD',
          outline: 'none',
          boxShadow: 'none',
          fontSize: '14px'
        }

        let name_opacity = 'form-fade'
        let avatar_opacity = 'form-fade'
        let party_opacity = 'form-fade'
        if (this.state.displayName=='') { name_opacity = 'form' }
        if (this.state.displayName) { avatar_opacity = 'form' }
        if (this.state.displayName && this.state.avatar) { party_opacity = 'form-party' }

        return (
            <div className="vestibule">
                <h1>Welcome have fun</h1>
                <input style={text_entry} autoComplete="off" className={name_opacity} type="text" placeholder="Name" name="name" minLength="1" onChange={this.handleDisplayNameChange.bind(this)}/><br/>
                <PuckSelect opacity={avatar_opacity} handleSelect={this.handleAvatarSelect.bind(this)} />
                <input className={party_opacity} type="button" onClick={this.handleReady.bind(this)} value="Party" disabled={!this.state.displayName} />
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
