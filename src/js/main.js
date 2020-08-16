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
render();

function render() {
    animationRequest = requestAnimationFrame(render);
    sceneManager.update();
}

function bindEventListeners() {
    window.onresize = resizeCanvas;

    let pausePlayButton = document.getElementById("pausePlayButton");
    pausePlayButton.addEventListener("click", pausePlay, false);

    let moveCameraButton = document.getElementById("moveCameraToTopView");
    moveCameraButton.addEventListener("click", moveCameraToTopView, false);
    
    // ??? Not attaching the event listener works better than attaching it, but deleting the handler
    // changes the output ???
    // document.addEventListener("visibilitychange", handleVisibilityChange, false);
}

function resizeCanvas() {
    canvas.style.width = '100%';
    canvas.style.height = '100%';

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
    let text = this.textContent;
    if (text == "Pause Animation") {
        cancelAnimationFrame(animationRequest);
        this.innerHTML = "Play Animation";
    } else {
        sceneManager.timer.reset();
        animationRequest = requestAnimationFrame(render);
        this.innerHTML = "Pause Animation";   
    }
    
}

function moveCameraToTopView(e) {
    // Todo: Calculate correct position for top view
}