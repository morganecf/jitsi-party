import React, { useState } from 'react'
import { execute } from '../actions.js'

export default ({ room }) => {
    const [ loading, setLoading ] = useState(false)

    const handleEnter = () => {
        setLoading(true)
        setTimeout(() => {
            execute(room, {
                type: 'CHANGE_THEME',
                className: 'midnight'
            })
            execute(room, {
                type: 'CHANGE_ROOM',
                nextRoom: 'livingRoom',
                entered: true
            })
            handleDismiss()
        }, 3000)
    }

    const handleDismiss = () => {
        room.handleModalChange(null)
    }

    const style = {
        height: '500px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column'
    }

    const innerStyle = {
        display: 'flex',
        flexDirection: 'column',
        marginLeft: '25%',
        marginRight: '25%',
        marginTop: '100px'
    }

    const getInnerDiv = () => {
        if (loading) {
            return <div>Going through the portal...</div>
        }
        return (
            <div className="midnight-portal-inner" style={innerStyle}>
                This is a portal. Do you wish to enter it?
                <button onClick={handleEnter}>Yes</button>
                <button onClick={handleDismiss}>No</button>
            </div>
        )
    }

    return (
        <div className="midnight-portal" style={style}>
            {getInnerDiv()}
        </div>
    )
}
