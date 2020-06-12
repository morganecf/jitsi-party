import _ from 'lodash'
import moment from 'moment'
import CustomActions from './CustomActions'

const NOTIFICATION = 'NOTIFICATION'
const CHANGE_THEME = 'CHANGE_THEME'
const CHANGE_ROOM = 'CHANGE_ROOM'
const OPEN_MODAL = 'OPEN_MODAL'

function notify(room, { notification }) {
    room.context.add(notification)
}

function changeTheme(room, { className }) {
    document.body.className += ` ${className}`
}

function changeRoom(room, { nextRoom, enter }) {
    room.onSwitchRoom(nextRoom)
    if (enter) {
        setTimeout(() => room.onEnterRoom(), 500)
    }
}

function openModal(room, { component }) {
    room.setState({ modal: component })
}

const actions = {
    [NOTIFICATION]: notify,
    [CHANGE_THEME]: changeTheme,
    [CHANGE_ROOM]: changeRoom,
    [OPEN_MODAL]: openModal
}

Object.keys(CustomActions).forEach(type => {
    if (type in actions) {
        throw `${type} is a default action name and cannot be used`
    }
    actions[type] = CustomActions[type]
})

function computeTimeoutNoise(action) {
    if (action.triggerNoise) {
        return Math.floor(Math.random() * (action.triggerNoise + 1)) * 1000
    }
    return 0
}

function computeTimeout(action) {
    const delay = computeTimeoutNoise(action)
    if (action.time) {
        const actionTime = moment(action.time).unix()
        const now = moment(moment.now()).unix()
        let timeout = (actionTime - now) * 1000
        // Will trigger immediately if action specifies triggerAfterTime=true
        // and it's later than when the action is supposed to trigger
        if (timeout < 0) {
            if (action.triggerAfterTime) {
                return 0
            }
        } else {
            return timeout + delay
        }
    } else if (action.secondsAfterJoin) {
        return action.secondsAfterJoin * 1000 + delay
    }
}

export function execute(room, action) {
    if (action.type && actions[action.type]) {
        return actions[action.type](room, action)
    }
}

export function schedule(room, action) {
    const timeout = computeTimeout(action)
    if (action.triggerNoise) {
        console.log('schedule:', action, timeout)
    }
    if (_.isNumber(timeout)) {
        return setTimeout(() => execute(room, action), timeout)
    }
}
