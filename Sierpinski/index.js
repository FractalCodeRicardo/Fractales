(function () {

	var container, stats;
	var camera, scene, renderer;
	var degreesOverZ = 0;
	var initialWidth = 40;
	var cubeProportion = 0.45;
	var distanceProportion = 5;

	var depthStop = 6;
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
		/*
				var cube=createCube(getCenter(),50)
				scene.add(cube);
				
				var point=nextPoint(getCenter(),cube.geometry.vertices[0]);
				var cube2=createCube(point,50*(2.0/3.0))
				scene.add(cube2);
				
			*/
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
		var z = 800.0 * Math.sin(degreesOverZ * Math.PI / 180.0);
		var x = window.innerWidth / 2 + 800.0 * Math.cos(degreesOverZ * Math.PI / 180.0);
		var y = window.innerHeight / 2;

		return { x: x, y: y, z: z };
	}


	function createCube(position, width, opacity) {

		//var mesh=new THREE.MeshNormalMaterial({color:0xffaa00,transparent:true});
		var mesh = new THREE.MeshPhongMaterial({ color: 0xdddddd, specular: 0x009900, shininess: 30, shading: THREE.FlatShading });
		//var mesh=new THREE.MeshBasicMaterial( { color: 0x133049, transparent: false,  blending: THREE.AdditiveBlending ,opacity:opacity} );
		var hls = mesh.color.getHSL();
		mesh.color.setHSL(hls.h, hls.s, 0.3 * opacity);
		//var mesh=new THREE.MeshPhongMaterial( { color: 0xdddddd, specular: 0x009900, shininess: 30, shading: THREE.SmoothShading,  transparent: true } );
		//var mesh=new THREE.MeshNormalMaterial( { shading: THREE.SmoothShading } );

		//var cubeMaterial3 = new THREE.MeshPhongMaterial( { color: 0x000000, specular:0xaa0000, envMap: reflectionCube, combine: THREE.MixOperation, reflectivity: 0.25 } );
		//var mesh = new THREE.MeshLambertMaterial( { color: 0xff6600, envMap: reflectionCube, combine: THREE.MixOperation, reflectivity: 0.3 } );
		//var mesh = new THREE.MeshLambertMaterial( { color: 0xffee00, envMap: refractionCube, refractionRatio: 0.95 } );
		//var mesh = new THREE.MeshLambertMaterial( { color: 0xffffff } );

		var cube = new THREE.Mesh(new THREE.BoxGeometry(width, width, width), mesh);
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


		degreesOverZ += 0.5;
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
		if (depth >= depthStop) return;

		var cube = createCube(position, width, depth);

		cubes.push(cube);
		//scene.add(cube);
		var verts = getVertices(cube);

		for (var index in verts) {
			var wid = width * cubeProportion;
			var pos = nextPoint(position, verts[index]);
			addCubes(pos, wid, depth + 1);
		}
	}

	function getVertices(cube) {

		//return getCorners(cube);

		return getCentralVertices(cube);
	}


	function getCorners(cube) {
		return cube.geometry.vertices;
	}


	function getCentralVertices(cube) {
		var vertices = [];
		var ancho = cube.geometry.vertices[0].x;

		//centro,arriba
		vertices.push({ x: 0, y: ancho, z: 0 });


		//centro derecha
		vertices.push({ x: ancho, y: 0, z: 0 });


		//centro abajo
		vertices.push({ x: 0, y: -ancho, z: 0 });


		//izquierda centro
		vertices.push({ x: -ancho, y: 0, z: 0 });


		//atras	
		vertices.push({ x: 0, y: 0, z: ancho });


		//enfrente
		vertices.push({ x: 0, y: 0, z: -ancho });
		//vertices.push({x:0, y:ancho, z:-ancho});

		return vertices;
	}


})();