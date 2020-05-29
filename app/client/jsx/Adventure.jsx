import React from 'react';

const Adventure = ({onClick, options, ...props}) => {
  const {text, buttons} = options;
  return (
    <div className="adventure">
      <p>{text}</p>
      <div>
        {buttons.map((button, i) => {
          const {text} = button;
          return (
            <button
              key={`adventure-button-${i}`}
              onClick={() => onClick(button.getNextRoom())}>{text}</button>
          );
        })}
      </div>
    </div>
  );
};

export default Adventure;

