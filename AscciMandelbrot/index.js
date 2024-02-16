const size = 2;
const step = 0.1;
const maxIterations = 100;

function setup() {

    createCanvas(screenSize(), screenSize());
}

function draw() {
    textSize(20)
    stroke("cyan")
    background(0);
    var points = getPoints();
    drawPoints(points)
}

function screenSize() {
    return Math.min(windowWidth, windowHeight)
}

function drawPoints(points) {
    for (var p of points) {
        drawPoint(p);
    }
}

function drawPoint(p) {
    let sSize = screenSize();
    let scale = sSize / size;
    let cx = sSize / 2;
    let cy = sSize / 2;
    let x = p.x * scale + cx;
    let y = cy - p.y * scale;
    text("( ͡° ͜ʖ ͡°)", x, y);
}

function getPoints() {
    let points = [];
    for (let x = size * -1; x <= size; x += step) {
        for (let y = size * -1; y <= size; y += step) {
            if (isMandelbrot(x, y)) {
                points.push({ x: x, y: y })
            }
        }
    }

    return points;
}

function isMandelbrot(x, y) {
    // iterate zn = zn^2 + c
    // zn is a complex number and c is (x,y)
    // check if distance of zn > size, if true is not part of the set

    let i = 0;
    let zn = {r:0, i:0}
    let c = {r:x, i:y}
    while (i < maxIterations) {

        let zn2 = pow2(zn)
        zn = sum(zn2, c)

        if (outOfBounds(zn)) {
            return false;
        }

        i++;
    }


    return true;

}

function pow2(z) {
    // (a + ib) (c + id) = ac + iad + ibc + i2bd
    // (a + b) (a +b ) = a² + iab + iba + (-1)b²

    let a2 = z.r * z.r;
    let ab = z.r * z.i;
    let b2 = z.i * z.i;

    return {
        r: a2 - b2,
        i: 2 * ab
    }
}

function sum(z, c) {
    return {
        r: z.r + c.r,
        i: z.i + c.i
    }
}

function outOfBounds(z) {
    return Math.sqrt(z.r * z.r + z.i * z.i) >
        Math.sqrt(size * size + size * size)
}

