class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Drawable {
    draw() {};
}

class Scenery extends Drawable {
    constructor(p5) {
        super();
        this.p5 = p5;

        this.racket = new Racket(p5, this);
        this.ball = new Ball(p5, this);
        
        this.location = new Point(10, 10);
        this.width = 500;
        this.height = 500;
    }

    draw() {
        this.p5.fill(0);
        this.p5.rect(this.location.x, this.location.y, this.width, this.height);

        this.racket.draw();
        this.ball.draw();
    }

    keyPressed(keyCode) {
        this.racket.keyPressed(keyCode);
    }

    crashingWithUpperBound(y) {
        return y <= this.location.y; 
    }

    crashingWithLowerBound(y) {
        return y >= this.location.y + this.height;
    }

    crashingWithLeftBound(x) {
        return x <= this.location.x; 
    }

    crashingWithRightBound(x) {
        return x >= this.location.x + this.width;
    }
}

class Racket extends Drawable {
    constructor(p5, scenery) {
        super();
        this.p5 = p5;
        this.scenery = scenery;

        this.width = 5;
        this.height = 200;
        this.location = new Point(50, 50);
        this.velocity = 3;
    }

    keyPressed(keyCode) {     
        if (keyCode == UP_ARROW) this.up();
        if (keyCode == DOWN_ARROW) this.down();
    }

    down() {
        let newLocation = new Point(this.location.x, this.location.y + this.velocity);
        
        if (this.scenery.crashingWithLowerBound(newLocation.y + this.height)) {
            return;
        }

        this.location = newLocation;
    }

    up() {
        let newLocation = new Point(this.location.x, this.location.y - this.velocity);

        if (this.scenery.crashingWithUpperBound(newLocation.y)) {
            return;
        }

        this.location = newLocation; 
    }

    draw() {
        this.p5.rect(this.location.x, this.location.y, this.width, this.height);
    }

    crashingWithLeftBound(x) {
        return x <= this.location.x + this.width; 
    }

    crashingWithRightBound(x) {
        return x >= this.location.x;
    }

    pointsInsideVerticalBounds(y1, y2) {
        return this.location.y <= y1 && y1 <= this.location.y + this.height
        && this.location.y <= y2 && y2 <= this.location.y + this.height;
    }
}

class Ball extends Drawable{

    constructor(p5, scenery) {
        super();
        this.p5 = p5;
        this.scenery = scenery;
        this.location = new Point(65, 150);
        this.speed = new Point(5, 1);
        this.width = 10;
    }

    update() {
        this.location.x = this.location.x + this.speed.x;
        this.location.y = this.location.y + this.speed.y;
    }

    crashWithVerticalSceneryBounds() {
        let rightBound = this.location.x + this.width;
        let leftBound = this.location.x - this.width;
        let scenery = this.scenery;

        if (scenery.crashingWithLeftBound(leftBound)) return true;
        if (scenery.crashingWithRightBound(rightBound)) return true;

        return false;
    }

    crashWithHorizontalSceneryBounds() {
        let lowerBound = this.location.y + this.width;
        let upperBound = this.location.y - this.width;
        let scenery = this.scenery;

        if (scenery.crashingWithLowerBound(lowerBound)) return true;
        if (scenery.crashingWithUpperBound(upperBound)) return true;

        return false;
    }

    crashWithVerticalRacketBounds() {
        let rightBound = this.location.x + this.width;
        let leftBound = this.location.x - this.width;
        let xSpeed = this.speed.x;
        let racket = this.scenery.racket;
        let insideRacketBounds = racket.pointsInsideVerticalBounds(this.location.y + this.width, this.location.y - this.width);

        if (xSpeed < 0 && insideRacketBounds && racket.crashingWithLeftBound(leftBound)) return true;
        if (xSpeed > 0 && insideRacketBounds && racket.crashingWithLeftBound(rightBound)) return true;

        return false;
    }

    changeXSpeedNeeded() {
        if (this.crashWithVerticalSceneryBounds()) return true;
        if (this.crashWithVerticalRacketBounds()) return true;

        return false;
    }

    changeYSpeedNeeded() {
        if (this.crashWithHorizontalSceneryBounds()) return true;

        return false;
    }

    changeSpeed() {
        if (this.changeXSpeedNeeded()) {
            this.speed.x = this.speed.x * -1;
        }

        if (this.changeYSpeedNeeded()) {
            this.speed.y = this.speed.y * -1;
        }
    }

    draw() {
        this.changeSpeed();
        this.update();
        this.p5.ellipse(this.location.x, this.location.y, this.width)
    }

}

let scenery = new Scenery(window);

function draw() {

    if (keyIsPressed){
        scenery.keyPressed(keyCode);
    }

    scenery.draw();
}

function keyPressed() {
    scenery.keyPressed(keyCode)
}

function setup() {
	createCanvas(window.innerWidth, window.innerHeight);
	stroke(255);     
    strokeWeight(2)
	background(0);
    //frameRate(10);
}


