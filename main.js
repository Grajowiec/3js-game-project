import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const geometry_player = new THREE.BoxGeometry();
const material_player = new THREE.MeshBasicMaterial( { color: 0x0000FF } );
const player = new THREE.Mesh( geometry_player, material_player );
scene.add( player );
//^^ creates and spawns player ship

const geometry_bullet = new THREE.SphereGeometry(0.12);
const material_bullet = new THREE.MeshBasicMaterial( { color: 0xFF0000 } );
const bullet = new THREE.Mesh(geometry_bullet,material_bullet)
//^^ building bullets

const bullets = []; // Store bullets in an array so it won't disappear

camera.position.z = 5;

function shoot() {
	bullet.position.x = player.position.x
	bullet.position.y = player.position.y
	scene.add( bullet );
	bullets.push(bullet); // Add the bullet to the array so it won't disappear
}

function key(e) {
	switch (e.keyCode) {
		case 37: // left
			player.position.x -= 0.1;
			break;
		case 38: // up
			player.position.y += 0.1;
			break;
		case 39: // right
			player.position.x += 0.1;
			break;
		case 40: // down
			player.position.y -= 0.1;
			break;
		case 32: //spacebar to shoot
			shoot();
			break;
		default:
			break;
	}
} //keyboard

addEventListener("keyup", key); //controls

function animate() {
	requestAnimationFrame( animate );
	player.rotation.x += 0.01;
	player.rotation.y += 0.01;
    // Update bullet positions
    bullets.forEach(bullet => {
        bullet.position.y += 0.1; // Bullet speed
        if (bullet.position.y > 5) { // Remove bullets when they go out of the screen
            scene.remove(bullet);
            bullets.splice(bullets.indexOf(bullet), 1); //removes bullet from array when they are out from the screen
        }
    });

	renderer.render( scene, camera );
}

animate() 