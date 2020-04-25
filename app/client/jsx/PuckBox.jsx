import React from 'react';

const PuckBox = (props) => {
  return (
    <div className='box' onClick={props.handleClick} onMouseOver={props.handleTouch}>
      <img src={props.image} className={props.imageStyle} />
    </div>
  )
}
export default PuckBox;
