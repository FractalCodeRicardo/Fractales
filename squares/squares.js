const SIZE = 500;
const SQUARE_SIZE = 50;
const SPEED = 10;

class Simulation {
    constructor() {
        this.square1 = new Agent()
        this.square2 = new Agent()

        this.wall = this.createWall()

    }

    createWall() {
        let wall = [];
        for (let i = 0; i < SIZE; i += SQUARE_SIZE) {
            wall.push(new Vector(
                SIZE / 2,
                i
            ))
        }

        return wall
    }

    iterate() {
        this.detectCollision(this.square1)
        this.detectCollision(this.square2)
        this.detectCollisionWithWall(this.square1)
        this.detectCollisionWithWall(this.square2)
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

    detectCollisionWithWall(s) {

        for (let i = 0; i < this.wall.length; i++) {
            const p = this.wall[i];

            if (s.isMovingToRight() && s.crashLeft(p)) {
                this.moveWall(i, 1)
                s.changeXDirection()
            }

            if (s.isMovingToLeft() && s.crashRight(p)) {
                this.moveWall(i, -1)
                s.changeXDirection()
            }
            
        }


    }

    moveWall(index, x) {
        let item = this.wall[index]
        this.wall[index] = new Vector(item.x + (x * SQUARE_SIZE), item.y)
    }


}
class Agent {
    constructor() {
        this.position = new Vector(
            Math.random() * SIZE,
            Math.random() * SIZE
        )


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

    chashRight() {

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
    drawSquare(simulation.square1.position)
    drawSquare(simulation.square2.position)
    drawWall(simulation.wall)
}

function drawSquare(s) {
    square(s.x, s.y, SQUARE_SIZE)
}

function drawWall(wall) {
    wall.forEach(i => {
        square(i.x, i.y, SQUARE_SIZE)
    })
}