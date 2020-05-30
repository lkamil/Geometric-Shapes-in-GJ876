
function SceneManager(canvas) {

    let screenDimensions = {
        width: canvas.width,
        heigt: canvas.height
    }

    const scene = initScene();
    const renderer = initRenderer(screenDimensions);
    const camera = initCamera(screenDimensions);
    const sceneSubjects = createSceneSubjects(scene);

    function initScene() {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color("#c85976");

        return scene;
    }

    // COOL :)
    function initRenderer({ width, height }) {

        //const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
        let renderer = new THREE.WebGLRenderer();
        renderer.setSize(width, height); // Define the size of the scene
        ///renderer.setClearColor(0x0e1628, 1.0); // Set a background color
        renderer.shadowMap.enabled = true;

        var axes = new THREE.AxesHelper(20);
        scene.add(axes);

        return renderer;
    }

    function initCamera({width, height}) {
        let fov = 45;
        let aspect = width / height;
        let near = 0.1;
        let far = 1000;

        const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

        camera.position.x = -30;
        camera.position.y = 40;
        camera.position.z = 30;

        // Making the camera point to the center of the scene using lookAt()
        camera.lookAt(scene.position);
        console.log("Scene Position: " + scene.position.x + " " + scene.position.y + " " + scene.position.z);

        return camera;
    }

    function createSceneSubjects(scene) {
        // Add new scene Subjects here
        const sceneSubjects = [
            new BasicLight(scene),
            new Sun(scene),
            // new Plane(scene)
            // new Planet(scene)
        ];
        
        return sceneSubjects;
    }

    this.update = function() {
        // console.log(sceneSubjects);
        for (let i = 0; i < sceneSubjects.length; i++) {
            sceneSubjects[i].update();
        }
    
        renderer.render(scene, camera);
    }

    this.onWindowResize = function() {
        let { width, height } = canvas;

        screenDimensions.width = width;
        screenDimensions.heigt = height;

        // camera.aspect = width / height;
        // ...
    }

}

