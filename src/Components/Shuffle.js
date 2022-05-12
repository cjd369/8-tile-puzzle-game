export function shuffle(seed) {
  
  //console.log(seed);
  let temp;
  let arr=[0,1,2,3,4,5,6,7,8];
  let new_grid = [];
  var gen = require('random-seed').create(seed);
  let row_count = Math.sqrt(arr.length);

  for (let i = arr.length - 1; i > 0; i--) {
    let rand = Math.floor(gen.random() * (i + 1));
    temp = arr[i];
    arr[i] = arr[rand];
    arr[rand] = temp;
  }

  for (let i = 0, j = -1; i < arr.length; i++) {   
    if (i % row_count === 0){
      j++;
      new_grid[j] = [];
    }
    new_grid[j].push(arr[i]);
  }
  //console.log(new_grid);
  
  if(!isSolvable(new_grid)) {
    //console.log("Not Solvable");
    //console.log(arr);
    return shuffle(seed + 1);
  } else {
    //console.log("Solvable");
    //console.log(arr);
    return new_grid;
  }

}


function getInvCount(arr)
{
    let inv_count = 0 ;
    for(let i=0;i<2;i++){
        for(let j=i+1;j<3;j++){
         
            // Value 0 is used for empty space
            if (arr[j][i] > 0 && arr[j][i] > arr[i][j])
                inv_count += 1;
        }
     }
    return inv_count;
}

function isSolvable(puzzle)
{
    // Count inversions in given 8 puzzle
    let invCount = getInvCount(puzzle);
    // return true if inversion count is even.
    return (invCount % 2 === 0);
}


// export function newGrid() {
//   let new_grid = shuffle();

//   return new_grid;
// }