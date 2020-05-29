import React from 'react';
import UserList from './UserList.jsx';

const MapRoomInfo = ({room, isVisited, users, ...props}) => {
  if (!room) {
    return <div id="map-info"></div>;
  }

  // Case 1: User has not visited room, info is locked
  if (!isVisited) {
    return (
      <div id="map-info">
        <div className="room-info">
          <div className="room-name">{room.name}</div>
          <hr></hr>
          <div className="room-info-content">
                        You have not unlocked this room yet. Click on it to teleport!
          </div>
        </div>
      </div>
    );
  }

  // Case 2: User has visited room, info is unlocked
  let userContent;
  if (users.length > 0) {
    const numPeople = users.length > 1 ?
            `There are ${users.length} people in this room!` :
            'There is one person in this room';
    userContent = (
      <div>
        <div className="room-info-content">{numPeople}</div>
        <UserList users={users} room={room}></UserList>
      </div>
    );
  } else {
    const str = room.name === 'Room 314' ?
            'You can\'t just teleport here. Try finding an adventure first.' :
            'No one is in this room yet. Click on it to teleport!';
    userContent = <div className="room-info-content"> {str}</div>;
  }

  // Show announcements if any exist
  let announcements;
  if (room.announcements) {
    announcements = (
      <div className="map-room-announcements">
        <hr></hr>
        <ul>
          {room.announcements.map((announcement, i) => (
            <li key={`announcement-${i}`}>{announcement}</li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div id="map-info">
      <div className="room-info">
        <div className="room-name">{room.name}</div>
        {userContent}
        {announcements}
      </div>
    </div>
  );
};

export default MapRoomInfo;

