
class SceneManager {

    constructor(canvas) {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.scene = this.initScene();
        this.renderer = this.initRenderer(canvas);
        this.camera = this.initCamera();
        this.sceneSubjects = this.createSceneSubjects(this.scene); 
    }

    initScene() {
        console.log("Init Scene");
        const scene = new THREE.Scene();
        scene.background = new THREE.Color("#c85976");
        return scene;
    }

    initRenderer(canvas) {
        //const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
        let renderer = new THREE.WebGLRenderer();
        renderer.setSize(this.width, this.height); // Define the size of the scene
        ///renderer.setClearColor(0x0e1628, 1.0); // Set a background color
        renderer.shadowMap.enabled = true;
        var axes = new THREE.AxesHelper(20);
        this.scene.add(axes);

        // Append renderer??
        canvas.appendChild(renderer.domElement);
        // document.getElementById("canvas").appendChild(renderer.domElement);
        return renderer;
    }

    initCamera() {
        let fov = 45;
        let aspect = this.width / this.height;
        let near = 0.1;
        let far = 1000;
        const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        camera.position.x = -30;
        camera.position.y = 40;
        camera.position.z = 30;
        // Making the camera point to the center of the scene using lookAt()
        camera.lookAt(this.scene.position);
        console.log("Scene Position: " + this.scene.position.x + " " + this.scene.position.y + " " + this.scene.position.z);

        return camera;
    }

    createSceneSubjects(scene) {
        // Add new scene Subjects here
        const sceneSubjects = [
            new BasicLight(scene),
            new Sun(scene),
        ];
        return sceneSubjects;
    }

    update() {
        // console.log(this.sceneSubjects);
        for (let i = 0; i < this.sceneSubjects.length; i++) {
            this.sceneSubjects[i].update();
        }
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize () {
        console.log("Window resized");

        this.width = window.innerWidth;
        this.heigt = window.innerHeight;

        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
        
        this.renderer.setSize(this.width, this.height);
    };
}

