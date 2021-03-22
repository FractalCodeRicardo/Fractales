(function() {
	var cubeSize = 500;

	var container, stats;
	var camera, scene, renderer;

	init();

	function init() {
		container = document.createElement('div');
		document.body.appendChild(container);

		scene = new THREE.Scene();

		camera = createCamera();

		createLights();

		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(window.innerWidth, window.innerHeight);
		container.appendChild(renderer.domElement);
		window.addEventListener('resize', onWindowResize, false);

		createCube();

		renderer.render(scene, camera);
	}

	function createCamera() {
		var camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
		var position = getCameraPosition();
		camera.position.y = position.y;
		camera.position.z = position.z;
		camera.position.x = position.x;
		var center = getCenter();
		camera.lookAt(new THREE.Vector3(center.x, center.y, center.z))
		return camera;
	}

	function createLights() {

		scene.add(new THREE.AmbientLight(0x404040));
		var light1 = new THREE.DirectionalLight(0xeacd76);
		light1.position.set(0, 0, 0);
		scene.add(light1);

	}

	function getCameraPosition() {
		var z = 800.0;
		var x = window.innerWidth / 2;
		var y = window.innerHeight / 2;

		return { x: x, y: y, z: z };
	}

	function getCenter() {
		return {
			x: window.innerWidth / 2,
			y: window.innerHeight / 2,
			z: 0
		};
	}

	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	}

	function createCube() {
		var cube = getCube(getCenter(), cubeSize);
		scene.add(cube);
	}

	function getCube(position, width) {
		var mesh = new THREE.MeshPhongMaterial({ color: 0xdddddd, specular: 0x009900, shininess: 30, shading: THREE.FlatShading });

		var cube = new THREE.Mesh(new THREE.CubeGeometry(width, width, width), mesh);
		cube.position.y = position.y;
		cube.position.x = position.x;
		cube.position.z = position.z;


		var cubeCsg = THREE.CSG.toCSG(cube);

		var resultGeo = THREE.CSG.fromCSG(cubeCsg);

		var mesh = new THREE.Mesh(resultGeo, material);

		return mesh;
	}

})();