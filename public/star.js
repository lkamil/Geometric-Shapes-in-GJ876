window.onload = init;

// Globals
var camera;
var scene;
var renderer;

// When everything is loaded, run code
function init() {
    var stats = initStats();

    var scene = new THREE.Scene(); // Holds all objects

}

function initStats() {
    var stats = new Stats();
    stats.setMode(0); // mode 0 = measure fps, mode 1 = measure rendering time

    // Align top left
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';

    document.getElementById("stats-ouput").appendChild(stats.domElement);

    console.log("Stats:");
    console.log(stats);
    console.log("Type: " + typeof stats);
    return stats;
}



// Create a camera
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(0,0,10);

// Create a WEBGL renderer
var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);

// Add the renderer canvas to the DOM
document.body.appendChild(renderer.domElement);

// Create an ambient light source
var light = new THREE.AmbientLight(0x888888);
scene.add(light);

// Create a directional light
var light = new THREE.DirectionalLight(0xfdfcf0, 1); // Hexcolor and Intensity
light.position.set(20, 10, 20);
scene.add(light);