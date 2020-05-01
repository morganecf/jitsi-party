import axios from 'axios'
import io from 'socket.io-client'
import { createAdventureActions } from './utils.js'

// TODO this should go into a config / use process.env
const hostname = window && window.location && window.location.hostname
const production = 'https://party.gbre.org/'
const development = 'http://127.0.0.1:5000'
const url = hostname === 'party.gbre.org' ? production : development

const PING_INTERVAL_MS = 10000


export class WebSocketApi {
    constructor() {
        this.socket = io(url, {
            transport: ['websocket']
        })
    }

    on(eventName, callback) {
        this.socket.on(eventName, callback)
    }

    startPinging(userId) {
        this.socket.emit('ping-user', { user_id: userId })
        this.refreshTimer = window.setInterval(() => {
            this.socket.emit('ping-user', { user_id: userId })
        }, PING_INTERVAL_MS)
    }

    enterRoom(userId, room) {
        this.socket.emit('enter-room', { user_id: userId, room })
    }

    leaveRoom(userId, room) {
        this.socket.emit('leave-room', { user_id: userId, room })
    }
}


export class HttpApi {
    async join(username, avatar) {
        /* Creates a new user */
        try {
            const request = `${url}/join`
            const response = await axios.post(request, {
                params: { username, avatar }
            })
            const { userId } = response.data
            return { success: true, userId }
        } catch (err) {
            console.log(err)
            return { success: false }
        }
    }

    async getUsers(room=null) {
        /* Only gets active users for the given room, or all active users */
        try {
            const params = room ? `/${room}` : ''
            const request = `${url}/users${params}`
            const response = await axios.get(request)
            return { success: true, users: response.data }
        } catch (err) {
            return { success: false }
        }
    }

    async getRooms() {
        /* Fetches room definition, including adventure rooms */
        try {
            const request = `${url}/rooms`
            const response = await axios.get(request)
            const rooms = response.data
            Object.values(rooms).forEach(room => {
                if (room.type === 'adventure') {
                    createAdventureActions(room, rooms)
                }
            })
            return { success: true, rooms }
        } catch (err) {
            console.log('err:', err)
            return { success: false }
        }
    }
}
