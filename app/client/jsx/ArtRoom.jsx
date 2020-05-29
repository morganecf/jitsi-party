import React from 'react';

const ArtRoom = ({art}) => {
  const {src, title, artist} = art;
  return (
    <div className="art-room">
      <div className="art-section">
        <img src={src}/>
        <p><i>{title}</i> by {artist}</p>
      </div>
    </div>
  );
};

export default ArtRoom;
