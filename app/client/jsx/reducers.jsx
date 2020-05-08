import _ from 'lodash'
import { handleActions } from 'redux-actions'
import { WebSocketApi } from './WebAPI.jsx'

const ADD_ROOMS = 'ADD_ROOMS'
const UPDATE_USER = 'UPDATE_USER'
const UPDATE_USERS = 'UPDATE_USERS'
const CONNECT_SOCKET = 'CONNECT_SOCKET'
const UPDATE_CURRENT_ROOM = 'UPDATE_CURRENT_ROOM'
const UPDATE_AUDIO_MUTED = 'UPDATE_AUDIO_MUTED'
const UPDATE_VIDEO_MUTED = 'UPDATE_VIDEO_MUTED'

/*
* This is the global state.
*   user: userId, username, avatar type/color
*   rooms: roomId->room definition mapping
*   users: roomId->userlist mapping, gets updated by websockets
*   currentRoom: room, entered
*   visited: map of which rooms user has visited
*   socketApi: unique client connection to the websocket
*   isAudioMuted: whether or not the user currently has audio muted
*   isVideoMuted: whether or not the user currently has video muted
*/
const initialState = {
    user: {},
    rooms: {},
    users: {},
    currentRoom: {},
    visited: {},
    socketApi: null,
    isAudioMuted: false,
    isVideoMuted: false
}

function addRoomsAction(state, rooms) {
    return Object.assign({}, state, rooms)
}

function updateUsersAction(state, users) {
    return Object.assign({}, state, users)
}

function updateUserAction(state, user) {
    return Object.assign({}, state, user)
}

function connectSocketAction(state) {
    const socketApi = new WebSocketApi()
    return Object.assign({}, state, { socketApi })
}

function updateCurrentRoomAction(state, currentRoom) {
    const { room, entered } = currentRoom.currentRoom
    const visited = Object.assign({}, state.visited)
    visited[room] = entered
    return Object.assign({}, state, currentRoom, { visited })
}

function updateAudioMutedAction(state, isAudioMuted) {
    return Object.assign({}, state, isAudioMuted)
}

function updateVideoMutedAction(state, isVideoMuted) {
    return Object.assign({}, state, isVideoMuted)
}

export default {
    /* Action creators: return actions for reducers */
    addRoomsActionCreator: rooms => ({
        type: ADD_ROOMS,
        rooms
    }),
    updateUserActionCreator: user => ({
        type: UPDATE_USER,
        user
    }),
    updateUsersActionCreator: users => ({
        type: UPDATE_USERS,
        users
    }),
    connectSocketActionCreator: () => ({
        type: CONNECT_SOCKET
    }),
    updateCurrentRoomActionCreator: currentRoom => ({
        type: UPDATE_CURRENT_ROOM,
        currentRoom
    }),
    updateAudioMutedActionCreator: isAudioMuted => ({
        type: UPDATE_AUDIO_MUTED,
        isAudioMuted
    }),
    updateVideoMutedActionCreator: isVideoMuted => ({
        type: UPDATE_VIDEO_MUTED,
        isVideoMuted
    }),
    /* Reducers */
    reducer: handleActions({
        [ADD_ROOMS]: addRoomsAction,
        [UPDATE_USER]: updateUserAction,
        [UPDATE_USERS]: updateUsersAction,
        [CONNECT_SOCKET]: connectSocketAction,
        [UPDATE_CURRENT_ROOM]: updateCurrentRoomAction,
        [UPDATE_AUDIO_MUTED]: updateAudioMutedAction,
        [UPDATE_VIDEO_MUTED]: updateVideoMutedAction
    }, initialState)
}
