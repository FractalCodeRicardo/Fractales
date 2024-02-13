
import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const figure = createFigure();
var angleCamera = 0;
var radiusCamera = 10;
scene.add( figure );

camera.position.z = 10;
camera.position.y = 0;
camera.position.x = 10;

function animate() {
	requestAnimationFrame( animate );

    camera.position.z = radiusCamera * Math.cos(angleCamera);
    camera.position.x = radiusCamera * Math.sin(angleCamera);
    angleCamera = angleCamera + 0.9;
    camera.lookAt(new THREE.Vector3(0,0,0))
	renderer.render( scene, camera );
}

function createFigure() {
    const material = new THREE.LineBasicMaterial({
        color: 0xffffff
    });
    
    const points = [];
    
    for (let angle = 0; angle < Math.PI * 2; angle+=0.001) {
        let x = 2* Math.cos(angle);
        let y = 2* Math.sin(angle);
       
        points.push(new THREE.Vector3(x, y, 0));
    }
    
    const geometry = new THREE.BufferGeometry().setFromPoints( points );
    
    const line = new THREE.Line( geometry, material );
    scene.add( line );
}

animate();