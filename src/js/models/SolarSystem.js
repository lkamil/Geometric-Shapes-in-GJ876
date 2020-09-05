class SolarSystem {
    constructor(scene, data) {
        this.star = new Star(scene, data.gj876);
        this.SGP = constant.GC * this.star.mass; // Standard gravitational parameter  

        // Create planets
        this.planetB = new Planet(scene, data.planets.gj876b, this.SGP, new THREE.Color( 0xac3729 ));
        this.planetC = new Planet(scene, data.planets.gj876c, this.SGP, new THREE.Color( 0x0c3789 ));
        this.planetD = new Planet(scene, data.planets.gj876d, this.SGP, new THREE.Color( 0x1fadd1 ));
        this.planetE = new Planet(scene, data.planets.gj876e, this.SGP, new THREE.Color( 0xf4bf4a ));


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
}