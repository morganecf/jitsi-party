import { handleActions } from 'redux-actions'

const UPDATE_DISPLAY_NAME = 'UPDATE_DISPLAY_NAME'
const UPDATE_AVATAR = 'UPDATE_AVATAR'
const UPDATE_CURRENT_ROOM = 'UPDATE_CURRENT_ROOM'
const UPDATE_AUDIO_MUTED = 'UPDATE_AUDIO_MUTED'
const UPDATE_VIDEO_MUTED = 'UPDATE_VIDEO_MUTED'

const initialState = {
    displayName: '',
    avatar: '',
    currentRoom: '',
    path: [],
    isAudioMuted: false,
    isVideoMuted: false
}

function updateDisplayNameAction(state, displayName) {
    return Object.assign({}, state, displayName)
}

function updateAvatarAction(state, avatar) {
    return Object.assign({}, state, avatar)
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
        [UPDATE_DISPLAY_NAME]: updateDisplayNameAction,
        [UPDATE_AVATAR]: updateAvatarAction,
        [UPDATE_CURRENT_ROOM]: updateCurrentRoomAction,
        [UPDATE_AUDIO_MUTED]: updateAudioMutedAction,
        [UPDATE_VIDEO_MUTED]: updateVideoMutedAction
    }, initialState)
}
