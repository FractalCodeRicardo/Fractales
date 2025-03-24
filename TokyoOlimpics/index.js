
class Simulation {

    constructor() {
        this.drones = [];
        this.time = 1;
        this.droneNumber = 2000;
        this.points = []
        this.vel = 1;
        this.enoughClose = 2;
        this.dronesInPlace = [];

        this.createPoints();
        //this.createPointsTest();
        this.createDrones();
    }

    iterate() {
        let me = this;

        this.drones.forEach(d => {
            if (!this.isDroneInPlace(d)) {
                me.moveDrone(d);
            }
        })
    }

    createPointsTest() {
        this.points.push({ x: 0, y: 0, z: 0 });
    }

    createPoints() {
        let points = new Points();
        this.points = points.getPoints();
    }


    createDrones() {
        for (let i = 0; i < this.droneNumber; i++) {
            let p = this.getRandomPosition();
            let d = this.createDrone(i.toString(), p);
            this.drones.push(d);
        }
    }

    createDrone(id, position) {
        return {
            id: id,
            position: position
        }
    }

    getRandomPosition() {
        let i = Math.floor(this.points.length * Math.random());
        let p = this.points[i];
        return {
            x: p.x + this.getRandom(),
            y: p.y + this.getRandom(),
            z: p.z + this.getRandom()
        }
    }

    getRandomSign() {
        return Math.random > 0.5 ? 1 : -1;
    }

    getRandom() {
        return Math.floor(Math.random() * 300) * this.getRandomSign();
    }

    moveDrone(drone) {
        let p1 = drone.position;
        let pointData = this.getClosestPoint(p1);
        let p3 = this.subs(pointData.closestPoint, p1)
        let nVector = this.unit(p3);
        nVector = this.prod(nVector, this.vel);
        let newPoint = this.sum(p1, nVector);

        drone.position = newPoint;

        if (this.isEnoughClose(newPoint, pointData.closestPoint)) {
            this.points.splice(pointData.index, 1);
            this.dronesInPlace.push(drone.id);
        }
    }

    isDroneInPlace(drone) {
        return this.dronesInPlace.indexOf(drone.id) > -1;
    }

    unit(v) {
        let m = this.module(v);

        if (m <= 0) {
            return { x: 0, y: 0, z: 0 }
        }

        return {
            x: v.x / m,
            y: v.y / m,
            z: v.z / m
        }
    }

    sum(p1, p2) {
        return {
            x: p1.x + p2.x,
            y: p1.y + p2.y,
            z: p1.z + p2.z
        }
    }

    subs(p1, p2) {
        return {
            x: p1.x - p2.x,
            y: p1.y - p2.y,
            z: p1.z - p2.z
        }
    }

    prod(p1, scalar) {
        return {
            x: p1.x * scalar,
            y: p1.y * scalar,
            z: p1.z * scalar
        }
    }

    module(v) {
        let x2 = Math.pow(v.x, 2);
        let y2 = Math.pow(v.y, 2);
        let z2 = Math.pow(v.z, 2);
        return Math.sqrt(x2 + y2 + z2);
    }

    getClosestPoint(point) {
        let minDistance = 10000000;
        let closestPoint = null;
        let index = -1;

        for (let i = 0; i < this.points.length; i++) {
            let pointToReach = this.points[i];
            let distance = this.getDistance(point, pointToReach);

            if (distance < minDistance) {
                minDistance = distance;
                closestPoint = pointToReach;
                index = i;
            }
        }

        return {
            index: index,
            closestPoint: closestPoint
        }
    }

    getDistance(p1, p2) {
        let dx = Math.pow(p2.x - p1.x, 2);
        let dy = Math.pow(p2.y - p1.y, 2);
        let dz = Math.pow(p2.z - p1.z, 2);

        return Math.sqrt(dx + dy + dz);
    }

    isEnoughClose(p1, p2) {
        let t = this.subs(p1, p2);
        let m = this.module(t);

        return m < this.enoughClose;
    }
}


let camera, scene;
let simulation = new Simulation();
let angle = 0, radius = 800;
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
        let cube = createCube(drone.id, drone.position, 10);
        scene.add(cube);
    }
}

function dronesToObject(drones) {
    let obj = {};
    drones.forEach(i => {
        obj[i.id] = i;
    })
    return obj;
}

function updateDrones() {
    let objDrones = dronesToObject(simulation.drones)

    scene.children.forEach(c => {
        if (!(c instanceof THREE.Mesh)) return;
        if (!objDrones.hasOwnProperty(c.name)) return;

        let drone = objDrones[c.name];

        c.position.x = drone.position.x;
        c.position.y = drone.position.y;
        c.position.z = drone.position.z;

    })
}

function createCamera() {
    var camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1500);
    camera.position.y = 500;//position.y;
    camera.position.z = 500;//position.z;
    camera.position.x = 500;//position.x;

    camera.lookAt(new THREE.Vector3(0, 0, 0))
    return camera;
}

function animate() {
    render();
    requestAnimationFrame(animate);

    camera.position.x = radius * Math.cos(angle);
    camera.position.y = radius * Math.sin(angle);
    camera.lookAt(new THREE.Vector3(0, 0, 0))
    angle += 0.01;
}

function createCube(id, position, width) {
    var mesh = new THREE.MeshPhongMaterial({ color: 0xdddddd, specular: 0x009900, shininess: 30, shading: THREE.FlatShading });
    var hls = mesh.color.getHSL();
    mesh.color.setHSL(hls.h, hls.s, 1);

    var cube = new THREE.Mesh(new THREE.BoxGeometry(width, width, width), mesh);
    cube.name = id;
    cube.position.y = position.y;
    cube.position.x = position.x;
    cube.position.z = position.z;

    return cube;
}

function render() {
    simulation.iterate();
    updateDrones();
    renderer.render(scene, camera);
}

function createLights() {
    scene.add(new THREE.AmbientLight(0x404040));
    var light1 = new THREE.DirectionalLight(0xeacd76);
    light1.position.set(0, 0, 0);
    scene.add(light1);

    var light2 = new THREE.DirectionalLight(0x1fc746);
    light2.position.set(0, 0, -1000);
    scene.add(light2);

    var light3 = new THREE.DirectionalLight(0x1f22c7);
    light3.position.set(0, 0, 1000);
    scene.add(light3);

}
