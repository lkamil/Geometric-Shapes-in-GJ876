class SolarSystem {
    constructor(scene) {
        let starRadius = 0.3761; // in solar Radius, 1 solarRadius = 6.957 * 10^5 km
        this.star = new Star(scene, starRadius);

        let bMass = 2.27;
        let bRadius = 1;
        let bLocation = new THREE.Vector3( 5, 0, 7);
        let bColor = new THREE.Color( 0xac3729 );
        this.planetB = new Planet(scene, bMass, bRadius, bLocation, bColor);
    }

    update(elapsedTime) {
        //debugger
        // Calculate forces
        let v_angular_momentum_plB = calcAngularMomentum(this.planetB['location'], this.planetB['mass'], this.planetB['velocity']);
        let gravity = this.star.attract(this.planetB);

        // Apply forces
        this.planetB.applyForce(gravity);
        //this.planetB.applyForce(v_angular_momentum_plB);

        

        this.star.update(elapsedTime);
        this.planetB.update(elapsedTime);
    }
}