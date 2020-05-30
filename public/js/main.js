// create scenemanager
// attach listeners to dom elements (eg windowresize)
// start render loop

let canvas = document.getElementById("canvas");
let sceneManager = new SceneManager(canvas);

//bindEventListeners();
render();
//addAxesHelper();

function render() {
    sceneManager.update();
    requestAnimationFrame(render);
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