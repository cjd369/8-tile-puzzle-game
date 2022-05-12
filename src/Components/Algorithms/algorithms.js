/* 8-Puzzle Solver */

/**************************************************************************************************************************************


Inputs: an 8-puzzle problem in the form of an array:

[[pos0,pos1...pos8], algorithm, depth]

pos0 - pos8: The tile at each positions where:

    012
    345: tile positions
    678

    0 represents the blank.

    (solved puzzle is: 123
                       456
                       780  though this can be changed)

algorithm:

    0 = breadth-first
    1 = a* hamming distance
    2 = a* manhattan distance
    3 = depth-first
    4 = a* euclidean distance
    5 = a* n-MaxSwap
    6 = a* n-Swap
    7 = iterative deepening
    8 = depth-first limited

depth: maximum depth to search for depth-first limited search, some number must be present, but if you're not doing #8 depth-limited, it's ignored

example usage:

solver([[4, 0, 2, 5, 1, 3, 7, 8, 6], 2, 0)];

would solve the puzzle:

402
513
786, using A* with the Manhattan distance heuristic.

Note: no attempt is made in this code to verify that the puzzle is solveable given the goal state

Output:

[[starting state...goal state], moves, states reached, nodes expanded]

[starting state...goal state]: the sequence of moves the algorithm found to solve the puzzle

moves: number of moves the algorithm made (max optimal is 31)
states reached: There are 9!/2 = 181,400 reachable states in an 8-puzzle
nodes expanded: Program expands nodes, but will not add the children to the frontier if the state has been visited, so this number  >= states reached

*****************************************************************************************************************************************/


// array of reached states
let reached = [];

// number of expansions
let expanded = 0;

// for calculating Manhattan distance
let goalX = [2, 0, 1, 2, 0, 1, 2, 0, 1];
let goalY = [2, 0, 0, 0, 1, 1, 1, 2, 2];
let tileX = [0, 1, 2, 0, 1, 2, 0, 1, 2];
let tileY = [0, 0, 0, 1, 1, 1, 2, 2, 2];


class Puzzle {
/*an 8-puzzle problem */

    constructor(initial) {
        this.initial = initial; // array of puzzle initial state
        this.initialStr = JSON.stringify(this.initial); // string of initial puzzle state
        this.goal = "[1,2,3,4,5,6,7,8,0]";
    }

    // The indexes of the possible squares that the blank can move to given its location
    actions(state) {
        const moves = [[1, 3], [0, 2, 4], [1, 5], [0, 4, 6], [1, 3, 5, 7], [2, 4, 8], [3, 7], [4, 6, 8], [7, 5]]; // all possible moves
        let blank = state.indexOf(0);   // find the blank
        return moves[blank];            // return possible moves
    }

    // result (swap the blank with the action square)
    result(state, action) {
        const s = [...state]                            // very important to copy state - otherwise we modify it!
        let blank = s.indexOf(0);                       // find the blank
        [s[action], s[blank]] = [s[blank], s[action]];  // swap
        return s;
    }

    // isGoal (is puzzle solved?)
    isGoal(stateStr) {
        return (stateStr == this.goal);
    }
}

class Node {
/* a node in a search tree representing a state in the game and how we got there */

    constructor(state, parent = null, action = null, pathCost = 0, score = 0) {
      this.state = state;                                                   // board position in this state
      this.stateStr = (state == null) ? "null" : JSON.stringify(state);     // string of state
      this.parent = parent;                                                 // mommy node in the tree that generated this node
      this.action = action;                                                 // action that was applied to mommy to generate this node
      this.pathCost = pathCost;                                             // g(n) total cost of the path from initial state to this node
      this.score = score;                                                   // h(n)
    }
}

let failure = new Node("failure", Node.pathCost = Infinity);
let cutoff = new Node("cutoff", Node.pathCost = Infinity);


