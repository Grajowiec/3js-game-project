import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const geometry_barrier = new THREE.BoxGeometry(1.5,0.5);
const material_barrier = new THREE.MeshBasicMaterial( { color: 0xaa0e3b } );
const barrier = new THREE.Mesh( geometry_barrier, material_barrier );

scene.add( barrier );
barrier.position.x = -5;
barrier.position.y = -1.1;

const barrier2 = new THREE.Mesh( geometry_barrier, material_barrier );
scene.add( barrier2 );
barrier2.position.x = -1.7;
barrier2.position.y = -1.1;

const barrier3 = new THREE.Mesh( geometry_barrier, material_barrier );
scene.add( barrier3 );
barrier3.position.x =  1.7;
barrier3.position.y = -1.1;

const barrier4 = new THREE.Mesh( geometry_barrier, material_barrier );
scene.add( barrier4 );
barrier4.position.x =  5;
barrier4.position.y = -1.1;
//^^ Creating and adding barriers

const geometry_player = new THREE.BoxGeometry();
const material_player = new THREE.MeshBasicMaterial( { color: 0x0000FF } );
const player = new THREE.Mesh( geometry_player, material_player );
scene.add( player );
player.position.y = -2.85;
//^^ Creates and spawns player ship

const geometry_bullet = new THREE.SphereGeometry(0.12);
const material_bullet = new THREE.MeshBasicMaterial( { color: 0xFF0000 } );
const bullet = new THREE.Mesh(geometry_bullet,material_bullet)
//^^ Creating bullets

const bullets = []; // Stores bullets in an array so it won't disappear

camera.position.z = 5;

function shoot() {
	bullet.position.x = player.position.x
	bullet.position.y = player.position.y
	scene.add( bullet );
	bullets.push(bullet); // Adds bullet to the array so it won't disappear
}

function keyboard(e) {
	switch (e.keyCode) {
		case 37: // Left
			player.position.x -= 0.5;
			break;
/*		case 38: // Up
			player.position.y += 0.1;
			break;
*/		case 39: // Right
			player.position.x += 0.5;
			break;
/*		case 40: // Down
			player.position.y -= 0.1;
			break;
*/		case 32: // Spacebar to shoot
			shoot();
			break;
		default:
			break;
	}
} // Keyboard

addEventListener("keyup", keyboard); // Controls

function animate() {
	requestAnimationFrame( animate );
	
	player.rotation.x += 0.01;
	player.rotation.y += 0.01;

    // Updates bullet positions
    bullets.forEach(bullet => {
        bullet.position.y += 0.1; // Bullet speed

		// Checking for collision with barriers
		const barriers = [barrier, barrier2, barrier3, barrier4];
		barriers.forEach(barrier => {
			if (bullet.position.distanceTo(barrier.position) < 0.98) { // Collision distance 
				scene.remove(bullet);
				bullets.splice(bullets.indexOf(bullet), 1);
			}
		});

        if (bullet.position.y > 5) { // Removes bullets when they go out of the screen
            scene.remove(bullet);
            bullets.splice(bullets.indexOf(bullet), 1); // Removes bullet from array when they are out from the screen
        }
    });

	renderer.render( scene, camera );
}

animate() 