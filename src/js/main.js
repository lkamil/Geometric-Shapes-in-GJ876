// create scenemanager
// attach listeners to dom elements (eg windowresize)
// start render loop
// import {Timer} from '.libs/Timer';

let data = loadData();
let canvas = document.getElementById("canvas");
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

    const pausePlayButton = document.querySelector("#pausePlayButton");
    pausePlayButton.addEventListener("click", pausePlay, false);

    const moveCameraButton = document.getElementById("moveCameraToTopView");
    moveCameraButton.addEventListener("click", moveCameraToTopView, false);

    const resetButton = document.getElementById("resetAnimation");
    resetButton.addEventListener("click", reset, false);
    
    // ??? Not attaching the event listener works better than attaching it, but deleting the handler
    // changes the output ???
    // document.addEventListener("visibilitychange", handleVisibilityChange, false);

    const toggleLinkLinesMenuButton = document.getElementById("openDrawLinkLinesMenu");
    toggleLinkLinesMenuButton.addEventListener("click", toggleMenuAnimation, false);

    document.querySelectorAll('#linkLine-checkboxes input').forEach(checkbox => {
        checkbox.addEventListener('change', limitSelectedCheckboxes, false)
    });

    const hideShowButton = document.querySelector("#hideShowButton");
    hideShowButton.addEventListener("click", hideShow, false);

    const toggleLoopFigureMenuButton = document.getElementById("openDrawLoopFigureMenu");
    toggleLoopFigureMenuButton.addEventListener("click", toggleMenuAnimation, false);

    const animationSpeedSlider = document.getElementById("animationSpeedSlider");
    animationSpeedSlider.oninput = function() {
        sceneManager.setAnimationSpeed(this.value);
    }

    // Draw Buttons
    const drawLinkLinesButton = document.getElementById("drawLinkLinesButton");
    drawLinkLinesButton.addEventListener('click', drawLinkLines, false);

}

function resizeCanvas() {
    canvas.style.width = '100% - 260px';
    canvas.style.height = '100%';
    // canvas.style.float = 'right';

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    sceneManager.onWindowResize();
}

// *** Event Handlers ***

function handleVisibilityChange(e) {
    if (document.hidden) {
        // Pause animation
        cancelAnimationFrame(animationRequest);
    } else {
        // Resume animation
        sceneManager.timeController.timer.reset();
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

        playSVG.classList.remove("hidden");
        playSVG.classList.add("visible");
    } else {
        sceneManager.timeController.timer.reset();
        this.querySelector("#pausePlay").innerHTML = "Pause Animation";
        sceneManager.animationPaused = false;

        // Change icon
        let pauseSVG = this.querySelector(".hidden");
        let playSVG = this.querySelector(".visible");

        pauseSVG.classList.add("visible");
        pauseSVG.classList.remove("hidden");
        
        playSVG.classList.add("hidden");
        playSVG.classList.remove("visible");
    } 
}

function hideShow(e) {
    let text = this.querySelector("#hideShow").textContent;
    if (text == "Hide Trajectories") {
        sceneManager.hideTrajectories();

        this.querySelector("#hideShow").innerHTML = "Show Trajectories";

        // Change icon
        let hideSVG = this.querySelector(".visible");
        let showSVG = this.querySelector(".hidden");

        hideSVG.classList.remove("visible");
        hideSVG.classList.add("hidden");

        showSVG.classList.remove("hidden");
        showSVG.classList.add("visible");
    } else {
        sceneManager.showTrajectories();

        this.querySelector("#hideShow").innerHTML = "Hide Trajectories";

        // Change icon
        let hideSVG = this.querySelector(".hidden");
        let showSVG = this.querySelector(".visible");

        hideSVG.classList.add("visible");
        hideSVG.classList.remove("hidden");
        
        showSVG.classList.add("hidden");
        showSVG.classList.remove("visible");
    } 
}

function moveCameraToTopView(e) {
    let inclinations = [data.planets.gj876b.i, data.planets.gj876c.i, data.planets.gj876d.i, data.planets.gj876e.i];

    let i = (inclinations.reduce((acc, value) => acc + value)) / inclinations.length; // Mean inclination
    let distance = 1;

    sceneManager.travelController.setTravelPath(sceneManager.camera, i, distance);
}

function reset() {
    sceneManager.resetScene();
}

function toggleMenuAnimation(e) {
    const menuContentNode = this.nextElementSibling;
    if (menuContentNode.classList.contains('show-menu-content')) {
        menuContentNode.classList.remove('show-menu-content');
        this.classList.remove('active');    
    } else {
        if (document.querySelectorAll('.show-menu-content').length != 0) {
            document.querySelectorAll('.show-menu-content')[0].classList.remove('show-menu-content');
            document.querySelectorAll('.active')[0].classList.remove('active');
        }
        menuContentNode.classList.add('show-menu-content');
        this.classList.add('active');
    }
}

function limitSelectedCheckboxes(e) {
    const limit = 2;
    const linkLineCheckboxes = document.querySelectorAll('#linkLine-checkboxes input:checked');
    if (linkLineCheckboxes.length > limit) {
        this.checked = false;
    }
}

function setAnimationSpeed(speed) {
    sceneManager.setAnimationSpeed(speed);
}

function drawLinkLines(e) {
    moveCameraToTopView();
    sceneManager.resetScene();
    sceneManager.hideTrajectories();
    // TODO: change hide/show button icon

    const checkboxes = document.querySelectorAll('#linkLine-checkboxes input');
    let checkedPlanets = [];
    for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            // Get associated planet of checked box
            switch (checkboxes[i].id) {
                case "ll-b":
                    checkedPlanets.push("gj876b");
                    break;
                case "ll-c":
                    checkedPlanets.push("gj876c");
                    break;
                case "ll-d":
                    checkedPlanets.push("gj876d");
                    break;
                case "ll-e":
                    checkedPlanets.push("gj876e");
                    break;
                default:
                    break;
            }
        }
    }

    sceneManager.linkLinesController.prepareDrawing(checkedPlanets);    
}
