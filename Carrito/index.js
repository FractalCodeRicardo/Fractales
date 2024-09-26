var highWayLines = createLines();
var carSize = 5;
var currentPoint = { x: 80, y: 50 };
var currentDirection = { x: 0.5, y: 0.5 };
var speed = 3;

function setup() {
	createCanvas(window.innerWidth, window.innerHeight);
	stroke(255);     // Set line drawing color to white
	frameRate(1000000000000);
	background(0);
}

function draw() {

	background(0);

	for (var i = 0; i < highWayLines.length; i++) {
		var l = highWayLines[i];
		line(l.x1, window.innerHeight - l.y1, l.x2, window.innerHeight - l.y2);
	}

	ellipse(currentPoint.x, window.innerHeight - currentPoint.y, carSize, carSize);

	var crashPoint = getIntersectionPoint();

	if (crashPoint) {
		stroke('red');
		ellipse(crashPoint.x, window.innerHeight - crashPoint.y, 3, 3);
	}

	stroke(255);

	nextPoint(crashPoint);
}

function nextPoint(crashPoint) {
	if (crashPoint != null) {
		var d = distance(crashPoint, currentPoint) < 15;

		if (d) {
			currentDirection = randomVector();
			return;
		}

	}

	currentPoint.x = currentPoint.x + currentDirection.x * speed;
	currentPoint.y = currentPoint.y + currentDirection.y * speed;
}

function randomVector() {
	var x = Math.random() * 10 * (Math.random() < 0.5 ? -1 : 1);
	var y = Math.random() * 10 * (Math.random() < 0.5 ? -1 : 1);

	return normaliceVector({ x: x, y: y });
}

function rotateVector(x, y, angle) {
	var rad = (angle * Math.PI) / 180;

	var xr = x * Math.cos(rad) - y * Math.sin(rad);
	var yr = x * Math.sin(rad) + y * Math.cos(rad);

	return { x: xr, y: yr };
}

function distance(v, w) {
	var d = { x: v.x - w.x, y: v.y - w.y };
	return module(d);
}

function createLines() {
	var ls = [];
	var w = window.innerWidth;
	var h = window.innerHeight;

	var offsetSmall = 30;
	var offsetBig = 100;

	ls.push({ x1: offsetSmall, y1: h - offsetSmall, x2: w - offsetSmall, y2: h - offsetSmall });
	ls.push({ x1: w - offsetSmall, y1: offsetSmall, x2: w - offsetSmall, y2: h - offsetSmall });
	ls.push({ x1: offsetSmall, y1: offsetSmall, x2: w - offsetSmall, y2: offsetSmall });
	ls.push({ x2: offsetSmall, y2: h - offsetSmall, x1: offsetSmall, y1: offsetSmall });

	ls.push({ x1: offsetBig, y1: h - offsetBig, x2: w - offsetBig, y2: h - offsetBig });
	ls.push({ x1: w - offsetBig, y1: offsetBig, x2: w - offsetBig, y2: h - offsetBig });
	ls.push({ x1: offsetBig, y1: offsetBig, x2: w - offsetBig, y2: offsetBig });
	ls.push({ x2: offsetBig, y2: h - offsetBig, x1: offsetBig, y1: offsetBig });

	return ls;
}

function getIntersectionPoint() {
	var closeCrashPoint = null;

	for (var i = 0; i < highWayLines.length; i++) {
		var line = highWayLines[i];
		var pointCrash = intersectLines(line);

		if (pointCrash != null)
			if (closeCrashPoint == null)
				closeCrashPoint = pointCrash;
			else
				closeCrashPoint = minDistance(closeCrashPoint, pointCrash);

	}

	return closeCrashPoint;
}

function minDistance(p1, p2) {
	var d1 = distance(currentPoint, p1);
	var d2 = distance(currentPoint, p2);

	if (d1 < d2)
		return p1;
	else
		return p2;
}


function intersectLines(line) {

	var dir = {
		x: currentPoint.x + currentDirection.x,
		y: currentPoint.y + currentDirection.y
	};
	var dist = distancePointLine(dir, line);

	var max = 0;

	while (true && max++ < 1500) {

		dir = {
			x: dir.x + currentDirection.x,
			y: dir.y + currentDirection.y
		};
		var nDist = distancePointLine(dir, line);

		if (dist < 0.8)
			return dir;

		if (dist < nDist)
			return null;
		else
			dist = nDist;

	}

	return null;

}


function module(v) {
	return Math.sqrt(v.x * v.x + v.y * v.y)
}

function normaliceVector(v) {
	var m = module(v);

	return { x: v.x / m, y: v.y / m };
}

function dotProduct(v, w) {
	return v.x * w.x;
}




function distancePointLine(point, line) {
	var max = 10000;
	//Point is outside bounds

	//horizontal line
	if (line.y2 - line.y1 == 0) {
		if (Math.abs(point.y - line.y1) <= 0.8 && (point.x < line.x1 || point.x > line.x2))
			return max;

		return Math.abs(line.y1 - point.y)
	}

	// vertical line
	if (line.x2 - line.x1 == 0) {
		if (Math.abs(point.x - line.x1) <= 0.8 && (point.y > line.y2 || point.y < line.y1))
			return max;

		return Math.abs(line.x1 - point.x)
	}


	var m = (line.y2 - line.y1) / (line.x2 - line.x1);

	var r = m * point.x - m * line.x1 - point.y + line.y1;

	return Math.abs(r);
}

