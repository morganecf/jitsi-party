import { handleActions } from 'redux-actions'

const UPDATE_DISPLAY_NAME = 'UPDATE_DISPLAY_NAME'

const initialState = {
    displayName: '',
    avatar: ''
}

function updateDisplayNameAction(state, displayName) {
    return Object.assign({}, state, { displayName })
}

export default {
    /* Action creators: return actions for reducers */
    updateDisplayNameActionCreator: displayName => ({
        type: UPDATE_DISPLAY_NAME,
        displayName
    }),
    /* Reducers */
    reducer: handleActions({
        [UPDATE_DISPLAY_NAME]: updateDisplayNameAction,
    }, initialState)
}
