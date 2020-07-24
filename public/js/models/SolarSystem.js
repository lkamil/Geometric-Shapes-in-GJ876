class SolarSystem {
    constructor(scene) {
        let starRadius = 0.1; // in solar Radius, 1 solarRadius = 6.957 * 10^5 km
        let starMass = 0.32;
        this.star = new Star(scene, starRadius, starMass);

        let bMass = 0.00228;
        let bRadius = 0.08;
        let bLocation = new THREE.Vector3( 0.15, 0, 0.14);
        let bColor = new THREE.Color( 0xac3729 );
        this.planetB = new Planet(scene, bMass, bRadius, bLocation, bColor);

        this.objects = [this.star, this.planetB];
        this.nBodyProblem = new NBodyProblem(this.objects);
    }

    update(elapsedTime) {
        //debugger
        // Calculate forces
        //let v_angular_momentum_plB = calcAngularMomentum(this.planetB['location'], this.planetB['mass'], this.planetB['velocity']);
        //let gravity = this.star.attract(this.planetB);
        //console.log("update");
        // Apply nBody forces
        this.nBodyProblem.addAccelerations();

        // Apply forces
        //this.planetB.applyForce(gravity);
        //this.planetB.applyForce(v_angular_momentum_plB);

        

        this.star.update(elapsedTime);
        this.planetB.update(elapsedTime);
        console.log(this.planetB['location']);
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