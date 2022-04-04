import React from 'react';
import './Board.css';
import Tile from './Tile';

export class Board extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      empty_i: 2,
      empty_j: 2,
      grid: [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 0],
      ]
    };
  }


  findXY = (grid, num) => {
    var num_i;
    var num_j;
    //console.log(num);
    //Find x and y coordinate of number clicked
    for (num_i = 0; num_i < grid.length; ++num_i) {
      const x = grid[num_i];
      for (num_j = 0; num_j < grid[num_i].length; ++num_j) {
         const y = grid[num_i][num_j];
         
         if (y === num) {
            return [num_i, num_j];
         }
      }
   }
  }

  handleClick = (num) => {
    let grid = this.state.grid;
    let empty_i = this.state.empty_i;
    let empty_j = this.state.empty_j;
    var num_coord = this.findXY(grid, num);
    //console.log(num_coord);
    var num_i = num_coord[0];
    var num_j = num_coord[1];

    const differ = Math.abs(num_i-empty_i)+Math.abs(num_j-empty_j);
    if (differ===1){
      let temp = grid[empty_i][empty_j];
      grid[empty_i][empty_j] = grid[num_i][num_j];
      grid[num_i][num_j] = temp;
      this.setState({ grid: grid, empty_i: num_i, empty_j: num_j });
    }
    
  }

  calculateTileCorrect = (i, j, value) => {
    
    // assuming all rows will have the same amount of tiles
    const tilesPerRow = this.state.grid[0].length; 
    const correctPosition = (i * tilesPerRow) + (j + 1);

    return value === correctPosition;
  }


  render() {
    return (
      <div className='board'>
        {//box section
          this.state.grid.map((list, i) => {
            return (
              <div key={i}>
                {list.map((item, j) => {
                  let index = {
                    i,
                    j,
                  };
                  return (
                    <Tile
                      value={this.state.grid[i][j]}
                      key={j}
                      index={index}
                      handleClick={this.handleClick}
                      correctPosition={this.calculateTileCorrect(i, j, this.state.grid[i][j])}
                    />
                  );
                })}
              </div>
            );
          })}
      </div>
    )
  }
}