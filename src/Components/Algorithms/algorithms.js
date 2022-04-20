class Node {
    constructor() {
      this.state = null;
      this.parent = null;
      this.action = null;
      this.path_cost = null;
    }

    hamming(){
        let h=0;
        for(let i=0;i<8;i++)
        {
            if(this.arr[i]!==i+1)
                h++;
        }
        return h;
    }

    calc_empty() {
        let empty_pos;
        for (let i = 0; i < this.arr.length; i++) {
            if (this.arr[i] === 0)
                empty_pos = i;
        }
        return empty_pos;
    }
}


export function pathStates(node){
  let arr=[];
  arr=[].concat(...node); //converts 2d array into 1d array
  //console.log(arr);
  //console.log(node);
  let ret=[];
  let puzzle =new Board(arr); 
  let sol=solver(puzzle);
  while(sol.parent!==-1){
    ret.push(convArr(sol.arr));
    sol=sol.parent;  
  }
  ret.push(convArr(sol.arr));
  ret.reverse();
  //console.log(ret);
  return ret;
}