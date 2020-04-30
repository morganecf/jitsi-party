import axios from 'axios'
import io from 'socket.io-client'

const url = 'http://127.0.0.1:5000'

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
        }, 10000)
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
}
