
var rules = createRules();
var x = window.innerWidth / 2;
var y = window.innerHeight / 2;

function setup() {
	createCanvas(window.innerWidth, window.innerHeight);
	stroke(255);     // Set line drawing color to white
	//frameRate(10000);
	background(0);
}

function draw() {

	for (var i = 0; i < 50; i++) {
		var rule = getRule();
		var x1 = x * rule.a + y * rule.b + rule.tx;
		var y1 = y * rule.c + y * rule.d + rule.ty;

		x = x1;
		y = y1;

		var p = toScreenCoordinates({ x: x, y: y });

		stroke(rule.color.r, rule.color.g, rule.color.b);
		point(p.x, p.y);

	}

}

function getRule() {
	var rand = Math.random();
	for (var i = 0; i < rules.length; i++) {
		var rule = rules[i];

		if (rand < rule.w)
			return rule;

		rand -= rule.w;
	}
}

function createRules() {
	var rules = [];

	rules.push(new Rule(0.85, 0.04, -0.04, 0.85, 0, 1.60, 0.60, { r: 36, g: 181, b: 38 }));
	rules.push(new Rule(0.20, -0.26, 0.23, 0.22, 0, 0, 0.20, { r: 23, g: 109, b: 24 }));
	rules.push(new Rule(-0.15, 0.28, 0.26, 0.24, 0, 0.44, 0.10, { r: 23, g: 109, b: 24 }));
	rules.push(new Rule(0, 0, 0, 0.16, 0, 0, 0.10, { r: 12, g: 66, b: 13 }));

	return rules;
}

function Rule(a, b, c, d, tx, ty, w, color) {
	this.a = a;
	this.b = b;
	this.c = c;
	this.d = d;

	this.ty = ty;
	this.tx = tx;

	this.w = w;

	this.color = color;
}

function toScreenCoordinates(p) {
	var centerx = (window.innerWidth) / 2;
	var centery = ((window.innerHeight) / 2) + 200;


	var scaleX = 60;
	var scaleY = 60;

	var x = centerx + p.x * scaleX;
	var y = centery - p.y * scaleY;

	return { x: x, y: y };
}
