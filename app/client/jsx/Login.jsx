import _ from 'lodash'
import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import PuckSelect from './PuckSelect.jsx'
import { HttpApi } from './WebAPI.jsx'
import LocalStorage from './LocalStorage.jsx'
import { useDispatch } from 'react-redux'
import Config from './Config.jsx'


// TODO: once we have a system of authentication, we'll want to send already logged in users
// directly to the party, but it's not safe to do this now because it would allow an arbitrary
// number of logins from the same person under the same username, fucking up the map.

export default () => {
    const httpApi = new HttpApi()
    const dispatch = useDispatch()

    const useLocalSessions = Config.useLocalSessions
    const avatarSelectionEnabled = Config.welcomePage.avatarSelectionEnabled
    const user = useLocalSessions && LocalStorage.get('USER') || {}

    const defaultAvatar = {
        type: 'normal',
        color: 'red'
    }

    const [username, setUsername] = useState(user.username)
    const [avatar, setAvatar] = useState(avatarSelectionEnabled ? user.avatar : defaultAvatar)
    const [redirect, setRedirect] = useState(false)

    const handleUserSelected = user => {
        useLocalSessions && LocalStorage.set('USER', user)
        dispatch({ type: 'UPDATE_USER', user })
        dispatch({ type: 'UPDATE_CURRENT_ROOM', currentRoom: {
            room: Config.startRoom,
            entered: false
        }})
    }
    const handleUsernameChange = event => setUsername(event.target.value)
    const handleAvatarSelect = selection => setAvatar(selection)
    const handleLogin = async () => {
        const response = await httpApi.join(username, avatar)
        if (response.success) {
            const user = {
                username,
                avatar,
                id: response.id
            }
            dispatch({ type: 'UPDATE_USER', user })
            handleUserSelected(user)
            setRedirect(true)
        }
    }

    // If user is present from local storage, navigate directly to house. A new user is created
    // with a new user ID, but the user's previous username/avatar selections are persisted.
    if (!_.isEmpty(user)) {
        handleLogin()
    }
    if (redirect) {
        return <Redirect to='/party'/>
    }
    
    let avatarOpacity = 'form-fade'
    let nameOpacity = 'form-fade'
    let partyOpacity = 'form-fade-party'
    if (username) {
        avatarOpacity = 'form'
        if (username === null) {
            nameOpacity = 'form'
        }
        if (avatar) {
            partyOpacity = 'form-party'
        }
    }

    const avatarSelect = avatarSelectionEnabled
            ? <PuckSelect opacity={avatarOpacity} handleSelect={handleAvatarSelect} />
            : null

    return (
        <div className="login">
            <input
                autoComplete="off"
                className={`text-entry ${nameOpacity}`}
                type="text"
                placeholder="Name"
                name="name"
                minLength="1"
                onChange={handleUsernameChange}
            />
            {avatarSelect}
            <input
                id='button'
                className={partyOpacity + ' opaque'}
                type="button"
                onClick={handleLogin}
                value={Config.welcomePage.enterSpaceButtonText}
                disabled={!username || !avatar}
            />
        </div>
    )
}
