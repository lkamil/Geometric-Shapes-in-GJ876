class SolarSystem {
    constructor(scene, data) {
        this.star = new Star(scene, data.gj876);
        this.SGP = constant.GC * this.star.mass; // Standard gravitational parameter  

        // Create planets
        this.planetD = new Planet(scene, data.planets.gj876d, this.SGP, new THREE.Color( 0xFFD8AC ));
        this.planetC = new Planet(scene, data.planets.gj876c, this.SGP, new THREE.Color( 0x9AB9C9 ));
        this.planetB = new Planet(scene, data.planets.gj876b, this.SGP, new THREE.Color( 0xD0CC9F ));
        this.planetE = new Planet(scene, data.planets.gj876e, this.SGP, new THREE.Color( 0x9EB79F ));


        this.planets = [this.planetB, 
                        this.planetC, 
                        this.planetD, 
                        this.planetE];

        this.numberOfPlanets = this.planets.length;

        // Add star to scene
        scene.add(this.star.mesh);

        // Add planets to scene
        for (let i = 0; i < this.numberOfPlanets; i++) {
            scene.add(this.planets[i].mesh);
        }
    }

    update(dt) {
        this.star.update(dt);

        for (let i = 0; i < this.numberOfPlanets; i++) {
            this.planets[i].update(dt);
        }
    }

    reset() {
        for (let i = 0; i < this.numberOfPlanets; i++) {
            this.planets[i].resetTrajectories();
        }
    }

    getObjectPositions() {
        let objectPositions = [this.star.mesh.position];
        for (let i = 0; i < this.numberOfPlanets; i++) {
            objectPositions.push(this.planets[i].getLocation());
        }

        return objectPositions;
    }

    setObjectPositions(newPositions) {
        // Set position of star
        this.star.mesh.position.copy(newPositions[0]);

        // Set planet positions
        for (let i = 0; i < this.numberOfPlanets; i++) {
            this.planets[i].setLocation(newPositions[i]);
        }
    }

    translateAllObjects(v) {
        const origin = new THREE.Vector3(0, 0, 0);
        this.star.setLocation(origin.clone().add(v)); 

        for (let i = 0; i < this.numberOfPlanets; i++) {
            this.planets[i].translatePlanet(v);
        }
    }

    switchToLightMode() {
        for (let i = 0; i < this.numberOfPlanets; i++) {
            this.planets[i].switchToLightMode();
        }
        this.star.mesh.material.color.setHex(0xdddddd);
    }

    switchToDarkMode() {
        for (let i = 0; i < this.numberOfPlanets; i++) {
            this.planets[i].switchToDarkMode();
        }
        this.star.mesh.material.color.setHex(0x813D3D);
    }
}
