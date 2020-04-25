import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import reducers from './reducers.jsx'
import { Link, Redirect } from 'react-router-dom'
import PuckSelect from './PuckSelect.jsx'

class Welcome extends Component {
    constructor(props) {
        super(props)
        this.state = {
            displayName: this.props.displayName,
            avatar: this.props.avatar,
            redirect: null
        }
    }

    handleDisplayNameChange(event) {
        this.setState({ displayName: event.target.value })
    }

    handleAvatarSelect(selection) {
      this.setState({ avatar: selection })
      console.log(selection)
    }

    handleReady() {
        this.props.updateDisplayName(this.state.displayName)
        this.props.updateAvatar(this.state.avatar)
        this.props.updateCurrentRoom('vestibule')
        this.setState({ redirect: '/party' })
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect}/>
        }

        let name_opacity = 'form-fade'
        let avatar_opacity = 'form-fade'
        let party_opacity = 'form-fade'
        if (this.state.displayName=='') { name_opacity = 'form' }
        if (this.state.displayName) { avatar_opacity = 'form' }
        if (this.state.avatar) { party_opacity = 'form-party' }

        return (
            <div className="vestibule">
                <h1>Welcome have fun</h1>
                <input className={name_opacity} type="text" placeholder="Pick your name" name="name" minLength="1" onChange={this.handleDisplayNameChange.bind(this)}/><br/>
                <PuckSelect opacity={avatar_opacity} handleSelect={this.handleAvatarSelect.bind(this)} />
                <input className={party_opacity} type="button" onClick={this.handleReady.bind(this)} value="Party" disabled={!this.state.displayName} />
            </div>
        )

    }
}

export default connect(
    state => state,
    {
        updateDisplayName: reducers.updateDisplayNameActionCreator,
        updateAvatar: reducers.updateAvatarActionCreator,
        updateCurrentRoom: reducers.updateCurrentRoomActionCreator
     })(Welcome)
