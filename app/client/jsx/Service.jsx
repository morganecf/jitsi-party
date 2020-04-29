import axios from 'axios'
import io from 'socket.io-client'

const url = 'http://127.0.0.1:5000'

export default class Service {
    constructor() {
        this.socket = null
    }

    connectToSocket() {
        if (this.socket) {
            return this.socket
        }
        this.socket = io(url, {
            transport: ['websocket']
        })
        return this.socket
    }

    startPinging(userId) {
        if (this.socket) {
            this.socket.emit('ping-user', { user_id: userId })
            this.refreshTimer = window.setInterval(() => {
                this.socket.emit('ping-user', { user_id: userId })
            }, 10000)
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.emit('disconnect')
        }
    }

    enterRoom(userId, room) {
        if (this.socket) {
            this.socket.emit('enter-room', { user_id: userId, room })
        }
    }

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
}
