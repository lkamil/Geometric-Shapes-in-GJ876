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
checkInitialStates();

render();

function render() {
    animationRequest = requestAnimationFrame(render);
    sceneManager.update();
}

function checkInitialStates() {
    resizeCanvas();
    validateInputLinkLines();
    validateLoopFigureInput();
    sceneManager.setAnimationSpeed(document.getElementById("animationSpeedSlider").value);

    if (document.getElementById("switch").checked) {
        sceneManager.switchToLightMode();
    }

    hideShowConjunctionsLine();
    hideShowOppositionsLine();
    hideShowLinkLines();
    
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

    const linkLinesCheckboxes = document.querySelectorAll('#linkLine-checkboxes input');
    linkLinesCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', limitSelectedCheckboxes, false);
        checkbox.addEventListener('change', validateInputLinkLines, false);
        checkbox.addEventListener('change', setSuggestedLinkLinesInterval, false);
    });

    const loopFigureRadioButtons = document.querySelectorAll('.checkboxes.loopFigure input');
    loopFigureRadioButtons.forEach(checkbox => {
        checkbox.addEventListener('change', validateLoopFigureInput, false);
    });

    const hideShowButton = document.querySelector("#hideShowButton");
    hideShowButton.addEventListener("click", hideShowLabels, false);
    // hideShowButton.addEventListener("click", hideShowTrajectories, false);

    const toggleLoopFigureMenuButton = document.getElementById("openDrawLoopFigureMenu");
    toggleLoopFigureMenuButton.addEventListener("click", toggleMenuAnimation, false);

    const lightModeSwitch = document.getElementById("switch");
    lightModeSwitch.addEventListener('change', toggleLightMode, false);

    const animationSpeedSlider = document.getElementById("animationSpeedSlider");
    animationSpeedSlider.oninput = function() {
        sceneManager.setAnimationSpeed(this.value);
        setSuggestedLinkLinesInterval();
    }

    let showConjunctions = document.getElementById("ll-conjunctions");
    showConjunctions.addEventListener('change', hideShowConjunctionsLine, false);

    let showOppositions = document.getElementById("ll-oppositions");
    showOppositions.addEventListener('change', hideShowOppositionsLine, false);

    let showLinkLines = document.getElementById("ll-visibility");
    showLinkLines.addEventListener('change', hideShowLinkLines, false);

    // Draw Buttons
    const drawLinkLinesButton = document.getElementById("drawLinkLinesButton");
    drawLinkLinesButton.addEventListener('click', drawLinkLines, false);

    const plotLoopFigureButton = document.getElementById("plotLoopFigureButton");
    plotLoopFigureButton.addEventListener('click', plotLoopFigure, false);
}

function resizeCanvas() {
    canvas.style.width = '100% - 260px';
    canvas.style.height = '100%';

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
        pause();
    } else {
        play();
    } 
}

function pause() {
    sceneManager.pause();
    document.querySelector("#pausePlay").innerHTML = "Play Animation";

    // Switch visibility
    let pauseSVG = document.querySelector("#pause-icon");
    let playSVG = document.querySelector("#play-icon");

    show(playSVG);
    hide(pauseSVG);
}

function play() {
    sceneManager.play();
    sceneManager.timeController.timer.reset();
    document.querySelector("#pausePlay").innerHTML = "Pause Animation";

    // Switch visibility
    let pauseSVG = document.querySelector("#pause-icon");
    let playSVG = document.querySelector("#play-icon");

    show(pauseSVG);
    hide(playSVG);
}

function hideShowTrajectories(e) {
    let text = this.querySelector("#hideShow").textContent;

    let eyesSlashSVG = document.querySelector("#eyes-slash-icon");
    let eyesSVG = document.querySelector("#eyes-icon");

    if (text == "Hide Trajectories") {
        sceneManager.hideTrajectories();

        this.querySelector("#hideShow").innerHTML = "Show Trajectories";

        // Switch visbility 
        show(eyesSVG);
        hide(eyesSlashSVG);
    } else {
        sceneManager.showTrajectories();

        this.querySelector("#hideShow").innerHTML = "Hide Trajectories";

        // Switch visbility 
        hide(eyesSVG);
        show(eyesSlashSVG);
    } 
}

