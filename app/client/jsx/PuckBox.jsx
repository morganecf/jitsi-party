import React from 'react';
import Fade from 'react-reveal/Fade';

const PuckBox = (props) => {
  let boxStyle = 'box'
  if (props.imageStyle=='non-selected-image') { boxStyle = 'non-selected-box'}

  if (boxStyle == 'box') { // Fade doesn't take props so we get this ugliness
    return (
      <div>
        <Fade top>
          <div className={boxStyle} onClick={props.handleClick} onMouseOver={props.handleTouch}>
            <img src={props.image} className={props.imageStyle} />
          </div>
        </Fade>
      </div>
    )
  } else {
    return (
      <div>
        <div className={boxStyle} onClick={props.handleClick} onMouseOver={props.handleTouch}>
          <img src={props.image} className={props.imageStyle} />
        </div>
      </div>
    )
  }
}
export default PuckBox;
