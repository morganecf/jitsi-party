import React from 'react';

const PuckBox = (props) => {
  let box_style = 'box'
  if (props.imageStyle=='non-selected-image') { box_style = 'non-selected-box'}
  return (
    <div className={box_style} onClick={props.handleClick} onMouseOver={props.handleTouch}>
      <img src={props.image} className={props.imageStyle} />
    </div>
  )
}
export default PuckBox;
