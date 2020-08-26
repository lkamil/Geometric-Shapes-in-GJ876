// create scenemanager
// attach listeners to dom elements (eg windowresize)
// start render loop
// import {Timer} from '.libs/Timer';

let data = loadData();
let canvas = document.getElementById("canvas");
let controls = initDatGui();
let sceneManager = new SceneManager(canvas, data);


let animationRequest;

function loadData() {
    let request = new XMLHttpRequest();
    request.open("GET", "data.json", false);
    request.send(null);
    let data = JSON.parse(request.responseText);

    return data;
}

bindEventListeners();
resizeCanvas();
render();

function render() {
    animationRequest = requestAnimationFrame(render);
    sceneManager.update();
}

function bindEventListeners() {
    window.onresize = resizeCanvas;

    let pausePlayButton = document.querySelector("#pausePlayButton");
    pausePlayButton.addEventListener("click", pausePlay, false);

    let moveCameraButton = document.getElementById("moveCameraToTopView");
    moveCameraButton.addEventListener("click", moveCameraToTopView, false);
    
    // ??? Not attaching the event listener works better than attaching it, but deleting the handler
    // changes the output ???
    // document.addEventListener("visibilitychange", handleVisibilityChange, false);
}

function resizeCanvas() {
    canvas.style.width = '100% - 260px';
    canvas.style.height = '100%';
    // canvas.style.float = 'right';

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    sceneManager.onWindowResize();
}

function initDatGui() {
    let datGui = new dat.GUI();
    let controls = new Controls();
    datGui.add(controls, 'scale', 1.5, 3);

    return controls;
}

// *** Event Handlers ***

function handleVisibilityChange(e) {
    if (document.hidden) {
        // Pause animation
        cancelAnimationFrame(animationRequest);
    } else {
        // Resume animation
        sceneManager.timer.reset();
        animationRequest = requestAnimationFrame(render);
    }
}

function pausePlay(e) {
    let text = this.querySelector("#pausePlay").textContent;
    if (text == "Pause Animation") {
        sceneManager.animationPaused = true;

        this.querySelector("#pausePlay").innerHTML = "Play Animation";

        // Change icon
        let pauseSVG = this.querySelector(".visible");
        let playSVG = this.querySelector(".hidden");

        pauseSVG.classList.remove("visible");
        pauseSVG.classList.add("hidden");
        pauseSVG.setAttribute("width", "0");

        playSVG.classList.remove("hidden");
        playSVG.classList.add("visible");
        playSVG.setAttribute("width", "11");
    } else {
        sceneManager.timer.reset();
        this.querySelector("#pausePlay").innerHTML = "Pause Animation";
        sceneManager.animationPaused = false;

        // Change icon
        let pauseSVG = this.querySelector(".hidden");
        let playSVG = this.querySelector(".visible");

        pauseSVG.classList.add("visible");
        pauseSVG.classList.remove("hidden");
        pauseSVG.setAttribute("width", "10");
        
        playSVG.classList.add("hidden");
        playSVG.classList.remove("visible");
        playSVG.setAttribute("width", "0");
    } 
}

function moveCameraToTopView(e) {
    let inclinations = [data.planets.gj876b.i, data.planets.gj876c.i, data.planets.gj876d.i, data.planets.gj876e.i];

    let i = (inclinations.reduce((acc, value) => acc + value)) / inclinations.length; // Mean inclination
    let distance = 1;

    sceneManager.travelController.setTravelPath(sceneManager.camera, i, distance);
}
