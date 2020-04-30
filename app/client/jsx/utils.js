function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)]
}

function teleport() {
    const leafRooms = Object.keys(this.rooms).filter(
        room => this.rooms[room].type !== 'adventure' && room !== 'bye'
    )
    return pickRandom(leafRooms)
}

export function createAdventureActions(room, rooms) {
    /*
    * Each node of an adventure has one or more buttons. Clicking on a button always
    * takes users to a different room. There are currently 3 possible action types:
    *   1. Go to specific room: specified by a string
    *   2. Randomly pick a room from subset: specified by an array of strings
    *   3. Teleport to any room: specificied by wildcard symbol, *
    * 
    * This function maps the above actions to functions. We do this here so that the
    * getNextRoom function can easily have access to the whole layout, rooms, which
    * is necessary for the wildcard option and might be useful for future action types.
    */
   room.buttons.forEach(button => {
       if (typeof button.nextRoom === 'string') {
            if (button.nextRoom === '*') {
                button.getNextRoom = teleport.bind({ rooms })
            } else {
                button.getNextRoom = () => button.nextRoom
            }
       } else {
           button.getNextRoom = () => pickRandom(button.nextRoom)
       }
    })
}
