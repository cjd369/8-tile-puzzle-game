import React from 'react';
import './Tile.css';

export default function Tile(props) {

  return (
    <div className='tile' onClick={() => props.handleClick(props.value)} value={props.value}>
      {props.value}
    </div>
  );
}