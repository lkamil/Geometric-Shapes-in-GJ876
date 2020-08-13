// create scenemanager
// attach listeners to dom elements (eg windowresize)
// start render loop

let data = loadData();
let canvas = document.getElementById("canvas");
let controls = initDatGui();
let sceneManager = new SceneManager(canvas, data);

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
    requestAnimationFrame(render);
    sceneManager.update();
}

function bindEventListeners() {
    window.onresize = resizeCanvas;
    resizeCanvas();
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