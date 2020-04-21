import React from 'react';

const PuckBox = (props) => {
  const style = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100px',
    height: '120px',
    backgroundColor: 'gray',
    margin: '5px'
  }
        return (
            <div style={style} onClick={props.handleClick} onMouseOver={props.handleTouch}>
            <img src={props.image} />
            </div>
        )
}

export default PuckBox;
