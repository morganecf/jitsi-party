import React from 'react'

// An example of how to use the custom component plugin system. Custom components are passed a room and can use its API.
// See https://github.com/morganecf/jitsi-party/pull/139 for a more detailed example of an actual custom component of
// a "portal" we wanted to use at one point. This one is being used as a modal and accesses a room's handleModalChange
// function. The PR also shows how we might start to keep ALL of app state in redux (much of it is currently in Room.jsx),
// so that custom components or plugins can execute actions to effect a change in app state.


export default ({ room }) => {
    const handleEnter = () => {
        setTimeout(() => {
            // execute(room, {
            //     type: 'CHANGE_ROOM',
            //     nextRoom: 'livingRoom',
            //     entered: true
            // })
            handleDismiss()
        }, 3000)
    }

    const handleDismiss = () => {
        room.handleModalChange(null)
    }

    return (
        <div className="example-component">
            This is an example of a custom component. Do you want to switch rooms?
            <button onClick={handleEnter}>Yes</button>
            <button onClick={handleDismiss}>No</button>
        </div>
    )
}
