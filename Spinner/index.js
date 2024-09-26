class Figure {
    getPoints() { 
        return [];
    }
}

class Nthgram extends Figure {
    constructor(angle, radius) {
        super();
        this.angle = angle;
        this.radius = radius;
    }

    getPoints() {

        let vertexes = [];
        let currentAngle = 0;
        let points = [];
        let yCenter = window.innerHeight / 2;
        let xCenter = window.innerWidth / 2 + this.radius;
        while (currentAngle < 360) {
            let radians = currentAngle * (Math.PI / 180);
            let x = this.radius * Math.cos(radians) + xCenter;
            let y = this.radius * Math.sin(radians) + yCenter;

            vertexes.push({x: x, y: y});
            currentAngle += this.angle;
        }

        for (let i = 0; i < vertexes.length -1; i++) {
            let p1= vertexes[i];
            let p2= vertexes[i + 1];
            let newPoints = this.getPointsLine(p1, p2);

            points.push(... newPoints);
        }


        let finalPoints = this.getPointsLine(vertexes[vertexes.length -1], vertexes[0]);
        points.push(...finalPoints);

        return points;
    }

    getDistance(p1, p2) {
        return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    }

    getPointsLine(p1, p2) {
        let a = p2.y - p1.y;
        let b = p1.x - p2.x;
        let c = a * p1.x + b * p1.y;
        let points = [];
        let x = p1.x;
        let i = 0;
        while ( i < 1000) {
            let y = (c - (a*x)) / b;
            let p = {x: x, y: y}
            let direction = p2.x > p1.x ? 1 : -1;
            x += 1 * direction;
            if (this.getDistance(p, p2) < 5) {
                break;
            }

            i++;
            points.push(p);
        }

        return points;
    }

}

class AngleLines extends Figure {
    
    constructor(angle) {
        super();
        this.angle = angle;
    }

    getLines() {

        let currentAngle = 0
        let increment = 1;
        let lines = [];
        let yCenter = window.innerHeight / 2;
        let xCenter = window.innerWidth / 2;

        while (currentAngle < 360) {
            lines.push([{x: xCenter, y: yCenter}]);
            currentAngle += this.angle;
        }

        for (let j = 0; j < 200; j++) {

            let i = 0;
            currentAngle = 0;
            while (currentAngle < 360) {

                let radians = currentAngle * (Math.PI / 180);
                let x = increment * Math.cos(radians);
                let y = increment * Math.sin(radians);
    
                let line = lines[i];
                let lastPoint = line[line.length - 1];
                let newPoint = {x: lastPoint.x + x, y: lastPoint.y + y}

                line.push(newPoint); 
    
                currentAngle += this.angle;
                i++;
            }
                
        }

        return lines;
        
    }
}

class OneLine extends Figure {
    getLines() {
        let angleLine = new AngleLines(360);
        return angleLine.getLines();
    }
}

class TwoLines extends Figure {
    getLines() {
        let angleLine = new AngleLines(180);
        return angleLine.getLines();
    }
}

class FourLines extends Figure {
    getLines() {
        let angleLine = new AngleLines(90);
        return angleLine.getLines();
    }
}

class Circle extends Figure {

    constructor() {
        super();
    }
    
    getPoints() {
        let points = [];

        let yCenter = window.innerHeight / 2;
        let xCenter = (window.innerWidth / 2) + 50;
        let x, y, angle = 0;
        let r = 50;
        
        while(angle < Math.PI *2) {
    
            x = r * Math.cos(angle);
            y = r * Math.sin(angle);

            y += yCenter;
            x += xCenter + r;

            angle += 0.01;

            points.push({x: x, y: y})
        }

    
        return points;
    }
}

class Rose extends Figure {
    
    getPoints() {
        let yCenter = window.innerHeight / 2;
        let xCenter = window.innerWidth / 2;
        let x, y, angle = 0;
        let r = 0;
        let points = [];
        let p=1, q=1
        while(angle < Math.PI *8) {
    
            r = Math.cos((p/q) * angle) * 50;

            x = r * Math.cos(angle);
            y = r * Math.sin(angle);

            y += yCenter;
            x += xCenter + r;

            angle += 0.1;

            points.push({x: x, y: y})
        }
    
        return points;
    }
}

var points = [];
var iteration = 0;
var currentFigure = null;
var angle = 0;
var finalAngle = 2 * Math.PI;
var incrementRotationAngle = 0.2;
var colors = [
    [204, 102, 255],
    [255, 102, 102],
    [255, 153, 51],
    [255, 255, 102],
    [153, 255, 51],
    [0, 255, 0],
    [0, 255, 255],
    [51, 153, 255],
    [153, 51, 255]
];

var figures = [
]

for (let i = 3; i <= 10; i++){
    figures.push(new Nthgram(360/i, 100));
}

function setup() {
	createCanvas(window.innerWidth, window.innerHeight);
	stroke(255);     
    strokeWeight(2)
	background(0);
    //frameRate(10);
}

function draw() {
    background(0);
    iterate();
    drawFigure();
}

function changeColor(colorIndex) {
    if (colorIndex == colors.length) {
        colorIndex = 0;
    }

    let color = colors[colorIndex];
    stroke(color[0], color[1], color[2]); //RGB

    colorIndex += 1;

    return colorIndex;
}


function drawFigure() {
    let iColor = 0;
    
    for (let i = 0; i < points.length - 1; i++) {

        let p1 = points[i];
        let p2 = points[i + 1];

        iColor = changeColor(iColor);
        line(p1.x, p1.y, p2.x, p2.y);
    }
}

function rotatePoints(points) {
    points.forEach((p, i) => {
        points[i] = rotatePoint(p, angle)
    })
}

function isFirstIteration() {
    return currentFigure == null && figures.length
}

function figureHasFinish() {
    if (currentFigure == null) return false;

    return angle > finalAngle;
}

function nextFigure() {
    currentFigure = figures.shift();
    points = [];
    iteration = 0;
}

function iterate() {
    if (isFirstIteration()) {
        nextFigure()
    }

    if (figureHasFinish() && figures.length) {
        nextFigure()
    }

    let newPoints = currentFigure.getPoints();
    rotatePoints(newPoints);
    points.push(... newPoints);
    angle += incrementRotationAngle;
    iteration ++;
}

function rotatePoint(point, angle) {
    let tx  = point.x - window.innerWidth / 2; 
    let ty = point.y - window.innerHeight / 2;

    x = tx * Math.cos(angle) - ty * Math.sin(angle);
    y = ty * Math.cos(angle) + tx * Math.sin(angle);

    x = x + window.innerWidth / 2; 
    y = y + window.innerHeight / 2;

    return {
        x: x,
        y: y
    }
}


