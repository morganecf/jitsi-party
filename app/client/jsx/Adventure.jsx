import React from 'react'

export default props => {
    const onClick = props.onClick
    const { text, buttons } = props.options
    return (
        <div className="adventure">
            <p>{text}</p>
            <div>
                {buttons.map((button, i) => {
                    return (
                        <button
                            key={`adventure-button-${i}`}
                            onClick={() => onClick(button.getNextRoom())}>{button.text}</button>
                    )
                })}
            </div>
        </div>
    )
}
