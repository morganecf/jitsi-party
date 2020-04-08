import { handleActions } from 'redux-actions'

const EXAMPLE_ACTION = 'EXAMPLE_ACTION'

const initialState = {
    data: {
        example: ''
    },
}

function exampleAction(state, example) {
    return Object.assign({}, state, {
        data: { example }
    })
}

export default {
    /* Action creators: return actions for reducers */
    exampleActionCreator: example => ({
        type: EXAMPLE_ACTION,
        example
    }),
    /* Reducers */
    reducer: handleActions({
        [EXAMPLE_ACTION]: exampleAction,
    }, initialState)
}
