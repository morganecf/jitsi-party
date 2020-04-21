import React from 'react'
import RoomLayout from './RoomLayout.jsx'

export default props => {
    const onClick = props.onClick
    const { text, buttons } = props.options
    return (
        <div className="adventure">
            <p>{text}</p>
            {buttons.map((button, i) => {
                return (
                    <button
                        key={`adventure-button-${i}`}
                        onClick={() => onClick(button.getNextRoom(RoomLayout))}>{button.text}</button>
                )
            })}
        </div>
    )
}
