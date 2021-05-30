import './style.scss';

import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

function addLighting(scene) {
  let color = 0xFFFFFF;
  let intensity = 1;
  let light = new THREE.DirectionalLight(color, intensity);
  light.position.set(0, 10, 0);
  light.target.position.set(-5, -2, -5);
  scene.add(light);
  scene.add(light.target);
}

function addSphere(scene) {
  let geometry = new THREE.SphereGeometry( 5, 32, 32 );
  let material = new THREE.MeshStandardMaterial({color: 0x0000ff, roughness: 0});
  let sphere = new THREE.Mesh( geometry, material );
  sphere.position.set(0, 5, 0);
  sphere.name = 'my-sphere';
  scene.add( sphere );
}

function addFloor(scene) {
  let geometry = new THREE.BoxGeometry(50, 1, 50);
  let material = new THREE.MeshStandardMaterial({color: 0xDDDDDD, roughness: 0});
  const floor = new THREE.Mesh( geometry, material );
  floor.position.set(0, -10, 0);
  floor.name = 'my-floor';
  scene.add(floor);
}

const scene = new THREE.Scene();
const canvas = document.querySelector("#canvas");
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(0, 20, 50);
camera.lookAt(0, 0, 0);
const controls = new OrbitControls(camera, canvas);

// Set up the renderer
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize( window.innerWidth, window.innerHeight );

// Add lighting to the scene
addLighting(scene);

// Add Floor to the scene
addFloor(scene);

// Add a Sphere to the scene
addSphere(scene);

// setting initial values for required parameters 
let acceleration = 9.8;
let bounce_distance = 9;
let bottom_position_y = -4;
let time_step = 0.02;
// time_counter is calculated to be the time the ball just reached the top position
// this is simply calculated with the s = (1/2)gt*t formula, which is the case when ball is dropped from the top position
let time_counter = Math.sqrt(bounce_distance * 2 / acceleration);
let initial_speed = acceleration * time_counter;
let sphere = scene.getObjectByName("my-sphere");

// Animate the scene
const animate = () => {
  requestAnimationFrame( animate );

  // reset time_counter back to the start of the bouncing sequence when sphere hits through the bottom position
  if (sphere.position.y < bottom_position_y) {
    time_counter = 0;
  }
  // calculate sphere position with the s2 = s1 + ut + (1/2)gt*t formula
  // this formula assumes the ball to be bouncing off from the bottom position when time_counter is zero
  sphere.position.y = bottom_position_y + initial_speed * time_counter - 0.5 * acceleration * time_counter * time_counter;
  // advance time
  time_counter += time_step;

  renderer.render( scene, camera );
};
animate();