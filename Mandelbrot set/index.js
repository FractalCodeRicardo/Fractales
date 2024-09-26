(function () {

	var renderer;
	var graphics
	var stage;

	var maxX = 4;
	var maxY = 4;

	var distance = Math.sqrt((maxX * maxX) + (maxY * maxY))

	var scaleX = 100;
	var scaleY = 100;



	var maxIterations = 500;
	var step = 0.008;
	var colors = [0x382666, 0x00000, 0x4F00D9, 0xD9D500, 0xD90000, 0x2B800D9, 0x12D900, 0x3DAEBF];
	var styles = createStyles();

	var points = createPoints();
	var currenIteration = 0;




	init();
	animate();

	function init() {
		renderer = PIXI.autoDetectRenderer(window.innerWidth - 30, window.innerHeight - 30);
		document.body.appendChild(renderer.view);
		stage = new PIXI.Container();
		graphics = new PIXI.Graphics();
		stage.addChild(graphics);
		createMandelbrotSet();

	}

	function createPoints() {
		var pts = new Array(maxIterations);
		for (var i = 0; i < maxIterations; i++) {
			pts[i] = [];
		}
		return pts;
	}

	function createStyles() {
		var styles = new Array(maxIterations);
		var indexColor = 0;
		for (var i = 0; i < maxIterations; i++) {
			styles[i] = { color: colors[indexColor], trans: ((i + 1) / colors.length) };
			indexColor = indexColor == colors.length - 1 ? 0 : indexColor + 1;
		}

		return styles;
	}


	function animate() {

		if (maxIterations > currenIteration) {

			var pts = points[currenIteration];
			var l = pts.length;
			for (var i = 0; i < l; i++) {
				draw(pts[i].x, pts[i].y, currenIteration);
			}

			currenIteration++;

		}

		requestAnimationFrame(animate);
		renderer.render(stage);
	}




	function createMandelbrotSet() {
		for (var x = maxX * -1; x <= maxX; x = x + step) {
			for (var y = maxY * -1; y <= maxY; y = y + step) {

				var znReal = 0.0;
				var znImaginary = 0.0;
				var temp = 0;
				var i = 0;

				while (i < maxIterations) {

					temp = znReal;

					//zn^2
					znReal = (znReal * znReal) - (znImaginary * znImaginary);
					znImaginary = 2 * temp * znImaginary;

					//zn2 + c 
					znReal = znReal + x;
					znImaginary = znImaginary + y;

					if (checkDivergence(znReal, znImaginary))
						break;

					i++;
				}

				if (i < maxIterations)
					points[i].push({ x: x, y: y });
			}
		}

	}

	function checkDivergence(real, imaginary) {
		var d1 = Math.sqrt((real * real) + (imaginary * imaginary));
		return d1 > distance;
	}





	function draw(real, imaginary, iteration) {
		var p = toScreenCoordinates(real, imaginary);
		graphics.lineStyle(0);
		graphics.beginFill(styles[iteration].color, styles[iteration].trans);
		graphics.drawRect(p.x, p.y, 1, 1, 1);
		graphics.endFill();
	}


	function toScreenCoordinates(real, imaginary) {
		var centerx = (window.innerWidth - 30) / 2;
		var centery = (window.innerHeight - 30) / 2;

		var x = centerx + real * scaleX;
		var y = centery - imaginary * scaleY;

		return { x: x, y: y };
	}

})();