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
        this.socket.emit('ping-user', { user_id: userId })
        this.refreshTimer = window.setInterval(() => {
            this.socket.emit('ping-user', { user_id: userId })
        }, PING_INTERVAL_MS)
    }

    enterRoom(user, room) {
        this.socket.emit('enter-room', { user, room })
    }

    leaveRoom(user, room) {
        this.socket.emit('leave-room', { user, room })
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
