(function () {

	var initialRadius = 300;
	var colors = [0xcb42f4, 0xb942f4, 0x8f42f4, 0x7442f4, 0x47269b, 0x3C2182, 0x2F1A66, 0x3C2182, 0x47269b, 0x7442f4, 0x8f42f4, 0xb942f4, 0xcb42f4];
	var styleLevels = createStyles();

	var renderer;
	var graphics
	var stage;

	var indexParameter = 0;
	var parametersSet = createParametersSet();


	init();
	animate();
	timer.start();

	function init() {
		renderer = PIXI.autoDetectRenderer(window.innerWidth - 30, window.innerHeight - 30);
		document.body.appendChild(renderer.view);
		stage = new PIXI.Container();
		graphics = new PIXI.Graphics();
		stage.addChild(graphics);

	}

	function createStyles() {
		var step = 10;
		var styles = [];
		var index = 0;
		for (var i = 0; i <= initialRadius; i = i + step) {
			styles.push({ radius: i, color: colors[index] });
			index = index == colors.length - 1 ? 0 : index + 1;
		}

		return styles;
	}

	function createParametersSet() {
		var parameters = [];
		for (var prop = 0.1; prop <= 0.9; prop = prop + 0.1) {
			for (var level = 1; level < 7; level++) {

				parameters.push({ radius: initialRadius, level: level, proportion: prop });
			}

		}

		return parameters;
	}

	function drawPentagons(pentagons) {
		var l = pentagons.length;
		for (i = 0; i < l; i++)
			drawPentagon(pentagons[i]);
	}


	function animate() {

		if (indexParameter < parametersSet.length) {

			var param = parametersSet[indexParameter];
			var pDivision = new PentagonalSubdivision(param.level, param.radius, param.proportion);
			var pentagons = pDivision.getPentagons();
			graphics.clear();
			drawPentagons(pentagons);
			indexParameter++;
		}

		window.setTimeout(function () {
			requestAnimationFrame(animate);
			renderer.render(stage);
		}, 3000);

	}

	function drawPentagon(pentagon) {
		for (var i = 0; i < 5; i++) {
			drawLinePentagon(pentagon, i)
		}
		graphics.endFill();
	}

	function drawLinePentagon(pentagon, index) {
		var point1 = pentagon.points[index];
		var point2 = pentagon.points[getNextIndex(index)];

		var spoint1 = toScreenCoordinates(point1);
		var spoint2 = toScreenCoordinates(point2);


		var style = getStyleFromPoint(pentagon.center);
		graphics.lineStyle(1, style.color, 1);

		graphics.moveTo(spoint1.x, spoint1.y);
		graphics.lineTo(spoint2.x, spoint2.y);

	}

	function getNextIndex(index) {
		return index == 4 ? 0 : index + 1;
	}

	function toScreenCoordinates(vector) {
		var centerx = (window.innerWidth - 30) / 2;
		var centery = (window.innerHeight - 30) / 2;

		return new Vector(centerx + vector.x, centery - vector.y);
	}

	function getStyleFromLine(p1, p2) {
		var mid = getMidPoint(p1, p2);
		return getStyleFromPoint(mid)
	}


	function getStyleFromPoint(point) {
		var module = point.L2Norm();
		var style = getStyleFromRadius(module);

		console.log(module + '  -  ' + style.radius);

		return style;
	}

	function getStyleFromRadius(radius) {
		var style = null;
		var l = styleLevels.length;
		for (var i = 0; i < l; i++) {
			if (radius > styleLevels[i].radius &&
				radius < styleLevels[i + 1].radius) {
				style = styleLevels[i];
			}
		}

		return style || styleLevels[0];
	}


	function getMidPoint(p1, p2) {
		var x = (p1.x + p2.x) / 2;
		var y = (p1.y + p2.y) / 2;
		return new Vector(x, y);
	}



})();