
class Simulation {

    constructor() {
        this.drones = [];
        this.time = 1;
        this.droneNumber = 10;
        this.spherePoints = []
        this.vel = 1;

        this.createSpherePoints();
        this.createDrones();
    }

    iterate() {
        let newDrones = []
        for(const key in this.drones) {
            const drone = this.drones[key];
            const p = this.getNewPoint(drone.position);
            newDrones.push(this.createDrone(p))
        }
    }

    createSpherePoints() {
        let theta = 0;
        let phi = 0;
        let step = 0.3;
        let r = 255;

        while (theta <= Math.PI) {

            phi = 0;
            while (phi <= Math.PI * 2) {

                let p = {
                    x: r * Math.sin(theta) * Math.cos(phi),
                    y: r * Math.sin(theta) * Math.sin(phi),
                    z: r * Math.cos(theta)
                }

                this.spherePoints.push(p);
                phi += step;
            }
            theta += step;
        }
    }

    createDrones() {
        for (let i = 0; i < this.droneNumber; i++) {
            let p = this.getRandomPosition();
            let d = this.createDrone(p);
            this.drones.push(d);
        }
    }

    createDrone(position) {
        return  {
            position: position
        }
    }

    getRandomPosition() {
        return {
            x: this.getRandom(),
            y: this.getRandom(),
            z: this.getRandom()
        }
    }

    getRandom() {
        return Math.floor(Math.random() * 500);
    }

    getNewPoint(p) {
        let cPoint = this.getClosestSpherePoint(p);
        let nVector = this.unitVector(cPoint);
        let newPoint = sum(p, nVector);
        return newPoint;
    }

    unitVector(v) {
        let m = module(v);
        return {
            x: v.x / m,
            y: v.y / m,
            z: v.z / m
        }
    }

    sum(p1, p2) {
        return  {
            x: p1.x + p2.x,
            y: p1.y + p2.y,
            z: p1.z + p2.z,
        }
    }

    module(v) {
        let x2 = Math.pow(v.x);
        let y2 = Math.pow(v.y);
        let z2 = Math.pow(v.z);
        return Math.sqrt(x2 + y2 + z2);
    }

    getClosestSpherePoint(point) {
        let minDistance = 10000000;
        let point = null;

        for (let i = 0; i < this.spherePoints.length; i++) {
            let spherePoint = this.spherePoints[i];
            let distance = this.getDistance(point, spherePoint);

            if (distance < minDistance) {
                minDistance = distance;
                point = spherePoint;
            }
        }

        return point;
    }

    getDistance(p1, p2) {
        let dx = Math.pow(p2.x - p1.x, 2);
        let dy = Math.pow(p2.y - p1.y, 2);
        let dz = Math.pow(p2.z - p1.z, 2);

        return Math.sqrt(dx + dy +dz);
    }
}


let camera, scene;
let simulation = new Simulation();

init();
animate();

function init() {
    camera = createCamera();
    scene = new THREE.Scene();
    createLights();
    
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    addDrones();
}

function addDrones() {
    let drones = simulation.drones;

    for (const key in drones) {
        let drone = drones[key];
        let cube = createCube(drone.position, 5);
        scene.add(cube);
    }
}

function createCamera() {
    var camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.y = 500;//position.y;
    camera.position.z = 500;//position.z;
    camera.position.x = 500;//position.x;
    
    camera.lookAt(new THREE.Vector3(0, 0, 0))
    return camera;
}

function animate() {
    render();
    requestAnimationFrame(animate);
}

function createCube(position, width) {
    var mesh = new THREE.MeshPhongMaterial({ color: 0xdddddd, specular: 0x009900, shininess: 30, shading: THREE.FlatShading });
    var hls = mesh.color.getHSL();
    mesh.color.setHSL(hls.h, hls.s, 1);

    var cube = new THREE.Mesh(new THREE.BoxGeometry(width, width, width), mesh);
    cube.position.y = position.y;
    cube.position.x = position.x;
    cube.position.z = position.z;

    return cube;
}

function render() {
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
