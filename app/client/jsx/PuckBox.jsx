import React from 'react';
import Fade from 'react-reveal/Fade';

const PuckBox = (props) => {
  let box_style = 'box'
  if (props.imageStyle=='non-selected-image') { box_style = 'non-selected-box'}
  return (
    <div>
      <Fade top>
        <div className={box_style} onClick={props.handleClick} onMouseOver={props.handleTouch}>
          <img src={props.image} className={props.imageStyle} />
        </div>
      </Fade>
    </div>
  )
}
export default PuckBox;
