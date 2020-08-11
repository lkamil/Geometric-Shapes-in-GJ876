class SolarSystem {
    constructor(scene, data) {
        // this.data = data;
        // let starRadius = 0.1; // in solar Radius, 1 solarRadius = 6.957 * 10^5 km
        // let starMass = 0.32;
        // this.star = new Star(scene, starRadius, starMass);
        this.star = new Star(scene, data.gj876);

        // let bMass = 0.00228;
        // let bRadius = 0.08;
        // let bLocation = new THREE.Vector3( 0.15, 0, 0.14);
        // let bColor = new THREE.Color( 0xac3729 );
        this.planetB = new Planet(scene, data.planets.gj876b, new THREE.Color( 0xac3729 ));
        this.planetC = new Planet(scene, data.planets.gj876c, new THREE.Color( 0x0c3789 ));
        this.planetD = new Planet(scene, data.planets.gj876d, new THREE.Color( 0x1fadd1 ));

        this.objects = new THREE.Object3D();
        this.objects.add(this.star.mesh);
        this.objects.add(this.planetB.mesh);
        this.objects.add(this.planetC.mesh);
        this.objects.add(this.planetD.mesh);
        scene.add(this.objects);
        //this.objects.scale.set(new THREE.Vector3(0.5,0.5,0.5));
        //this.objects = [this.star, this.planetB];
    }

    update(elapsedTime) {
        // Apply forces
        //this.planetB.applyForce(gravity);
        //this.planetB.applyForce(v_angular_momentum_plB);
        let speed = 1;
        this.star.update(elapsedTime * speed);
        this.planetB.update(elapsedTime * speed);
        this.planetC.update(elapsedTime * speed);
        this.planetD.update(elapsedTime * speed);
        // console.log(this.planetB['location']);
    }

    /**
     * Calculate the acceleration of each object
     * @param {The masses of all objects in the solar system} masses 
     * @param {The gravitational constant} g 
     * @param {The softeningConstant} softeningConstant 
     */
    updateAccelerationVector(masses, g, softeringConstant) {
        let numberOfObjects = masses.length;

        // Iterate through the list of all masses to calculate the gravitational forces
        for(let i = 0; i < numberOfObjects; i++) {
            let ax = 0;
            let ay = 0;
            let az = 0;

            let currentMass = masses[i];

            for (let j = 0; j < numberOfObjects; j++) {
                // Calculate the forces every other mass applies on the current mass
                if (i != j) {
                    let massJ = masses[j];
                    let dx = massJ.x - currentMass.x
                }
            }
        }

    }
}