function hideShowLabels(e) {
    let text = this.querySelector("#hideShow").textContent;

    let eyesSlashSVG = document.querySelector("#eyes-slash-icon");
    let eyesSVG = document.querySelector("#eyes-icon");

    if (text == "Hide labels") {
        sceneManager.hideLabels();

        this.querySelector("#hideShow").innerHTML = "Show labels";

        // Switch visbility 
        show(eyesSVG);
        hide(eyesSlashSVG);
    } else {
        sceneManager.showLabels();

        this.querySelector("#hideShow").innerHTML = "Hide labels";

        // Switch visbility 
        hide(eyesSVG);
        show(eyesSlashSVG);
    } 
}

function show(icon) {
    icon.classList.remove("hidden");
    icon.classList.add("visible");
}

function hide(icon) {
    icon.classList.remove("visible");
    icon.classList.add("hidden");
}

function moveCameraToTopView(e, distance = 1) {
    const inclinations = [data.planets.gj876b.i, data.planets.gj876c.i, data.planets.gj876d.i, data.planets.gj876e.i];

    const i = (inclinations.reduce((acc, value) => acc + value)) / inclinations.length; // Mean inclination
    // const distance = 1;

    const topViewCoordinates = sceneManager.cameraManager.topViewCoordinates(i, distance);
    sceneManager.travelController.setTravelPath(sceneManager.cameraManager.camera, topViewCoordinates);
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

function toggleLightMode(e) {
    if (this.checked) {
        sceneManager.switchToLightMode();
    } else {
        sceneManager.switchToDarkMode();
    }
}

function validateInputLinkLines() {
    const checkedBoxes = document.querySelectorAll('#linkLine-checkboxes input:checked');
    const drawButton = document.querySelector("#drawLinkLinesButton");
    if (checkedBoxes.length == 2) {
        drawButton.classList.remove("grayed-out");
    } else if (!drawButton.classList.contains("grayed-out")) {
        drawButton.classList.add("grayed-out");
    }
}

function drawLinkLines(e) {
    const checkedBoxes = document.querySelectorAll('#linkLine-checkboxes input:checked');
    if (checkedBoxes.length == 2) {
        moveCameraToTopView();
        sceneManager.resetScene();
        sceneManager.hideTrajectories();

        // document.querySelector("#hideShow").innerHTML = "Show labels";
        // const eyesSlashSVG = document.querySelector("#eyes-slash-icon");
        // hide(eyesSlashSVG);
        // const eyesSVG = document.querySelector("#eyes-icon");
        // show(eyesSVG);

        // Get interval and convert it from minutes to days
        let interval = document.getElementById("interval").value;
        interval /= 1440;

        let checkedPlanets = parseSelectedPlanetsInLinkLinesMenu(checkedBoxes);
        
        if (sceneManager.animationPaused) {
            play();
        }
        sceneManager.linkLinesController.prepareDrawing(interval, checkedPlanets); 
        
        // Get Planets that are not selected and hide them
        let allPlanetNames = ["gj876b", "gj876c", "gj876d", "gj876e"];
        let notSelected = allPlanetNames.filter(p => !checkedPlanets.includes(p));

        // Hide star
        // sceneManager.solarSystem.star.hide();

        // Hide planets
        for (let i = 0; i < notSelected.length; i++) {
            sceneManager.hidePlanet(notSelected[i]);
        }
    }
}

function setSuggestedLinkLinesInterval() {
    const speedFactor = document.getElementById("animationSpeedSlider").value;
    // Check if 2 planets for drawing link lines are selected
    const checkedBoxes = document.querySelectorAll('#linkLine-checkboxes input:checked');
    if (checkedBoxes.length == 2) {
        let checkedPlanets = parseSelectedPlanetsInLinkLinesMenu(checkedBoxes);
        // Get orbital periods
        let orbitalPeriods = [];
        for (let i = 0; i < checkedPlanets.length; i++) {
            for(let j = 0; j < Object.keys(data.planets).length; j++) {
                let planet = Object.values(data.planets)[j];
                if (planet.label == checkedPlanets[i]) {
                    orbitalPeriods.push(planet.orbitalPeriod);
                }
            }
        }
        let recommenedInterval = sceneManager.linkLinesController.recommendInterval(speedFactor, orbitalPeriods);
        document.getElementById("interval").value = recommenedInterval;
    }
}

function parseSelectedPlanetsInLinkLinesMenu(checkedBoxes) {
    let selectedPlanets = [];
    for (let i = 0; i < checkedBoxes.length; i++) {
        switch (checkedBoxes[i].id) {
            case "ll-b":
                selectedPlanets.push("gj876b");
                break;
            case "ll-c":
                selectedPlanets.push("gj876c");
                break;
            case "ll-d":
                selectedPlanets.push("gj876d");
                break;
            case "ll-e":
                selectedPlanets.push("gj876e");
                break;
            default:
                break;
        }
    }

    return selectedPlanets;
}

function validateLoopFigureInput() {
    const drawButton = document.getElementById("plotLoopFigureButton");
    const innerPlanet = document.querySelectorAll('#loopFigure-checkboxes-inner > input:checked');
    const outerPlanet = document.querySelectorAll('#loopFigure-checkboxes-outer > input:checked');

    const innerPlanetSelected = (innerPlanet.length > 0) ? true : false;
    const outerPlanetSelected = (outerPlanet.length > 0) ? true : false;

    if (innerPlanetSelected && outerPlanetSelected) {
        // Check if two different planets are selected
        if (innerPlanet[0].value != outerPlanet[0].value) {
            drawButton.classList.remove("grayed-out");
        } else if(!drawButton.classList.contains("grayed-out")) {
            drawButton.classList.add("grayed-out");
        }
    }
}

function plotLoopFigure() {
    const innerPlanet = document.querySelector('#loopFigure-checkboxes-inner > input:checked');
    const outerPlanet = document.querySelector('#loopFigure-checkboxes-outer > input:checked');

    if (innerPlanet.value != outerPlanet.value) {
        // Get inner planet name
        let innerPlanetName = getPlanetName(innerPlanet.value);

        // Get outer planet name
        let outerPlanetName = getPlanetName(outerPlanet.value);

        moveCameraToTopView();
        sceneManager.resetScene();
        sceneManager.hideTrajectories();

        // Update show/hide button
        // document.querySelector("#hideShow").innerHTML = "Show Trajectories";
        // const eyesSlashSVG = document.querySelector("#eyes-slash-icon");
        // hide(eyesSlashSVG);
        // const eyesSVG = document.querySelector("#eyes-icon");
        // show(eyesSVG);

        if (sceneManager.animationPaused) {
            play();
        }
        sceneManager.loopFigureController.prepareDrawing(innerPlanetName, outerPlanetName);

        // Get Planets that are not selected and hide them
        let allPlanetNames = ["gj876b", "gj876c", "gj876d", "gj876e"];
        let notSelected = allPlanetNames.filter(p => (p != innerPlanetName)).filter(p => p != outerPlanetName);

        // Hide star
        sceneManager.solarSystem.star.hide();

        // Hide planets
        for (let i = 0; i < notSelected.length; i++) {
            sceneManager.hidePlanet(notSelected[i]);
        }
    }
}

function getPlanetName(abbreviation) {
    switch (abbreviation) {
        case "b":
            planetName = "gj876b";
            break;
        case "c":
            planetName = "gj876c";
            break;
        case "d":
            planetName = "gj876d";
            break;
        case "e":
            planetName = "gj876e";
            break;
        default:
            console.log("Cannot parse selected planet");
            return
    }

    return planetName;
}

function hideShowConjunctionsLine() {
    let showConjunctions = document.getElementById("ll-conjunctions");
    if (showConjunctions.checked) {
        sceneManager.linkLinesController.showConjunctions();
    } else {
        sceneManager.linkLinesController.hideConjunctions();
    }
}

function hideShowOppositionsLine() {
    let showOppositions = document.getElementById("ll-oppositions");
    if (showOppositions.checked) {
        sceneManager.linkLinesController.showOppositions();
    } else {
        sceneManager.linkLinesController.hideOppositions();
    }
}

function hideShowLinkLines() {
    let showLinkLines = document.getElementById("ll-visibility");
    if (showLinkLines.checked) {
        sceneManager.linkLinesController.show();
    } else {
        sceneManager.linkLinesController.hide();
    }
}
