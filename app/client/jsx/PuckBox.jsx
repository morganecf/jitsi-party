import React from 'react';
import Fade from 'react-reveal/Fade';

const PuckBox = (props) => {
  let boxStyle = 'box'
  if (props.imageStyle=='non-selected-image') { boxStyle = 'non-selected-box'}

  if (boxStyle == 'box') { // Fade doesn't take props so we get this ugliness
    return (
      <div key={"outside-container" + props.index}>
        <Fade top>
          <div key={"inside-container" + props.index} className={boxStyle} onClick={props.handleClick} onMouseOver={props.handleTouch}>
            <img key={props.index} src={props.image} className={props.imageStyle} />
          </div>
        </Fade>
      </div>
    )
  } else {
    return (
      <div key={"outside-container" + props.index}>
        <div key={"inside-container" + props.index} className={boxStyle} onClick={props.handleClick} onMouseOver={props.handleTouch}>
          <img key={props.index} src={props.image} className={props.imageStyle} />
        </div>
      </div>
    )
  }
}
export default PuckBox;
