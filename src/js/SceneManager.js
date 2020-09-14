class SceneManager {

    constructor(canvas, data) {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.scene = this.initScene();
        this.renderer = this.initRenderer(canvas);
        this.cameraManager = new CameraManager(this.scene);
        this.orbitControls = this.initOrbitControls();
        this.sceneSubjects = this.createSceneSubjects(this.scene, data); 
        this.timeController = new TimeController(); // Keeps track of time
        this.travelController = new TravelController();
        this.linkLinesController = new LinkLinesController(this.scene);

        this.animationPaused = false;
    }

    initScene() {
        const scene = new THREE.Scene();

        // Add background image
        // scene.background = new THREE.Color("#09071e");
        let geometry = new THREE.SphereGeometry( 1.5, 8, 8);
        geometry.scale( - 1, 1, 1 );
        var material = new THREE.MeshBasicMaterial( {
            map: new THREE.TextureLoader().load( '../assets/images/8k_stars.jpg' )
        } );
        let mesh = new THREE.Mesh( geometry, material );
        scene.add( mesh );

        return scene;
    }

    initRenderer(canvas) {
        let renderer = new THREE.WebGLRenderer();
        renderer.setSize(this.width, this.height); // Define the size of the scene

        //renderer.shadowMap.enabled = true;

        // Show Axes
        var axes = new THREE.AxesHelper(19);
        // this.scene.add(axes);

        // Append renderer??
        canvas.appendChild(renderer.domElement);

        return renderer;
    }

    initOrbitControls() {
        let orbitControls = new THREE.OrbitControls(this.cameraManager.camera, this.renderer.domElement);

        return orbitControls;
    }

    createSceneSubjects(scene, data) {
        // Add new scene subjects
        const sceneSubjects = [
            new AmbientLight(scene),
            new SolarSystem(scene, data),
        ];
        return sceneSubjects;
    }

    update() {
        this.orbitControls.update();

        let newCameraPosition = this.travelController.update();
        if (newCameraPosition) {
            this.cameraManager.setPosition(newCameraPosition);
        }

        if (!this.animationPaused) {
            this.timeController.timer.update();

            let dt = this.timeController.dt();
            for (let i = 0; i < this.sceneSubjects.length; i++) {
                this.sceneSubjects[i].update(dt);
            }

            if (this.linkLinesController.active) {
                let planetLocations = this.getLocationsOfPlanets(this.linkLinesController.involvedPlanets);
                this.linkLinesController.update(planetLocations[0], planetLocations[1]);
            }
        }
        
        this.renderer.render(this.scene, this.cameraManager.camera);
    }

    resetScene() {
        this.timeController.timer.hardReset();

        // Reset trajectories
        this.resetTrajectories();
        this.linkLinesController.clear();
    }

    resetTrajectories() {
        for (let i = 0; i < this.sceneSubjects.length; i++) {
            if (this.sceneSubjects[i] instanceof SolarSystem) {
                const solarSystem = this.sceneSubjects[i];
                solarSystem.reset();
            }
        }
    }

    hideTrajectories() {
        for (let i = 0; i < this.sceneSubjects.length; i++) {
            if (this.sceneSubjects[i] instanceof SolarSystem) {
                const solarSystem = this.sceneSubjects[i];
                for (let i = 0; i < solarSystem.numberOfPlanets; i++) {
                    solarSystem.planets[i].trajectory.line.visible = false;
                }
            }
        }
    }

    showTrajectories() {
        for (let i = 0; i < this.sceneSubjects.length; i++) {
            if (this.sceneSubjects[i] instanceof SolarSystem) {
                const solarSystem = this.sceneSubjects[i];
                for (let i = 0; i < solarSystem.numberOfPlanets; i++) {
                    solarSystem.planets[i].trajectory.line.visible = true;
                }
            }
        }
    }

    setAnimationSpeed(speed) {
        this.timeController.setSpeedFactor(speed);
    }

    /**
     * Gets an array of characters and returns the corresponding planets
     * @param {Names of checked planets} checkedPlanets
     */
    parsePlanets(checkedPlanets) {
        let parsedPlanets = [];

        for (let i = 0; i < this.sceneSubjects.length; i++) {
            // Get planets of the solar system
            if (this.sceneSubjects[i] instanceof SolarSystem) {
                const solarSystem = this.sceneSubjects[i];
                const planets = solarSystem.planets;
                
                // Check if planet is in checked list
                for(let j = 0; j < solarSystem.numberOfPlanets; j++) {
                    if (checkedPlanets.includes(planets[j].name)) {
                        parsedPlanets.push(planets[j]);
                    }
                }
            }
        }
        
    }

    getLocationsOfPlanets(planetNames) {
        let planetLocations = [];

        for (let i = 0; i < this.sceneSubjects.length; i++) {
            // Access planets of the solar system
            if (this.sceneSubjects[i] instanceof SolarSystem) {
                const solarSystem = this.sceneSubjects[i];
                const planets = solarSystem.planets;
                
                // Parse planets and get their locations
                for(let j = 0; j < solarSystem.numberOfPlanets; j++) {
                    if (planetNames.indexOf(planets[j].name) >= 0) {
                        planetLocations.push(planets[j].mesh.position);
                    }
                }
            }
        }

        return planetLocations;
    }

    onWindowResize () {
        this.width = window.innerWidth - 260;
        this.heigt = window.innerHeight;

        this.cameraManager.camera.aspect = this.width / this.height;
        this.cameraManager.camera.updateProjectionMatrix();
        
        this.renderer.setSize(this.width, this.height);
    };
}
