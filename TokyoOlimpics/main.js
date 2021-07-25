
class Simulation {

    constructor() {
        this.drones = [];
        this.time = 1;
        this.droneNumber = 1000;
        this.spherePoints = []
        this.vel = 1;

        this.createSpherePoints();
        this.createDrones();
    }

    iterate() {
        let me = this;
        this.drones.forEach(d => {
            let newPosition = me.getNewPoint(d.position);
            d.position = newPosition;
        })
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
            let d = this.createDrone(i.toString(), p);
            this.drones.push(d);
        }
    }

    createDrone(id, position) {
        return  {
            id: id,
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

    getNewPoint(p1) {
        let p2 = this.getClosestSpherePoint(p1);
        let p3 = this.subs(p2, p1)
        let nVector = this.unitVector(p3);
        let newPoint = this.sum(p1, nVector);
        return newPoint;
    }

    unitVector(v) {
        let m = this.module(v);

        if (m <= 0) {
            return {x:0, y:0, z:0}
        }

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

    subs(p1, p2) {
        return  {
            x: p1.x - p2.x,
            y: p1.y - p2.y,
            z: p1.z - p2.z,
        }
    }

    module(v) {
        let x2 = Math.pow(v.x, 2);
        let y2 = Math.pow(v.y, 2);
        let z2 = Math.pow(v.z, 2);
        return Math.sqrt(x2 + y2 + z2);
    }

    getClosestSpherePoint(point) {
        let minDistance = 10000000;
        let closestPoint = null;

        for (let i = 0; i < this.spherePoints.length; i++) {
            let spherePoint = this.spherePoints[i];
            let distance = this.getDistance(point, spherePoint);

            if (distance < minDistance) {
                minDistance = distance;
                closestPoint = spherePoint;
            }
        }

        return closestPoint;
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
        let cube = createCube(drone.id, drone.position, 5);
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

function createCube(id, position, width) {
    var mesh = new THREE.MeshPhongMaterial({color: 0xdddddd, specular: 0x009900, shininess: 30, shading: THREE.FlatShading });
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
    light2.position.set(0, 0, -400);
    scene.add(light2);

    var light3 = new THREE.DirectionalLight(0x1f22c7);
    light3.position.set(0, 0, 400);
    scene.add(light3);

}
