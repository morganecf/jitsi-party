import _ from 'lodash'
import { handleActions } from 'redux-actions'

const ADD_CONFIG = 'ADD_CONFIG'
const UPDATE_USER = 'UPDATE_USER'
const UPDATE_USERS = 'UPDATE_USERS'
const UPDATE_CURRENT_ROOM = 'UPDATE_CURRENT_ROOM'
const UPDATE_JITSI_AUDIO_MUTED = 'UPDATE_AUDIO_MUTED'
const UPDATE_JITSI_VIDEO_MUTED = 'UPDATE_VIDEO_MUTED'
const UPDATE_ROOM_AUDIO = 'UPDATE_ROOM_AUDIO'
const UNLOCK_POKING = 'UNLOCK_POKING'

/*
* This is the global state.
*   user: id, username, avatar type/color
*   rooms: roomId->room definition mapping
*   events: list of events
*   users: roomId->userlist mapping, gets updated by websockets
*   currentRoom: room, entered
*   visited: map of which rooms user has visited
*   isAudioMuted: whether or not the user currently has audio muted
*   isVideoMuted: whether or not the user currently has video muted
*/
const initialState = {
    user: {},
    rooms: {},
    events: {},
    users: {},
    currentRoom: {},
    visited: {},
    isAudioMuted: false,
    isVideoMuted: false,
    isPokingUnlocked: false
}

function addConfigAction(state, config) {
    const { rooms, events } = config.config
    return Object.assign({}, state, { rooms, events })
}

function updateUsersAction(state, users) {
    return Object.assign({}, state, users)
}

function updateUserAction(state, user) {
    return Object.assign({}, state, user)
}

function updateCurrentRoomAction(state, currentRoom) {
    const { room, entered } = currentRoom.currentRoom
    const visited = Object.assign({}, state.visited)
    visited[room] = entered
    return Object.assign({}, state, currentRoom, { visited })
}

function updateJitsiAudioMutedAction(state, isAudioMuted) {
    return Object.assign({}, state, isAudioMuted)
}

function updateJitsiVideoMutedAction(state, isVideoMuted) {
    return Object.assign({}, state, isVideoMuted)
}

function updateRoomAudioAction(state, { currentRoom, autoPlay }) {
    const nextState = _.cloneDeep(state)
    nextState.rooms[currentRoom].audio.autoPlay = autoPlay
    return nextState
}

function unlockPokingAction(state) {
    return Object.assign({}, state, { isPokingUnlocked: true })
}

export default {
    /* Action creators: return actions for reducers */
    addConfigActionCreator: config => ({
        type: ADD_CONFIG,
        config
    }),
    updateUserActionCreator: user => ({
        type: UPDATE_USER,
        user
    }),
    updateUsersActionCreator: users => ({
        type: UPDATE_USERS,
        users
    }),
    updateCurrentRoomActionCreator: currentRoom => ({
        type: UPDATE_CURRENT_ROOM,
        currentRoom
    }),
    updateJitsiAudioMutedActionCreator: isAudioMuted => ({
        type: UPDATE_JITSI_AUDIO_MUTED,
        isAudioMuted
    }),
    updateJitsiVideoMutedActionCreator: isVideoMuted => ({
        type: UPDATE_JITSI_VIDEO_MUTED,
        isVideoMuted
    }),
    updateRoomAudioActionCreator: (currentRoom, autoPlay) => ({
        type: UPDATE_ROOM_AUDIO,
        currentRoom,
        autoPlay
    }),
    unlockPokingActionCreator: () => ({
        type: UNLOCK_POKING
    }),
    /* Reducers */
    reducer: handleActions({
        [ADD_CONFIG]: addConfigAction,
        [UPDATE_USER]: updateUserAction,
        [UPDATE_USERS]: updateUsersAction,
        [UPDATE_CURRENT_ROOM]: updateCurrentRoomAction,
        [UPDATE_JITSI_AUDIO_MUTED]: updateJitsiAudioMutedAction,
        [UPDATE_JITSI_VIDEO_MUTED]: updateJitsiVideoMutedAction,
        [UPDATE_ROOM_AUDIO]: updateRoomAudioAction,
        [UNLOCK_POKING]: unlockPokingAction
    }, initialState)
}
