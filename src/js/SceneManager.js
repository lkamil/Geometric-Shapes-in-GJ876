class SceneManager {

    constructor(canvas, data) {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.scene = this.initScene();
        this.renderer = this.initRenderer(canvas);
        this.labelRenderer = this.initLabelRenderer(canvas);
        this.coordinateAxes = this.initCoordinateAxes(this.scene);
        this.light = this.addLight(this.scene);
        this.cameraManager = new CameraManager(this.scene);
        this.orbitControls = this.initOrbitControls();
        this.solarSystem = new SolarSystem(this.scene, data);
        this.timeController = new TimeController(); // Keeps track of time
        this.travelController = new TravelController();
        this.linkLinesController = new LinkLinesController(this.scene);
        this.loopFigureController = new LoopFigureController(this.scene);

        this.animationPaused = false;
    }

    initScene() {
        const scene = new THREE.Scene();

        let backgroundTexture = this.backgroundTexture();
        scene.add(backgroundTexture);
        
        return scene;
    }

    initRenderer(canvas) {
        let renderer = new THREE.WebGLRenderer();
        renderer.setSize(this.width, this.height); // Define the size of the scene
        //renderer.shadowMap.enabled = true;

        canvas.appendChild(renderer.domElement);

        return renderer;
    }

    initLabelRenderer(canvas) {
        let labelRenderer = new CSS2DRenderer();
		labelRenderer.setSize(this.width, this.height);
        labelRenderer.domElement.style.position = 'absolute';
        labelRenderer.domElement.style.top = '0px';
        canvas.appendChild(labelRenderer.domElement);

        return labelRenderer;
    }

    initOrbitControls() {
        // let orbitControls = new THREE.OrbitControls(this.cameraManager.camera, this.renderer.domElement);
        let orbitControls = new THREE.OrbitControls(this.cameraManager.camera, this.labelRenderer.domElement);

        return orbitControls;
    }

    initCoordinateAxes(scene) {
        let size = 0.8;
        let coordinateAxes = new CoordinateAxes(scene, size);
        
        coordinateAxes.hide();

        return coordinateAxes;
    }

    addLight(scene) {
        let ambientLight = new THREE.AmbientLight( 0xffffff );
        scene.add(ambientLight);

        return ambientLight;
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
            this.solarSystem.update(dt);
            this.updateStats(dt);

            if (this.linkLinesController.active) {
                const selectedPlanets = this.linkLinesController.involvedPlanets;

                let planetLocations = [];
                for (let i = 0; i < selectedPlanets.length; i++) {
                    planetLocations.push(this.getLocationOfPlanet(selectedPlanets[i]));
                }

                let starLocation = this.solarSystem.star.getLocation();
                this.linkLinesController.update(dt, starLocation, planetLocations[0], planetLocations[1]);     
            }

            if (this.loopFigureController.active) {
                const innerPlanetLocation = this.getLocationOfPlanet(this.loopFigureController.innerPlanet);
                const translationVector = this.loopFigureController.getInvertedVector(innerPlanetLocation);

                this.solarSystem.translateAllObjects(translationVector);
                const outerPlanetLocation = this.getLocationOfPlanet(this.loopFigureController.outerPlanet);
                this.loopFigureController.addPosition(outerPlanetLocation);
            }
        }
        
        this.renderer.render(this.scene, this.cameraManager.camera);
        this.labelRenderer.render(this.scene, this.cameraManager.camera);
    }

    updateStats(dt) {
        let passedDays = Math.round(dt * 10) / 10;
        let passedYears = Math.round(passedDays / 365.25 * 100) / 100;
        document.getElementById("passedDaysValue").innerHTML = passedDays;
        document.getElementById("passedYearsValue").innerHTML = passedYears;
    }

    resetScene() {
        // Reset scene
        this.timeController.timer.hardReset();

        // Reset trajectories
        this.resetTrajectories();

        // Clear link lines
        this.linkLinesController.clear();
        this.linkLinesController.active = false;

        // Clear plot of loop figure
        this.loopFigureController.active = false;
        this.loopFigureController.clear();

        // Show all celestial objects
        this.solarSystem.showAllObjects();

        // Move star to center
        this.solarSystem.star.moveToCenter();
    }

    resetTrajectories() {
        this.solarSystem.reset();
    }

    hideTrajectories() {
        for (let i = 0; i < this.solarSystem.numberOfPlanets; i++) {
            this.solarSystem.planets[i].trajectory.line.visible = false;
        }
    }

    showTrajectories() {
        for (let i = 0; i < this.solarSystem.numberOfPlanets; i++) {
            this.solarSystem.planets[i].trajectory.line.visible = true;
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

        const planets = this.solarSystem.planets;
                
        // Check if planet is in checked list
        for(let j = 0; j < this.solarSystem.numberOfPlanets; j++) {
            if (checkedPlanets.includes(planets[j].name)) {
                parsedPlanets.push(planets[j]);
            }
        }
    }

    /**
     * Gets a planet name and returns corresponding planet location
     * @param {planet namee} planetName
     * TODO: Add error handling
     */
    getLocationOfPlanet(planetName) {
        let planetLocation;

        // for (let i = 0; i < this.sceneSubjects.length; i++) {
        // Access planets of the solar system
        const planets = this.solarSystem.planets;
        
        // Parse planets and get their locations
        for(let j = 0; j < this.solarSystem.numberOfPlanets; j++) {
            if (planetName == planets[j].name) {
                planetLocation = planets[j].getLocation();
            }
        }

        return planetLocation;
    }

    /**
     * Returns an array that contains the location vector of each planet
     */
    getAllPlanetLocations() {
        let planetLocations = [];

        const planets = this.solarSystem.planets;
                
        // Parse planets and get their locations
        for(let j = 0; j < this.solarSystem.numberOfPlanets; j++) {
            planetLocations.push(planets[j].getLocation());
        }

        return planetLocations;
    }

    hidePlanet(planetName) {
        for (let i = 0; i < this.solarSystem.numberOfPlanets; i++) {
            if (this.solarSystem.planets[i].name == planetName) {
                this.solarSystem.planets[i].hide();
            }
        }
    }

    onWindowResize () {
        this.width = window.innerWidth - 260;
        this.heigt = window.innerHeight;

        this.cameraManager.camera.aspect = this.width / this.height;
        this.cameraManager.camera.updateProjectionMatrix();
        
        this.renderer.setSize(this.width, this.height);
        this.labelRenderer.setSize(this.width, this.height);
    };

    switchToLightMode() {
        // Remove background texture
        for (let i = 0; i < this.scene.children.length; i++) {
            if (this.scene.children[i].name == "sceneTexture") {
                let sceneTexture = this.scene.children[i];
                this.scene.remove(sceneTexture);
                break;
            }
        }
        
        // Set new background color
        this.scene.background = new THREE.Color("#fff");
        this.solarSystem.switchToLightMode();

        // Show coordinate axes
        this.coordinateAxes.show();
    }

    switchToDarkMode() {
        let backgroundTexture = this.backgroundTexture();
        this.scene.add(backgroundTexture);

        this.scene.background = new THREE.Color("#000");
        this.solarSystem.switchToDarkMode();

        // Hide coordinate axes
        this.coordinateAxes.hide();
    }

    backgroundTexture() {
        let geometry = new THREE.SphereGeometry( 1.5, 8, 8);
        geometry.scale( - 1, 1, 1 );
        let material = new THREE.MeshBasicMaterial( {
            map: new THREE.TextureLoader().load( '../assets/images/8k_stars.jpg' )
        } );
        let mesh = new THREE.Mesh(geometry, material);
        mesh.name = "sceneTexture";

        return mesh;
    }

    play() {
        this.animationPaused = false;
    }

    pause() {
        this.animationPaused = true;
    }
}
