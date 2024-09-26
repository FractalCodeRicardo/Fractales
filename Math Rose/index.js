
var angle = 0;
var radius = 3;
var i = 0;
var iterations = getMathRoseIterations();
var currentFrame = 0;
var frames = 100;

init();
animate();

var rose;


function init() {
	container = document.createElement('div');
	document.body.appendChild(container);
	camera = createCamera();
	scene = new THREE.Scene();
	createLights();

	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	container.appendChild(renderer.domElement);
	window.addEventListener('resize', onWindowResize, false);

	renderer.render(scene, camera);
}

function createLights() {
	scene.add(new THREE.AmbientLight(0x404040));
	var light1 = new THREE.DirectionalLight(0xeacd76);
	light1.position.set(0, 0, 0);
	scene.add(light1);

	var light2 = new THREE.DirectionalLight(0x1fc746);
	light2.position.set(0, 0, -400);
	scene.add(light2);

	var light3 = new THREE.DirectionalLight(0x1f22c7);
	light3.position.set(0, 0, 400);
	scene.add(light3);
}

function createCamera() {
	var camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);

	camera.position.y = 0;
	camera.position.z = 3;
	camera.position.x = 3;

	camera.lookAt(new THREE.Vector3(0, 0, 0))
	return camera;
}


function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}


function animate() {
	render();
	requestAnimationFrame(animate);
}


function render() {

	if (currentFrame == 0) {
		if (i > iterations.length - 1)
			i = 0;

		rose = createRose(iterations[i]);
		scene.add(rose);

		i++;
	}


	if (currentFrame == frames) {
		currentFrame = 0;
		clear();
	}
	else
		currentFrame = currentFrame + 1;


	camera.position.x = radius * Math.cos(angle);
	camera.position.z = radius * Math.sin(angle);
	angle += 0.01;
	camera.lookAt(new THREE.Vector3(0, 0, 0))
	renderer.render(scene, camera);

}

function clear() {
	scene.remove(scene.children[scene.children.length - 1]);
}


function createRose(iteration) {

	var points = iteration.points;
	var geometry = new THREE.Geometry();
	var i = 0;
	for (i = 0; i < points.length; i++) {
		var p = points[i];
		geometry.vertices.push(new THREE.Vector3(p.x, p.y, p.z));
	}
	material = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 0.5 });
	line = new THREE.Line(geometry, material);

	return line;
}

function getMathRoseIterations() {
	var iterations = [];


	for (var k = 2; k < 8; k = k + 2) {
		for (var d = 2; d < 100; d = d + 8) {

			iterations.push(new Iteration(k, d));
		}

	}

	for (var i = 0; i < iterations.length; i++) {
		fillPoints(iterations[i]);
	}

	return iterations;
}

function fillPoints(iteration) {
	var step = 0.01;
	var step2 = (2 * Math.PI) / iteration.d;
	var k = iteration.k;
	var points = [];


	for (var phi = 0; phi <= (2 * Math.PI); phi = phi + step2) {
		console.log(phi);


		for (var theta = 0; theta <= (2 * Math.PI); theta = theta + step) {
			var r = Math.sin(theta * k);
			var tx = r * Math.cos(theta);
			var ty = r * Math.sin(theta);
			var tz = 0;

			var ry = ty;
			var rz = tz * Math.cos(phi) - tx * Math.sin(phi);
			var rx = tx * Math.cos(phi) + tz * Math.sin(phi);


			iteration.points.push({ x: rx, y: ry, z: rz });
		}

	}

	return points;
}


function Iteration(k, d) {
	this.k = k;
	this.d = d;
	this.points = [];
}