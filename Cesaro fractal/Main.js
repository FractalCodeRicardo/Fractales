
var lines = [];
var center = new Vector(window.innerWidth / 2, window.innerHeight / 2);

var params = getParameters();
var paramIteration = 0;
var linesIteration = 0;
var currentParam = params[0];


function setup() {
	createCanvas(window.innerWidth, window.innerHeight);
	stroke(255);     // Set line drawing color to white
	//frameRate(1);
	background(0);
}

function IncreaseIteration() {
	if (linesIteration >= currentParam.maxIteration) {

		linesIteration = 0;

		if (paramIteration >= params.length - 1)
			paramIteration = 0;
		else
			paramIteration++;
	}

	currentParam = params[paramIteration];

	if (linesIteration == 0)
		InitializeLines()
}

function draw() {

	IncreaseIteration()

	clear();
	background(0);

	for (var i = 0; i < lines.length; i++) {
		drawLine(lines[i]);
	}

	lines = getNewLinesArray(lines);
	linesIteration++;
}

function InitializeLines() {
	var pol = new Polygon(center, currentParam.sizePolygon, 250);
	lines = pol.getLines();
}


function drawLine(l) {
	var color = getProportionalColor(l.level);
	stroke(color.r, color.g, color.b);
	line(l.p1.x, l.p1.y, l.p2.x, l.p2.y);
}

function Vector(x, y) {
	this.x = x;
	this.y = y;

	var self = this;

	this.sum = function (v) {
		var x = self.x + v.x;
		var y = self.y + v.y;

		return new Vector(x, y);
	}

	this.sumScalar = function (a) {
		var x = self.x + a;
		var y = self.y + a;

		return new Vector(x, y);
	}

	this.subtract = function (v) {
		var v1 = v.scalarProduct(-1);
		return self.sum(v1);
	}

	this.scalarProduct = function (a) {
		var x = self.x * a;
		var y = self.y * a;

		return new Vector(x, y);
	}

	this.module = function () {
		var x = self.x * self.x;
		var y = self.y * self.y;

		return Math.sqrt(x + y);
	}

	this.unitVector = function () {
		var m = self.module()
		var x = self.x / m;
		var y = self.y / m;

		return new Vector(x, y);
	}
}

function Line(p1, p2, level) {

	this.p1 = p1;
	this.p2 = p2;
	this.level = level ? level : 0;

	var self = this;


	this.magnitude = function () {
		var x2 = Math.pow(self.p2.x - self.p1.x, 2);
		var y2 = Math.pow(self.p2.y - self.p1.y, 2);
		return Math.sqrt(x2 + y2);
	}


	this.center = function () {
		var x = (self.p1.x + self.p2.x) / 2;
		var y = (self.p1.y + self.p2.y) / 2;

		return new Vector(x, y);
	}
}

function getNewLinesArray(lineArray) {
	var a = [];
	for (var i = 0; i < lineArray.length; i++) {
		var t = getNewLines(lineArray[i]);
		Array.prototype.push.apply(a, t);
	}
	return a;
}

function getNewLines(line) {
	var m = line.magnitude();


	var p1 = line.p1;

	var direction = line.p2.subtract(line.p1).unitVector();
	var p2 = p1.sum(direction.scalarProduct(m * currentParam.paralelProportion));
	var p3 = line.p2.sum(direction.scalarProduct(m * currentParam.paralelProportion * -1));
	var p4 = line.p2;

	//vector to origin
	var t = line.p2.subtract(line.p1).unitVector();

	//ortogonal vector
	var ov = new Vector(t.y * -1, t.x);

	//translate to center
	var center = line.center();
	var p5 = ov.scalarProduct(m * currentParam.perpendicularProportion).sum(center);

	var lines = [];

	lines.push(new Line(p1, p2, line.level));
	lines.push(new Line(p3, p4, line.level));
	lines.push(new Line(p2, p5, line.level + 1));
	lines.push(new Line(p5, p3, line.level + 1));

	return lines;
}


function Polygon(center, numberSides, ratio) {
	this.center = center;
	this.numberSides = numberSides;
	this.ratio = ratio;

	this.getLines = function () {

		var angle = Math.PI * 2 / numberSides;
		var points = [];
		for (var i = Math.PI * 0.5; i <= Math.PI * 2.5; i = i + angle) {
			var p = new Vector(Math.cos(i) * ratio, Math.sin(i) * ratio);
			p = p.sum(center);
			points.push(p);
		}


		var lines = [];
		var j = 0;
		for (var i = 1; i < points.length; i++) {
			lines.push(new Line(points[j], points[i]));
			j++;
		}

		return lines;

	}

}

function getProportionalColor(level) {
	var r = getProportion(currentParam.minColor.r,
		currentParam.maxColor.r,
		level,
		currentParam.maxIteration);

	var g = getProportion(currentParam.minColor.g,
		currentParam.maxColor.g,
		level,
		currentParam.maxIteration);

	var b = getProportion(currentParam.minColor.b,
		currentParam.maxColor.b,
		level,
		currentParam.maxIteration);

	return { r: r, g: g, b: b }
}

function getProportion(min, max, level, maxLevel) {
	var dif = max - min;
	var prop = dif / maxLevel;

	return level * prop + min;
}


