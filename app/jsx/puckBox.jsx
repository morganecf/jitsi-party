import React from 'react';

const PuckBox = (props) => {

  const style = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    margin: '5px 5px 0px 0px',
    backgroundColor: '#E6E6E6',
    width: '50px',
    padding: '2px'
  }
        return (
            <div style={style} onClick={props.handleClick} onMouseOver={props.handleTouch}>
            <img style={{ maxWidth: '50px'}} src={props.image} />
            </div>
        )
}

export default PuckBox;
