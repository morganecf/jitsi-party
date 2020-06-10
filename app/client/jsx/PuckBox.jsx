import React from 'react'
import Fade from 'react-reveal/Fade'

const PuckBox = (props) => {
  const boxClass = props.imageStyle === 'non-selected-image' ? 'non-selected-box' : 'box'
  if (boxClass === 'box') { // Fade doesn't take props so we get this ugliness
    return (
      <div>
        <Fade top>
          <div className={boxClass} onClick={props.handleClick} onMouseOver={props.handleTouch}>
            <img src={props.image} className={props.imageStyle} />
          </div>
        </Fade>
      </div>
    )
  } else {
    return (
      <div>
        <div className={boxClass} onClick={props.handleClick} onMouseOver={props.handleTouch}>
          <img src={props.image} className={props.imageStyle} />
        </div>
      </div>
    )
  }
}
export default PuckBox
