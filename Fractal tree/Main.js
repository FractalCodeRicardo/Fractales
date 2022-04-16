

var index = 0;
var currenTree;
var buffer = 1000;

function setup() {
	createCanvas(window.innerWidth, window.innerHeight);

	stroke(255);     // Set line drawing color to white
	//frameRate(100000000);
	background(0);
}

function draw() {


	if (!currenTree || index >= currenTree.branches.length) {
		currenTree = createRandomTree();
		delay(2000);
		index = 0
		background(0);
	}

	drawBranches(currenTree.parameters, currenTree.branches);

}

function drawBranches(params, branches) {
	for (var i = 0; i < buffer; i++) {

		if (index >= branches.length)
			break;

		var t = branches[index];
		strokeWeight(params.getStrokeWeight(t.level));
		var color = params.getColor(t.level);
		stroke(color.r, color.g, color.b);
		var p1 = toScreenCoordinates(t.p1);
		var p2 = toScreenCoordinates(t.p2);

		line(p1.x, p1.y, p2.x, p2.y);

		index++;
	}
}

function toScreenCoordinates(p) {
	var centerx = (window.innerWidth) / 2;
	var scaleX = 1;
	var scaleY = 1;

	var x = p.x * scaleX;
	var y = p.y * scaleY;

	return { x: x, y: y };
}

function createRandomTree() {
	var param = new RandomParameter(getCenter());
	var tree = new Tree(param);
	return tree;
}

function toRadians(angle) {
	return angle * Math.PI / 180.0;
}

function RandomParameter(initialPoint, angles) {
	this.initialPoint = initialPoint ? initialPoint : getRandomPoint();
	this.angles = angles ? angles : getRandomAngles();

	this.proportion = getRandomProportion();

	this.initialDistance = 150;

	this.level = getRandomLevel();

	this.firstColor = getFirstRandomColor();
	this.lastColor = getLastRandomColor();

	var self = this;

	this.getStrokeWeight = function (currentLevel) {
		return 0.1 + (self.level * self.proportion) - (self.proportion * currentLevel)
	}

	this.getColor = function (currentLevel) {

		var rp = (self.lastColor.r - self.firstColor.r) / self.level;
		var gp = (self.lastColor.g - self.firstColor.g) / self.level;
		var bp = (self.lastColor.b - self.firstColor.b) / self.level;

		return {
			r: self.firstColor.r + (rp * (currentLevel)),
			g: self.firstColor.g + (gp * (currentLevel)),
			b: self.firstColor.b + (bp * (currentLevel))
		}
	}

	this.getLineDistance = function (currentLevel) {
		return Math.pow(self.proportion, currentLevel - 1) * self.initialDistance;
	}

}

function getFirstRandomColor() {
	var colors = [{ r: 73, g: 27, b: 135 },
	{ r: 0, g: 2, b: 153 },
	{ r: 153, g: 0, b: 0 },
	{ r: 107, g: 0, b: 153 },
	{ r: 0, g: 33, b: 0 }];


	return getRandomElement(colors);
}

function getLastRandomColor() {

	var colors = [{ r: 66, g: 244, b: 86 },
	{ r: 153, g: 255, b: 175 },
	{ r: 153, g: 255, b: 255 },
	{ r: 255, g: 164, b: 153 },
	{ r: 236, g: 153, b: 255 }];

	return getRandomElement(colors);
}

function createAngles(numBranches) {
	var step = 360 / numBranches;
	var out = [];
	for (var i = 0; i < 360; i = i + step) {
		out.push(toRadians(i));
	}
	return out;
}

function getRandomLevel() {
	var levels = [4, 5, 6];
	return getRandomElement(levels);
}

function getRandomProportion() {
	var proportions = [0.45, 0.44, 0.43];
	return getRandomElement(proportions);
}

function getRandomAngles() {
	var branches = [8]
	var branch = getRandomElement(branches);

	return createAngles(branch);
}

function getRandomElement(array) {
	var l = array.length;
	return array[Math.floor(Math.random() * l)];
}


function getRandomPoint() {
	return {
		x: window.innerWidth * Math.random(),
		y: window.innerHeight * Math.random()
	};
}


function getCenter() {
	return {
		x: window.innerWidth / 2,
		y: window.innerHeight / 2
	}
}

function delay(ms) {
	var cur_d = new Date();
	var cur_ticks = cur_d.getTime();
	var ms_passed = 0;
	while (ms_passed < ms) {
		var d = new Date();  // Possible memory leak?
		var ticks = d.getTime();
		ms_passed = ticks - cur_ticks;
		// d = null;  // Prevent memory leak?
	}
}


