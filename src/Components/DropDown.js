import React from 'react';

export default function DropDown(props) {
  return (
    <form>
      <label>
        Algorithm: 
        <select value={props.value}>
          <option value="A*">A*</option>
          <option value="Algorithm2">Algorithm 2</option>
          <option value="Algorithm3">Algorithm 3</option>
          <option value="Algorithm4">Algorithm 4</option>
        </select>
      </label>
    </form>
  );
}  