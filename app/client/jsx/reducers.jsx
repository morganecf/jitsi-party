import { handleActions } from 'redux-actions'

const UPDATE_DISPLAY_NAME = 'UPDATE_DISPLAY_NAME'
const UPDATE_AVATAR = 'UPDATE_AVATAR'
const UPDATE_CURRENT_ROOM = 'UPDATE_CURRENT_ROOM'

const initialState = {
    displayName: '',
    avatar: '',
    currentRoom: '',
    path: []
}

function updateDisplayNameAction(state, displayName) {
    return Object.assign({}, state, displayName)
}

function updateAvatarAction(state, avatar) {
    console.log('banona bread')
    return Object.assign({}, state, avatar)
}

function updateCurrentRoomAction(state, currentRoom) {
    const path = [...state.path, currentRoom.currentRoom]
    return Object.assign({}, state, currentRoom, { path })
}

export default {
    /* Action creators: return actions for reducers */
    updateDisplayNameActionCreator: displayName => ({
        type: UPDATE_DISPLAY_NAME,
        displayName
    }),
    updateAvatarActionCreator: avatar => ({
        type: UPDATE_AVATAR,
        avatar
    }),
    updateCurrentRoomActionCreator: currentRoom => ({
        type: UPDATE_CURRENT_ROOM,
        currentRoom
    }),
    /* Reducers */
    reducer: handleActions({
        [UPDATE_DISPLAY_NAME]: updateDisplayNameAction,
        [UPDATE_AVATAR]: updateAvatarAction,
        [UPDATE_CURRENT_ROOM]: updateCurrentRoomAction,
    }, initialState)
}
