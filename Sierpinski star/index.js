(function () {

	var container, stats;
	var camera, scene, renderer;
	var degreesOverZ = 0;
	var initialWidth = 25;
	var cubeProportion = 0.5;
	var distanceProportion = 1;

	var depthStop = 7;
	var cubes = [];
	var indexCube = 0;


	init();
	animate();


	function init() {
		container = document.createElement('div');
		document.body.appendChild(container);

		camera = createCamera();
		scene = new THREE.Scene();

		createLights();

		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(window.innerWidth, window.innerHeight);

		addCubes(getCenter(), initialWidth, 1);

		container.appendChild(renderer.domElement);
		window.addEventListener('resize', onWindowResize, false);

		renderer.render(scene, camera);
	}

	function createLights() {

		scene.add(new THREE.AmbientLight(0x404040));
		var light1 = new THREE.DirectionalLight(0xeacd76);
		light1.position.set(0, 0, 0);
		scene.add(light1);


		var light3 = new THREE.DirectionalLight(0x1f22c7);
		light3.position.set(0, 0, 600);
		scene.add(light3);


		var light4 = new THREE.DirectionalLight(0xF70000);
		light4.position.set(600, 0, 0);
		scene.add(light4);


		var light5 = new THREE.DirectionalLight(0xA8AD39);
		light5.position.set(0, 600, 0);
		scene.add(light5);


		var light2 = new THREE.DirectionalLight(0x6EAD39);
		light2.position.set(0, 0, -600);
		scene.add(light2);

		var light6 = new THREE.DirectionalLight(0x0800F7);
		light6.position.set(0, -600, 0);
		scene.add(light6);

		var light7 = new THREE.DirectionalLight(0x189608);
		light7.position.set(-600, 0, 0);
		scene.add(light7);

		var light8 = new THREE.DirectionalLight(0x1DF700);
		light8.position.set(600, 600, 600);
		scene.add(light8);

	}

	function createCamera() {
		var camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
		var position = getRotationPosition();
		camera.position.y = position.y;
		camera.position.z = position.z;
		camera.position.x = position.x;
		var center = getCenter();
		camera.lookAt(new THREE.Vector3(center.x, center.y, center.z))
		return camera;
	}


	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	}

	function getRotationPosition() {
		var z = 400.0 * Math.sin(degreesOverZ * Math.PI / 180.0);
		var x = window.innerWidth / 2 + 400.0 * Math.cos(degreesOverZ * Math.PI / 180.0);
		var y = window.innerHeight / 2;

		return { x: x, y: y, z: z };
	}


	function createCube(position, width, opacity) {

		var mesh = new THREE.MeshPhongMaterial({ color: 0xdddddd, specular: 0x009900, shininess: 30, shading: THREE.FlatShading });
		var hls = mesh.color.getHSL();
		mesh.color.setHSL(hls.h, hls.s, 0.3 * opacity);


		var geometry = new THREE.SphereGeometry(width, 10, 10)

		var cube = new THREE.Mesh(geometry, mesh);
		cube.position.y = position.y;
		cube.position.x = position.x;
		cube.position.z = position.z;

		return cube;
	}

	function animate() {
		render();
		requestAnimationFrame(animate);
	}


	function getCenter() {
		return {
			x: window.innerWidth / 2,
			y: window.innerHeight / 2,
			z: 0
		};
	}


	function render() {


		if (indexCube < cubes.length)
			scene.add(cubes[indexCube++]);


		//degreesOverZ+=0.5;
		var position = getRotationPosition();
		camera.position.y = position.y;
		camera.position.z = position.z;
		camera.position.x = position.x;
		var center = getCenter();
		camera.lookAt(new THREE.Vector3(center.x, center.y, center.z))
		renderer.render(scene, camera);

	}


	function nextPoint(centerPosition, vertexPosition) {
		var unit = unitVector(vertexPosition);
		var magnitude = calculateModule(vertexPosition);

		var resultVector = scalarProduct(magnitude + (magnitude * (distanceProportion)), unit);

		return vectorSum(centerPosition, resultVector);
	}


	function calculateModule(vector) {
		var out = 0.0;
		for (var prop in vector) {
			if (vector.hasOwnProperty(prop)) {
				out += vector[prop] * vector[prop];
			}
		}

		return out;
	}

	function vectorSum(vector1, vector2) {
		var out = {};
		for (var prop in vector1) {
			if (vector1.hasOwnProperty(prop)) {
				out[prop] = vector1[prop] + vector2[prop];
			}
		}
		return out;
	}

	function unitVector(vector) {
		var magnitude = calculateModule(vector);
		return scalarProduct((1.0 / magnitude), vector);
	}


	function scalarProduct(scalar, vector) {
		var out = {};
		for (var prop in vector) {
			if (vector.hasOwnProperty(prop)) {
				out[prop] = scalar * vector[prop];
			}
		}
		return out;
	}


	function addCubes(position, width, depth) {


		var cube = createCube(position, width, depth);

		cubes.push(cube);

		addNextCubes(position, width, depth);
	}


	function addNextCubes(position, width, depth) {
		if (depth >= depthStop) return;
		var verts = getCentralVertices(width);
		var post = [];

		for (var index in verts) {
			var wid = width * cubeProportion;
			var pos = nextPoint(position, verts[index])
			post.push(pos);
			var nextCube = createCube(pos, wid, depth + 1);
			cubes.push(nextCube);
		}

		for (var index in verts) {
			var wid = width * cubeProportion;
			var pos = post[index]
			addNextCubes(pos, wid, depth + 1);
		}
	}


	function getCentralVertices(width) {
		var vertices = [];
		//centro,arriba
		vertices.push({ x: 0, y: width, z: 0 });


		//centro derecha
		//vertices.push({x:ancho, y:0, z:0});


		//centro abajo
		vertices.push({ x: 0, y: -width, z: 0 });


		//izquierda centro
		//vertices.push({x:-ancho, y:0, z:0});


		//atras	
		vertices.push({ x: 0, y: 0, z: width });


		//enfrente
		vertices.push({ x: 0, y: 0, z: -width });
		//vertices.push({x:0, y:ancho, z:-ancho});

		return vertices;
	}


})();