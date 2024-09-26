const SIZE = 500;
const SQUARE_SIZE = 50;
const SPEED = 10;

class Simulation {
    constructor() {
        this.square1 = new Agent(
            new Vector((1/4)*SIZE, SIZE/2)
        )
        this.square2 = new Agent(
            new Vector((3/4)*SIZE, SIZE/2)
        )

        this.wall1 = this.createWall1()
        this.wall2 = this.createWall2()

    }

    iterateOverScreen(callback) {
        for (let i = 0; i < SIZE; i += SQUARE_SIZE) {
            for (let j = 0; j < SIZE; j += SQUARE_SIZE) {
                callback(i, j)
            }
        }
    }

    createWall1() {
        let wall = [];
        this.iterateOverScreen((i, j) => {
            if (i < SIZE / 2) {
                wall.push(new Vector(i, j));
            }
        })


        return wall
    }

    createWall2() {
        let wall = [];
        this.iterateOverScreen((i, j) => {
            if (i >= SIZE / 2) {
                wall.push(new Vector(i, j));
            }
        })


        return wall
    }

    iterate() {
        this.detectCollision(this.square1)
        this.detectCollision(this.square2)
        this.detectCollisionWithWall(this.wall2, this.square1)
        this.detectCollisionWithWall(this.wall1, this.square2)
        this.square1.move()
        this.square2.move()
    }

    detectCollision(s) {
        let p = s.position;
        if (p.x + SQUARE_SIZE >= SIZE || p.x <= 0) {
            s.changeXDirection();
        }

        if (p.y + SQUARE_SIZE >= SIZE || p.y <= 0) {
            s.changeYDirection();
        }
    }

    detectCollisionWithWall(wall, square) {

        for (let i = 0; i < wall.length; i++) {
            const p = wall[i];

            if (square.isMovingToRight() && square.crashLeft(p)) {
                this.moveWall(wall, i)
                square.changeXDirection()
                continue
            }

            if (square.isMovingToLeft() && square.crashRight(p)) {
                this.moveWall(wall, i)
                square.changeXDirection()
                continue
            }
        }
    }

    moveWall(wall, index) {
        wall.splice(index, 1)
    }
}

class Agent {
    constructor(position) {
        this.position = position


        this.direction = new Vector(
            Math.random(),
            Math.random()
        )


    }

    move() {
        var dir = this.direction.multiply(SPEED)
        var nextPosition = this.position.plus(dir)
        this.position = nextPosition
    }

    changeXDirection() {
        this.direction = new Vector(
            this.direction.x * -1,
            this.direction.y
        )
    }

    changeYDirection() {
        this.direction = new Vector(
            this.direction.x,
            this.direction.y * -1
        )
    }

    isMovingToRight() {
        return this.direction.x > 0
    }

    isMovingToLeft() {
        return this.direction.x < 0
    }

    crashRight(topLeft) {

        let rightWall = topLeft.x + SQUARE_SIZE
        let leftAgent = this.position.x
        let distance = Math.abs(rightWall - leftAgent)

        if (leftAgent < rightWall &&
            distance < SQUARE_SIZE &&
            this.betweenYPoints(topLeft)) {
            return true
        }

        return false;

    }

    crashLeft(topLeft) {

        let leftWall = topLeft.x
        let rightAgent = this.position.x + SQUARE_SIZE
        let distance = Math.abs(rightAgent - leftWall)

        if (leftWall < rightAgent &&
            distance < SQUARE_SIZE &&
            this.betweenYPoints(topLeft)) {
            return true
        }

        return false;

    }

    betweenYPoints(v) {
        let topWall = v.y
        let bottomWall = v.y + SQUARE_SIZE

        let topAgent = this.position.y
        let bottomAgent = this.position.y + SQUARE_SIZE


        return (bottomWall >= topAgent && topAgent >= topWall) ||
            (bottomWall >= bottomAgent && bottomAgent >= topWall)
    }

}

class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    plus(v) {
        return new Vector(
            this.x + v.x,
            this.y + v.y
        )
    }

    multiply(s) {
        return new Vector(
            this.x * s,
            this.y * s
        )
    }
}

const simulation = new Simulation();

function setup() {
    createCanvas(SIZE, SIZE);
}

function draw() {
    background(220);
    simulation.iterate();
    drawSimulation();
}

function drawSimulation() {

    drawWall(simulation.wall1, color(193, 0, 196))
    drawWall(simulation.wall2, color(18, 199, 27))

    drawSquare(simulation.square1.position, color(193, 0, 196))
    drawSquare(simulation.square2.position, color(18, 199, 27))
}

function drawSquare(s, c) {
    fill(c)
    square(s.x, s.y, SQUARE_SIZE)
}

function drawWall(wall, color) {
    wall.forEach(i => {
        fill(color)
        square(i.x, i.y, SQUARE_SIZE)
    })
}