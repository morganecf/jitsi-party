import { handleActions } from 'redux-actions'

const UPDATE_USER = 'UPDATE_USER'
const UPDATE_CURRENT_ROOM = 'UPDATE_CURRENT_ROOM'
const UPDATE_AUDIO_MUTED = 'UPDATE_AUDIO_MUTED'
const UPDATE_VIDEO_MUTED = 'UPDATE_VIDEO_MUTED'

const initialState = {
    user: {},
    currentRoom: '',
    path: [],
    isAudioMuted: false,
    isVideoMuted: false
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
        [UPDATE_USER]: updateUserAction,
        [UPDATE_CURRENT_ROOM]: updateCurrentRoomAction,
        [UPDATE_AUDIO_MUTED]: updateAudioMutedAction,
        [UPDATE_VIDEO_MUTED]: updateVideoMutedAction
    }, initialState)
}
