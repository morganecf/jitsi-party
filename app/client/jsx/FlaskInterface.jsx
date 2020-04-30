import axios from 'axios'
import io from 'socket.io-client'
import { createAdventureActions } from './utils.js'

const url = 'http://127.0.0.1:5000'

const PING_INTERVAL_MS = 10000

export class Socket {
    constructor() {
        this.socket = io(url, {
            transport: ['websocket']
        })
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
}

export class Api {
    async join(username, avatar) {
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
        try {
            const request = `${url}/rooms`
            const response = await axios.get(request)
            const rooms = response.data
            Object.values(rooms).forEach(room => {
                if (room.type === 'adventure') {
                    createAdventureActions(room)
                }
            })
            return { success: true, rooms }
        } catch (err) {
            console.log('err:', err)
            return { success: false }
        }
    }
}
