import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

camera.position.set(0,-4,5);

camera.lookAt(0,0,0)

//camera.position.z = 5;

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
//const bullet = new THREE.Mesh(geometry_bullet,material_bullet)
//^^ Bullets properties

const bullets = []; // Stores bullets in an array so it won't disappear

const geometry_enemy = new THREE.BoxGeometry();
const material_enemy = new THREE.MeshBasicMaterial( { color: 0x00FF00 } );
const enemy = new THREE.Mesh(geometry_enemy,material_enemy);
const enemy_speed = 0.1;
enemy.position.x = 0;
enemy.position.y = 3;
//^^  Enemy properties

// Create an array to store enemy instances
const enemies = [];

// Stores all enemy waves
const enemyWaves = []; 

// Function to spawn a wave of enemies
function spawnEnemyWave(numEnemies) {
    const spacing = 2.5; // Spacing between enemies
    const wave = [];
    
    for (let i = 0; i < numEnemies; i++) {
        const enemy = new THREE.Mesh(geometry_enemy, material_enemy);
        enemy.position.x = (i - (numEnemies - 1) / 2) * spacing; // Spread enemies evenly
        enemy.position.y = 3; // Initial y position
        wave.push(enemy);
    }
    
    enemyWaves.push(wave); // Add wave to enemy waves queue
}

let enemyDirection = 1; // Enemy movement, 1 for moving right, -1 for moving left

let moveCounter = 0; // Counter to control the enemy movement speed

function moveEnemies() {
    moveCounter++;
    if (moveCounter % 30 === 0) { // Update enemy position every 30 frames (adjust for desired speed)
        let changeDirection = false;
        enemies.forEach(enemy => {
            enemy.position.x += enemy_speed * enemyDirection;
            // Check if the enemy reached the left or right boundary
            if (enemy.position.x >= 5 || enemy.position.x <= -5) {
                changeDirection = true;
            }
        });

        if (changeDirection) {
            enemyDirection *= -1; // Reverse the direction
            enemies.forEach(enemy => {
                enemy.position.y -= 0.5; // Move all enemies down
            });
        }
    }
}
// Function to check if current wave is defeated
function checkWaveDefeated() {
    if (enemies.length === 0 && enemyWaves.length > 0) {
        // Move next wave into the scene
        const nextWave = enemyWaves.shift(); // Remove first wave from queue
        nextWave.forEach(enemy => {
            scene.add(enemy);
            enemies.push(enemy);
        });
    }
}

// Initial enemy wave
spawnEnemyWave(4);

function shoot() {
	const bullet = new THREE.Mesh(geometry_bullet,material_bullet)
	bullet.position.x = player.position.x;
	bullet.position.y = player.position.y;
	scene.add( bullet );
	bullets.push(bullet); // Adds bullet to the array so it won't disappear
}

function checkBulletEnemyCollision() {
    bullets.forEach(bullet => {
        enemies.forEach(enemy => {
            if (bullet.position.distanceTo(enemy.position) < 0.9) { // Adjust collision distance
                // Remove bullet and enemy from the scene
                scene.remove(bullet);
                scene.remove(enemy);
                // Remove bullet from the bullets array
                bullets.splice(bullets.indexOf(bullet), 1);
                // Remove enemy from the enemies array
                enemies.splice(enemies.indexOf(enemy), 1);
            }
        });
    });
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

	moveEnemies();
	
	player.rotation.x += 0.01;
	player.rotation.y += 0.01;
	
	checkBulletEnemyCollision();
	checkWaveDefeated();

    // Updates bullet positions
    bullets.forEach(bullet => {
        bullet.position.y += 0.1; // Bullet speed

		// Checking for collision with barriers
		// const barriers = [barrier, barrier2, barrier3, barrier4];
		// barriers.forEach(barrier => {
		// 	if (bullet.position.distanceTo(barrier.position) < 0.98) { // Collision distance 
		// 		scene.remove(bullet);
		// 		bullets.splice(bullets.indexOf(bullet), 1);
		// 	}
		// });

        if (bullet.position.y > 5) { // Removes bullets when they go out of the screen
            scene.remove(bullet);
            bullets.splice(bullets.indexOf(bullet), 1); // Removes bullet from array when they are out from the screen
        }
    });

	renderer.render( scene, camera );
}

animate() 