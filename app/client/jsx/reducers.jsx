import { handleActions } from 'redux-actions'

const ADD_ROOMS = 'ADD_ROOMS'
const UPDATE_USER = 'UPDATE_USER'
const UPDATE_CURRENT_ROOM = 'UPDATE_CURRENT_ROOM'
const UPDATE_AUDIO_MUTED = 'UPDATE_AUDIO_MUTED'
const UPDATE_VIDEO_MUTED = 'UPDATE_VIDEO_MUTED'

const initialState = {
    rooms: {},
    user: {},
    currentRoom: '',
    path: [],
    isAudioMuted: false,
    isVideoMuted: false
}

function addRoomsAction(state, rooms) {
    return Object.assign({}, state, rooms)
}

function updateUserAction(state, user) {
    return Object.assign({}, state, user)
}

function updateCurrentRoomAction(state, currentRoom) {
    const path = [...state.path, currentRoom.currentRoom]
    return Object.assign({}, state, currentRoom, { path })
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
        [UPDATE_CURRENT_ROOM]: updateCurrentRoomAction,
        [UPDATE_AUDIO_MUTED]: updateAudioMutedAction,
        [UPDATE_VIDEO_MUTED]: updateVideoMutedAction
    }, initialState)
}
