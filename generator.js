var canvas = document.querySelector(".main canvas.maze")
var context = canvas.getContext("2d", {
    willReadFrequently: true
})

var allowed = null

function fillColor(x,y,color) {
    context.fillStyle = color
    context.fillRect(x,y,1,1)
    allowed[`${x}-${y}`] = true
}


const directions = [
    [-1, 0],  // up
    [0, -1],  // left
    [1, 0],   // down
    [0, 1]    // right
];

let stack = null
var gridSize = null
let visited = null

function isInBounds(x, y) {
    return x >= 0 && x < gridSize && y >= 0 && y < gridSize;
}

function isCellOK(x, y) {
    return isInBounds(x, y) && !visited[x][y];
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function stepDraw(cur_x, cur_y) {
    visited[cur_x][cur_y] = true;
    fillColor(cur_x * 2, cur_y * 2, "white");

    const shuffledDirections = shuffleArray([...directions]);

    for (let dir of shuffledDirections) {
        const [move_x, move_y] = dir;
        const next_x = cur_x + move_x;
        const next_y = cur_y + move_y;

        if (isCellOK(next_x, next_y)) {
            fillColor((cur_x * 2 + next_x * 2) / 2, (cur_y * 2 + next_y * 2) / 2, "white");
            stepDraw(next_x, next_y);
        }
    }

    if (stack.length > 0) {
        const { x, y } = stack.pop();
        stepDraw(x, y);
    }
}

function generateMaze() {
    context.clearRect(0,0,50,50)
    allowed = {};
    stack = [];
    gridSize = (canvas.getAttribute("width")/2)+1;
    visited = Array.from({ length: gridSize }, () => Array(gridSize).fill(false));
    stack.push({ x: 0, y: 0 });
    stepDraw(0, 0);
}


window.addEventListener("giveMeCell",(e)=>{
    window.cellFree = !allowed[`${e.detail.x}-${e.detail.y}`]
})

window.addEventListener("restart",(e)=>{
    generateMaze();
})