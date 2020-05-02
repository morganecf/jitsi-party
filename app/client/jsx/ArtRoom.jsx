import React from 'react'

export default props => {
    const { src, title, artist } = props.art
    return (
        <div className="art-room">
            <div className="art-section">
                <img src={src}/>
                <p><i>{title}</i> by {artist}</p>
            </div>
        </div>
    )
}