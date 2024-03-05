
import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const figure = createFigure(5);
var angleCamera = 0;
var radiusCamera = 10;
scene.add( figure );

camera.position.z = 5;
camera.position.y = 0;
camera.position.x = 0;

function animate() {
	requestAnimationFrame( animate );

    camera.position.x = radiusCamera * Math.cos(angleCamera);
    camera.position.z = radiusCamera * Math.sin(angleCamera);
    angleCamera = angleCamera + 0.8;
    camera.lookAt(new THREE.Vector3(0,0,0))
	renderer.render( scene, camera );
}

function createFigure(k) {
    const material = new THREE.LineBasicMaterial({
        color: 0xffffff
    });
    
    const points = [];
    
    for (let angle = 0; angle < Math.PI * 2; angle+=0.001) {
        let x = 5* 1 * Math.cos(k*angle) * Math.cos(angle);
        let y = 5* 1 * Math.cos(k*angle) * Math.sin(angle);
       
        points.push(new THREE.Vector3(x, y, 0));
    }
    
    const geometry = new THREE.BufferGeometry().setFromPoints( points );
    
    const line = new THREE.Line( geometry, material );
    return line;
}

animate();