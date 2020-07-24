
class SceneManager {

    constructor(canvas) {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.scene = this.initScene();
        this.renderer = this.initRenderer(canvas);
        this.camera = this.initCamera();
        this.orbitControls = this.initOrbitControls();
        this.sceneSubjects = this.createSceneSubjects(this.scene);
        this.clock = new THREE.Clock();
    }

    initScene() {
        console.log("Init Scene");
        const scene = new THREE.Scene();
        scene.background = new THREE.Color("#09071e");
        return scene;
    }

    initRenderer(canvas) {
        let renderer = new THREE.WebGLRenderer();
        renderer.setSize(this.width, this.height); // Define the size of the scene

        //renderer.shadowMap.enabled = true;

        // Show Axes
        var axes = new THREE.AxesHelper(19);
        this.scene.add(axes);

        // Append renderer??
        canvas.appendChild(renderer.domElement);

        return renderer;
    }

    initCamera() {
        let fov = 45;
        let aspect = this.width / this.height;
        let near = 0.1;
        let far = 1000;
        const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        camera.position.x = -3;
        camera.position.y = 4;
        camera.position.z = 3;
        // Making the camera point to the center of the scene using lookAt()
        camera.lookAt(this.scene.position);
        console.log("Scene Position: " + this.scene.position.x + " " + this.scene.position.y + " " + this.scene.position.z);

        return camera;
    }

    initOrbitControls() {
        let orbitControls = new THREE.OrbitControls( this.camera, this.renderer.domElement);

        return orbitControls;
    }

    createSceneSubjects(scene) {
        // Add new scene Subjects here
        const sceneSubjects = [
            new BasicLight(scene),
            new SolarSystem(scene)
        ];
        return sceneSubjects;
    }

    update() {
        // console.log(this.sceneSubjects);

        this.orbitControls.update();

        let elapsedTime = this.clock.getElapsedTime();
        for (let i = 0; i < this.sceneSubjects.length; i++) {
            this.sceneSubjects[i].update(elapsedTime);
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