function heuristic(f, node) {

/* applies the appropriate f, where f = g (path-cost to that point) + h (heuristic)

   0 = breadth-first
   1 = a* hamming distance
   2 = a* manhattan distance
   3 = depth-first
   4 = a* euclidean distance
   5 = a* n-MaxSwap
   6 = a* n-Swap
*/

    switch (f) {
    case 0: // no heuristic, just return path-cost to search shallowest nodes first
            return node.pathCost;
            break;

    case 1: // h = number of tiles out of place
            let hammingDist = 0;
            let goal = [1,2,3,4,5,6,7,8,0];
            for (let i = 0; i <= 8; i++) {
                if (node.state[i] != goal[i]) hammingDist++;
            }
            return (node.pathCost + hammingDist);
            break;

    case 2: // h = sum of manhattan distances of each tile to goal
            let manhattanDist = 0;
            for (let i = 0; i <= 8; i++) {
                let tile = node.state[i];
                let md = Math.abs(tileX[i]- goalX[tile]) + Math.abs(tileY[i]- goalY[tile])
                manhattanDist += md;
            }
            return (node.pathCost + manhattanDist);
            break;

    case 3: // no heuristic, return opposite of path-cost to search deepest nodes first
            return (-node.pathCost);
            break;

    case 4: // h = sum of euclidean distances from each tile to goal

            let euclidDist = 0;
            for (let i = 0; i <= 8; i++) {
                let tile = node.state[i];
                let ed = Math.sqrt((tileX[i]- goalX[tile])**2 + (tileY[i]- goalY[tile])**2)
                euclidDist += ed;
            }
            return (node.pathCost + euclidDist);
            break;

    case 5: // h = number of swaps to solve if you can swap any tile with the blank tile



            let swaps = 0;
            let P = [...node.state];
            let zero = P.findIndex(elem => elem == 0);
            P[zero] = 9;
            for (let i = 0; i <= 8; i++) {
                if (P[i] != i + 1) {
                    let nine = P.findIndex(elem => elem == 9);
                    if (i != nine) {
                        swaps++;
                        [P[i], P[nine]] = [P[nine], P[i]];
                    }
                    let num = P.findIndex(elem => elem == i+1);
                    if (i != num) {
                        swaps++;
                        [P[i], P[num]] = [P[num], P[i]];
                    }
                }
            }
            return (node.pathCost + swaps);
            break;

    case 6: // h = number of swaps to solve if you can swap any two tiles
            let switches = 0;
            let B = [...node.state];
            let zeroth = B.findIndex(elem => elem == 0);
            B[zeroth] = 9;
            for (let i = 0; i <= 8; i++) {
                if (B[i] != i+1)
                    {
                        let num = B.findIndex(elem => elem == i+1);
                        [B[i], B[num]] = [B[num], B[i]];
                        switches++;
                    }
            }
            return (node.pathCost+switches);
            break;

    default: return 0;
    }
}

function* expand(puzzle, node, f = 0, depth) {
/* generator function to expand a node, generating the child nodes */
    let s = [...node.state];
    for (let action in puzzle.actions(s)) {                 // 1-3 possible moves
        let s1 = puzzle.result(s, puzzle.actions(s)[action]);   // the new state after we make that move
        let cost = node.pathCost + 1;
        let child = new Node(s1, node, action, cost);
        child.score = heuristic(f, child);
        if (depth != 0 && cost > depth) {
            child = cutoff;
        }
        expanded++;
        yield (child);
    }
}

function pathStates(node) {
/* the sequence of states to get to this node, and some statistics */
    let paths = [node.state];

    if (node.stateStr == "[1,2,3,4,5,6,7,8,0]" ) { // puzzle already solved
         paths = [node.state];
    }
    else {
        while (node.parent != null) {       // trace back parentage
            paths.unshift(node.state);
            node = node.parent;
            //console.log(node);
        }
        paths.unshift(node.state);
    }
    //paths.push(paths.length - 1);
    //paths.push(reached.length);
    //paths.push(expanded);
    return paths;
}


class Queue {
    // a queue that can be a FIFO, LIFO, or priority
    constructor() {
        this.queue = [];
    }
    isEmpty() {                         // returns true only if no nodes in queue
        return (this.queue.length === 0);
    }
    pop() {                             // removes top node from queue and returns it
        return (this.queue.shift());
    }
    add(node) {                                         // inserts node at proper location
        let inserted = false;
        for (let i = 0; i < this.queue.length; i++) {
            if (node.score <= this.queue[i].score) {    // lower scores are better
                this.queue.splice(i, 0, node);          // insertion
                inserted = true;
                break;
            }
        }
        if (!inserted) this.queue.push(node);                      // otherwise stick it in back
    }
}

