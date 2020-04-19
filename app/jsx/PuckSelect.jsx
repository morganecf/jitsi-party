import React from 'react';
import { Dropdown } from 'semantic-ui-react';

const puckList = [
  {
    key: '1',
    text: 'Puck1',
    value: 'Puck1',
    image: { avatar: true, src: './images/puck1.png' },
  },
  {
    key: '2',
    text: 'Puck2',
    value: 'Puck2',
    image: { avatar: true, src: './images/puck1.png' },
  },
  {
    key: '3',
    text: 'Puck3',
    value: 'Puck3',
    image: { avatar: true, src: './images/puck1.png' },
  }
]

const PuckSelect = () => (
  <Dropdown
    placeholder='Choose Avatar'
    fluid
    selection
    options={puckList}
  />
)

export default PuckSelect
