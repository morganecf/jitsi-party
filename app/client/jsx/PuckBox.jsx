import React from 'react';

const PuckBox = (props) => {
  return (
    <div className={props.style} onClick={props.handleClick} onMouseOver={props.handleTouch}>
      <img className='image' src={props.image} className={props.imageStyle} />
    </div>
  )
}
export default PuckBox;
