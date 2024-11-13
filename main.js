import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";


// Create a Three.JS Scene
const scene = new THREE.Scene();

// Create a new camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 100, 250); // Initial camera position

// Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Instantiate a loader for the .gltf file
const loader = new GLTFLoader();

let bus, home; // Variables to store the bus and home objects
let busSpeed = 1; // Set to positive for forward motion

// Load the bus model
loader.load(
  './models/scene.gltf',
  function (gltf) {
    bus = gltf.scene;
    bus.scale.set(0.2, 0.2, 0.2); // Adjust scale to make it smaller
    bus.position.set(-900, 17, 0); // Start bus at the left end of the road
    bus.rotation.y = Math.PI; // Rotate 180 degrees
    scene.add(bus);
  },
  undefined,
  function (error) {
    console.error("Error loading the bus model: ", error);
  }
);

// Load the home model, rotate it, and place it on the side of the road
loader.load(
  './models/Home/scene.gltf', // Replace with the correct path to the home model
  function (gltf) {
    home = gltf.scene;
    home.scale.set(2, 2, 2); // Adjust scale for appropriate size
    home.position.set(-200, 100, -220); // Position home beside the road
    home.rotation.y = Math.PI / 2; // Rotate by 90 degrees to face the road
    scene.add(home);
  },
  undefined,
  function (error) {
    console.error("Error loading the home model: ", error);
  }
);

// Load the tree model
loader.load(
  './models/tree/scene.gltf', // Replace with the correct path to your tree model
  function (gltf) {
    const tree = gltf.scene;
    tree.scale.set(2, 2, 2); // Adjust scale as needed
    tree.position.set(-400, 0, -400); // Position the tree near the road
    scene.add(tree);

    // Optionally, add more trees by cloning the original
    const tree2 = tree.clone();
    tree2.position.set(200, 0, -400); // Adjust position for variation
    scene.add(tree2);

    // const tree3 = tree.clone();
    // tree3.position.set(-700, 0, -320); // Adjust position for variation
    // scene.add(tree3);
  },
  undefined,
  function (error) {
    console.error("Error loading the tree model: ", error);
  }
);

// Load the teashop model
loader.load(
  './models/tea_shop/scene.gltf', // Replace with the correct path to the teashop model
  function (gltf) {
    const teaShop = gltf.scene;
    teaShop.scale.set(50, 50, 50); // Adjust scale for appropriate size
    teaShop.position.set(-650, 0, -220); // Position beside the road
    teaShop.rotation.y = -Math.PI/2 ; // Rotate by 90 degrees to face the road
    scene.add(teaShop);
  },
  undefined,
  function (error) {
    console.error("Error loading the teashop model: ", error);
  }
);

// Load the bus stand model
loader.load(
  './models/stand/scene.gltf', // Replace with the correct path to your bus stand model
  function (gltf) {
    const busStand = gltf.scene;
    busStand.scale.set(1200, 1200, 1200); // Adjust scale to appropriate size
    busStand.position.set(-950, 0, -220); // Position the bus stand beside the road
    busStand.rotation.y = Math.PI / 2; // Rotate to face the road
    scene.add(busStand);
  },
  undefined,
  function (error) {
    console.error("Error loading the bus stand model: ", error);
  }
);



// Add lights to the scene
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Increase intensity
directionalLight.position.set(0, 10, 10);
scene.add(directionalLight);

// Create a road surface
const roadTexture = new THREE.TextureLoader().load('road.jpg'); // Load road texture
roadTexture.wrapS = roadTexture.wrapT = THREE.RepeatWrapping;
roadTexture.repeat.set(20, 1); // Increase repeat for a longer road

const roadMaterial = new THREE.MeshStandardMaterial({ map: roadTexture });
const roadGeometry = new THREE.PlaneGeometry(2000, 250); // Double the road length
const road = new THREE.Mesh(roadGeometry, roadMaterial);
road.rotation.x = -Math.PI / 2; // Rotate to lay flat on the ground
road.position.set(0, 0, 50); // Place the road under the bus
scene.add(road);

// Create ground planes on both sides of the road
const groundTexture = new THREE.TextureLoader().load('grass.jpg'); // Load a ground texture
groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
groundTexture.repeat.set(20, 20);

const groundMaterial = new THREE.MeshStandardMaterial({ map: groundTexture });
const groundGeometry = new THREE.PlaneGeometry(2000, 500); // Wide ground for both sides

// Left ground
const leftGround = new THREE.Mesh(groundGeometry, groundMaterial);
leftGround.rotation.x = -Math.PI / 2;
leftGround.position.set(0, 0, -325); // Position to the left of the road
scene.add(leftGround);

// Right ground
const rightGround = new THREE.Mesh(groundGeometry, groundMaterial);
rightGround.rotation.x = -Math.PI / 2;
rightGround.position.set(0, 0, 425); // Position to the right of the road
scene.add(rightGround);


function animate() {
  requestAnimationFrame(animate);

  // Move the bus forward along the x-axis
  if (bus && bus.position.x < 900) {
    bus.position.x += busSpeed;

    // Adjust the camera position and look at the bus
    camera.position.x = bus.position.x - 150;
    camera.position.y = 120;
    camera.lookAt(bus.position);
  }

  renderer.render(scene, camera);
}

// Resize listener
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start rendering
animate();