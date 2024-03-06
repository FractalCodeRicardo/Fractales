class AntSquare {
    x = 0;
    y = 0;

    state;

    constructor(x, y, state) {
        this.x = x;
        this.y = y;
        this.state = state;

    }

    flipColor() {
        if (this.state == STATE_INITIAL || this.state == STATE_WHITE)
            this.state = STATE_BLACK;
        else
            this.state = STATE_WHITE;


    }

}


class Ant {

    currentSquare = {};
    direction = { x: 0, y: 1 }


    constructor(currentSquare) {
        this.currentSquare = currentSquare;
    }

    turnLeft() {
        let nx = this.direction.y * -1;
        let ny = this.direction.x;;

        this.direction.x = nx;
        this.direction.y = ny;
    }

    turnRight() {
        let nx = this.direction.y;
        let ny = this.direction.x * -1;

        this.direction.x = nx;
        this.direction.y = ny;

    }

    move() {

        if (this.currentSquare.state == STATE_WHITE ||
            this.currentSquare.state == STATE_INITIAL)
            this.whiteSquareMove();
        else
            this.blackSquareMove();

    }

    moveForward() {
        let x = this.currentSquare.x + this.direction.x;
        let y = this.currentSquare.y + this.direction.y;
        this.currentSquare = searchSquare(x, y);
    }

    //At a white square, turn 90° right, flip the color of the square, move forward one unit
    whiteSquareMove() {
        this.turnRight();
        this.currentSquare.flipColor();
        this.moveForward();
    }

    //At a black square, turn 90° left, flip the color of the square, move forward one unit
    blackSquareMove() {
        this.turnLeft();
        this.currentSquare.flipColor();
        this.moveForward();
    }

}




let STATE_BLACK = 1;
let STATE_WHITE = 0;
let STATE_INITIAL = 2;

let SIZE = 15;

let squares = createSquares();
let squareCenter = searchSquare(Math.floor(window.innerWidth / SIZE / 2), Math.floor(window.innerHeight / SIZE / 2));
let ant = new Ant(squareCenter);

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    stroke(100);     // Set line drawing color to white
    background(0);
    frameRate(1000);
}

function draw() {

    drawSquares();
    ant.move();

}


let initialDraw = true;
function drawSquares() {

    if (initialDraw) {
        squares.forEach(s => {
            fill(155);
            square(s.x * SIZE, s.y * SIZE, SIZE);
        })

        initialDraw = false;

        return;
    }

    squares.forEach(s => {

        if (s.state != STATE_INITIAL) {

            if (s.state == STATE_BLACK)
                fill(0)
            else
                fill(255);

            square(s.x * SIZE, s.y * SIZE, SIZE);

        }
    });
}


function createSquares() {

    let squares = [];
    for (let y = 0; y < Math.floor(window.innerHeight / SIZE); y++) {
        for (let x = 0; x < Math.floor(window.innerWidth / SIZE); x++) {
            squares.push(new AntSquare(x, y, STATE_INITIAL));
        }
    }
    return squares;

}

function searchSquare(x, y) {
    let xLength = Math.floor(window.innerWidth / SIZE)
    let index = y * xLength + x;

    return squares[index];
}

