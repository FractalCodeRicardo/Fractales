let board = [[]];
let boardSize = 50;
let boxSize = 5;
let cameraPosition = { x: 0, y: 300, z: 100 };
let framerate = 20;
let currentFrame = 0;
let initialAlives = 100;
function setup() {
  initBoard();
  createCanvas(this.windowWidth, this.windowHeight, WEBGL);
  camera(
    cameraPosition.x,
    cameraPosition.y,
    cameraPosition.z,
    0,
    0,
    0,
    0,
    1,
    0,
  );
  describe("a white box rotating in 3D space");
}

function draw() {
  background(200);
  //  rotateX(frameCount * 0.01);
  // rotateY(frameCount * 0.01);

  currentFrame++;

  if (currentFrame == framerate) {
    applyRules();
    currentFrame = 0;
  }

  drawBoard();
}

function eachCellOnBoard(callback) {
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[i].length; j++) {
      callback(i, j);
    }
  }
}

function drawBoard() {
  eachCellOnBoard((i, j) => {
    let cell = board[i][j];
    if (cell == 1) {
      drawBox(i, j);
    }
  });
}

function drawBox(x, y) {
  push();
  y = y * boxSize + boxSize / 2;
  x = x * boxSize + boxSize / 2;
  translate(x, y, 0);
  box(boxSize - 1);
  pop();
}

function initBoard() {
  var countAlives = 0;
  var i = 0;
  board = [];
  while (i < boardSize) {
    board.push([]);

    var j = 0;
    while (j < boardSize) {
      var r = Math.random();
      var one = r > 0.5 ? 1 : 0;

      if (countAlives == initialAlives) {
        one = 0;
      }

      if (one == 1) {
        countAlives++;
      }

      board[i].push(one);
      j++;
    }
    i++;
  }
}

function applyRules() {
  eachCellOnBoard((i, j) => {
    var neighbours = getNeighbours(i, j);

    var cell = board[i][j];
    var liveDead = 0;
    if (cell == 1) {
      liveDead = liveRules(neighbours);
    } else {
      liveDead = deadRules(neighbours);
    }

    board[i][j] = liveDead;
  });
}

function liveRules(neighbours) {
  var liveNeighbours = neighbours.filter((i) => i == 1).length;

  if (liveNeighbours < 2) {
    return 0;
  }

  if (liveNeighbours == 2 || liveNeighbours == 3) {
    return 1;
  }

  return 0;
}

function deadRules(neighbours) {
  var liveNeighbours = neighbours.filter((i) => i == 1).length;

  if (liveNeighbours == 3) {
    return 1;
  }

  return 0;
}

function getNeighbours(x, y) {
  var neighbours = [];
  for (var i = -1; i < 2; i++) {
    for (var j = -1; j < 2; j++) {
      if (i == 0 && j == 0) {
        continue;
      }
      if (
        x + i >= 0 &&
        y + j >= 0 &&
        x + i < board.length &&
        y + j < board[0].length
      ) {
        neighbours.push(board[x + i][y + j]);
      }
    }
  }
  return neighbours;
}
