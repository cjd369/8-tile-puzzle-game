import React from 'react';
import './Board.css';
import Tile from './Tile';
import DropDown from './DropDown'
import { shuffle } from './Shuffle'
import { pathStates } from './Algorithms/a-star'

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
      ],
      moves: 0,
      seed: 0,
      algo: "a-star",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  isWin = (arr) => {

    let grid_win=[
        [1,2,3],
        [4,5,6],
        [7,8,0]
    ];
    
    for (let x=0;x<3;x++)
      for (let y=0;y<3;y++)
          if(arr[x][y] !== grid_win[x][y])
              return false;
    return true;
  }


  findXY = (grid, num) => {
    var num_i;
    var num_j;
    //console.log(num);
    //Find x and y coordinate of number clicked
    for (num_i = 0; num_i < grid.length; ++num_i) {
      //const x = grid[num_i];
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
    let new_move = this.state.moves;
    var num_coord = this.findXY(grid, num);
    //console.log(num_coord);
    var num_i = num_coord[0];
    var num_j = num_coord[1];

    const differ = Math.abs(num_i-empty_i)+Math.abs(num_j-empty_j);
    if (differ===1){
      let temp = grid[empty_i][empty_j];
      grid[empty_i][empty_j] = grid[num_i][num_j];
      grid[num_i][num_j] = temp;
      this.setState({ grid: grid, empty_i: num_i, empty_j: num_j, moves: new_move + 1 });
    }
    
  }

  handleChange = (event) => {
    let target = event.target.name;
    console.log(target);
    if (target === "seed")
      this.setState({seed: event.target.value});
    else if (target === "algo")
      this.setState({algo: event.target.value})
  }

  handleSubmit = (event) => {
    this.setState({seed: event.target.value});
    this.newGame();
    event.preventDefault();
  }

  // calculateTileCorrect = (i, j, value) => {
  //   // assuming all rows will have the same amount of tiles
  //   const tilesPerRow = this.state.grid[0].length; 
  //   const correctPosition = (i * tilesPerRow) + (j + 1);

  //   return value === correctPosition;
  // }

  newGame = () => {
    let grid = shuffle(this.state.seed);
    let i, j;
    let empty_i, empty_j;
    let moves = 0;
    for (i = 0; i <= 2; i++)
      for (j = 0; j <= 2; j++)
        if (grid[i][j] === 0) {
          empty_i = i;
          empty_j = j;
          j = 2;
          i = 2;
        }
    this.setState({ grid: grid, empty_i: empty_i, empty_j: empty_j, moves: moves});
  };

  sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }


  solve = async () => {
    let sol = pathStates(this.state.grid, this.state.algo);
    let i = 0;
    let moves = sol.length;
    for (let i = 0; i < moves; i++) {
      let new_grid = sol[i];
      this.setState({ grid: new_grid.grid, empty_i: new_grid.empty_i, empty_j: new_grid.empty_j, moves: i+1});
      //await this.sleep(500);
    }
  };


  render() {

    let win = this.isWin(this.state.grid);

    if (!win){
      return (
        <div>
          <form className="seedInput" onSubmit={this.handleSubmit}>
            <label>
              Algorithm:
              <select name = "algo" value={this.state.algo} onChange={this.handleChange}>
                <option value="a-star">A*</option>
                <option value="Algorithm2">Algorithm 2</option>
                <option value="Algorithm3">Algorithm 3</option>
                <option value="Algorithm4">Algorithm 4</option>
              </select>
            </label>
            <label>
              Seed:
              <input
                name="seed" 
                type="number" 
                seed={this.state.seed} 
                onChange={this.handleChange} 
                placeholder="Enter Seed"
              />
            </label>
          </form>
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
                          //correctPosition={this.calculateTileCorrect(i, j, this.state.grid[i][j])}
                        />
                      );
                    })}
                </div>
              );
            })}
        </div>
        <div className="buttons">
            <button onClick={this.newGame}>
              {"SHUFFLE"}
            </button>
            <button
              className="solve"
              onClick={this.solve}
            >
              {"SOLVE"}
            </button>
          </div>
          <h2> Moves: {this.state.moves} </h2>
        </div>
      )
    } else {
      return (
        <div>
          <form className="seedInput" onSubmit={this.handleSubmit}>
            <label>
              Algorithm:
              <select name = "algo" value={this.state.algo} onChange={this.handleChange}>
                <option value="a-star">A*</option>
                <option value="Algorithm2">Algorithm 2</option>
                <option value="Algorithm3">Algorithm 3</option>
                <option value="Algorithm4">Algorithm 4</option>
              </select>
            </label>
            <label>
              Seed:
              <input 
                name = "seed"
                type="number" 
                seed={this.state.seed} 
                onChange={this.handleChange}
                placeholder="Enter Seed"
              />
            </label>
          </form>
          <div className="board">
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
                        //correctPosition={this.calculateTileCorrect(i, j, this.state.grid[i][j])} 
                        />
                      );
                    })}
                  </div>
                );
              })}
          </div>
          <div className="buttons">
            <button onClick={this.newGame}>
              {"NEW GAME"}
            </button>
          </div>
          <h2> You won in {this.state.moves} moves! </h2>
        </div>
      );
    }
    
  }
}