import { pickRandom } from '../utils.js'

function shuffleRoom(room) {
    alert('You are being teleported into a new room. Oh the joy, joy, joy of meeting someone new!')
    const rooms = room.props.rooms
    const filtered = Object.keys(rooms).filter(
        key => !_.has(rooms[key], 'capacity') && rooms[key].type === 'jitsi' && key !== room.state.room
    )
    const newRoom = pickRandom(filtered)
    room.onSwitchRoom(newRoom)
    setTimeout(() => room.onEnterRoom(), 500)
}

export default {
    SHUFFLE_ROOM: shuffleRoom
}
