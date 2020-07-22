import axios from 'axios'
import io from 'socket.io-client'
import { createAdventureActions } from './utils.js'
import Config from './Config.jsx'

const url = Config.baseUrl
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
        this.socket.emit('ping-user', { id: userId })
        this.refreshTimer = window.setInterval(() => {
            this.socket.emit('ping-user', { id: userId })
        }, PING_INTERVAL_MS)
    }

    enterRoom(user, room) {
        this.socket.emit('enter-room', { user, room })
    }

    leaveRoom(user, room) {
        this.socket.emit('leave-room', { user, room })
    }

    poke(msg) {
        this.socket.emit('poke', msg)
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
            const { id } = response.data
            return { success: true, id }
        } catch (err) {
            console.log(err)
            return { success: false }
        }
    }

    async getConfig() {
        /* Fetches rooms, adventures, and events */
        try {
            const request = `${url}/config`
            const response = await axios.get(request)
            const { rooms, events } = response.data
            Object.values(rooms).forEach(room => {
                if (room.type === 'adventure') {
                    createAdventureActions(room, rooms)
                }
            })
            return { success: true, config: { rooms, events } }
        } catch (err) {
            console.log('err:', err)
            return { success: false }
        }
    }

    async emailModerators(message, email, user) {
        try {
            const request = `${url}/email_moderators`
            await axios.post(request, {
                params: { message, email, user }
            })
            return { success: true }
        } catch (err) {
            console.log(err)
            return { success: false }
        }
    }
}
