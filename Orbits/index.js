class Orbit {

    angle = 0;
    center;
    a;
    b;
    angleIncrement;
    color;

    constructor(center, a, b) {
        this.center = center;
        this.a = a;
        this.b = b;
        this.angleIncrement = 0.1;
        this.color = { r: 0, g: 0, b: 0 }
    }

    getRatio() {
        let ab = this.a * this.b;

        let bCos = Math.cos(this.angle) * this.b;
        let aSin = Math.sin(this.angle) * this.a;

        let bCos2 = Math.pow(bCos, 2);
        let aSin2 = Math.pow(aSin, 2);

        let r = ab / Math.sqrt(bCos2 + aSin2);

        return r;
    }

    getX() {
        let r = this.getRatio();
        let x = r * Math.cos(this.angle);
        x = x + this.center.x;

        return x;
    }

    getY() {
        let r = this.getRatio();
        let y = r * Math.sin(this.angle);
        y = y + this.center.y;

        return y;
    }

}

var center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
var numberOrbits = 200;
var angleIncrement = 0.001;
var sizePlanet = 10;
var color1 = 'cyan';
var color2 = 'yellow';
var orbits = createOrbits();

function createOrbits() {

    var distanceX = 100;
    var distanceY = 200;
    var orbits = [];
    var angle = 0;
    for (let i = 0; i < numberOrbits; i++) {

        let orbit1 = new Orbit(center, distanceX, distanceY);
        orbit1.angleIncrement = angle;
        orbit1.color = color1;
        orbits.push(orbit1);

        let orbit2 = new Orbit(center, distanceY, distanceX);
        orbit2.angleIncrement = angle;
        orbit2.color = color2;
        orbits.push(orbit2);

        distanceX += 1;
        distanceY += 1;
        angle += - angleIncrement;
    }

    return orbits;
}

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    // Set line drawing color to white
    background(0);
    frameRate(30);
}



function draw() {
    background(0);
    drawOrbits();

}


function drawOrbits() {
    for (var i in orbits) {
        var orbit = orbits[i];
        orbit.angle += orbit.angleIncrement;

        let x = orbit.getX();
        let y = orbit.getY();
        fill(orbit.color);
        stroke(orbit.color);
        circle(x, y, sizePlanet);
    }
}