function bestFirstSearch(puzzle, f = 0, depth = 0) {
/* searches node at front of queue (with lowest f scores) first */
    let node = new Node(puzzle.initial);        // start with the initial puzzle
    let frontier = new Queue;           // a new frontier
    frontier.add(node);                     // put the initial puzzle in the frontier queue
    reached = [puzzle.stateStr];         // array containing states already reached and their scores
    if (puzzle.isGoal(puzzle.initialStr)) {    // check that that the puzzle isn't already solved
        return node;
    }
    while (!frontier.isEmpty()) {
        node = frontier.pop();                              // take the node with the lowest score
        const newNode = expand(puzzle, node, f, depth);               // create newNode to hold what comes out of generator
        for (let action in puzzle.actions(node.state)) {    // generate one node per possible move
            let child = newNode.next().value;               // generate!
            if (puzzle.isGoal(child.stateStr)) {               // finish as soon as we find a winner
                return node;
            }
            if (child != cutoff && reached.indexOf(child.stateStr) == -1) {   // if we haven't been here before
                reached.push(child.stateStr);              // add state to reached
                frontier.add(child);                         // add child to frontier
            }
            else {
                for (let i = 0; i < frontier.length; i++) {
                    if ((child.stateStr == frontier[i].stateStr) && (child.score < frontier[i].score)) {   // found same state, but cheaper path
                        frontier.add(child);
                        break;
                    }
                }
             }
        }
    }
    return cutoff;
}
function breadthBFS(puzzle) {
    return bestFirstSearch(puzzle, 0);
}

function aStarHamming(puzzle) {
    return bestFirstSearch(puzzle, 1);
}

function aStarManhattan(puzzle) {
    return bestFirstSearch(puzzle, 2);
}

function depthBFS(puzzle) {
    return bestFirstSearch(puzzle, 3);
}

function depthLimitedBFS(puzzle, depth=30) {
    return bestFirstSearch(puzzle, 3, depth);
}

function iterativeDeepeningBFS(puzzle) {
    let depth = 1;
    while (true) {
        console.log(depth);
        let result = depthLimitedBFS(puzzle, depth);
        if (result != cutoff)
            {
                return result;
            }
        depth++;
    }
}

function aStarEuclid(puzzle) {
    return bestFirstSearch(puzzle, 4);
}
function aStarNMaxSwap(puzzle) {
    return bestFirstSearch(puzzle, 5);
}

function aStarNSwap(puzzle) {
    return bestFirstSearch(puzzle, 6);
}

export function solver (problem) {
    let puzzle = new Puzzle(problem.slice(0,9));
    switch (problem[9]) {
        case 0: return pathStates(breadthBFS(puzzle));
                break;
        case 1: return pathStates(aStarHamming(puzzle));
                break;
        case 2: return pathStates(aStarManhattan(puzzle));
                break;
        case 3: return pathStates(depthBFS(puzzle));
                break;
        case 4: return pathStates(aStarEuclid(puzzle));
                break;
        case 5: return pathStates(aStarNMaxSwap(puzzle));
                break;
        case 6: return pathStates(aStarNSwap(puzzle));
                break;
        case 7: return pathStates(iterativeDeepeningBFS(puzzle));
                break;
        case 8: return pathStates(depthLimitedBFS(puzzle, problem[10]));
                break;
    }
}

/* sample puzzles named by optimum number of moves

let p0 = ([ 1, 2, 3, 4, 5, 6, 7, 8, 0 ]);
let p1 = ([ 1, 2, 3, 4, 5, 6, 7, 0, 8 ]);
let p2 = ([ 1, 2, 3, 4, 5, 6, 0, 7, 8 ]);
let p3 = ([ 1, 2, 3, 0, 5, 6, 4, 7, 8 ]);
let p4 = ([ 0, 2, 3, 1, 5, 6, 4, 7, 8 ]);
let p7 = ([ 4, 0, 2, 5, 1, 3, 7, 8, 6 ]);
let p20 = ([ 7, 2, 4, 5, 0, 6, 8, 3, 1 ]);
let p23 = ([ 1, 4, 2, 0, 7, 5, 3, 6, 8 ]);
let p31 = ([ 8, 6, 7, 2, 5, 4, 3, 0, 1] );
*/

//console.log(solver([ 4, 0, 2, 5, 1, 3, 7, 8, 6   , 8  , 10  ]));