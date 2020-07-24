class Planet {
    constructor(scene, data) {
        this.a = data.a; // Large semi axis
        this.e = data.e; // Numeric eccentricity
        this.radius = data.radius;
        this.mass = data.mass;
        this.currentDistance = data.periapsis;
        this.inclination = 0; // TODO: use data.inclination
        this.position = this.initPosition();
        this.velocity = this.initVelocity();
        
        let planetGeometry = new THREE.SphereGeometry(this.radius, 20, 20);
        let planetMaterial = new THREE.MeshLambertMaterial({color: _color});
        this.mesh = new THREE.Mesh(planetGeometry, planetMaterial);

        this.mesh.receiveShadow = true;

        scene.add(this.mesh);
        this.mesh.position.set = this.location;
        // debugger
    }

    initVelocity() {
        return calcOrbitalSpeedAtPosition(this.position);
    }

    initPosition() {
        const x = this.currentDistance; // Equals periapsis
        const y = 0; //Inclination is set to 0
        const z = 0;
        let position = new THREE.Vector3(x, y, z);

        return position;
    }

    meanAnomaly(period,t) {
        const meanAnomaly = (2 * Math.PI / period) * (t - constant.T0);
    
        return meanAnomaly;
    }

    distanceToSun(trueAnomaly) {
        const numerator = this.a * (1 - this.e * this.e);
        const denominator = 1 + this.e * Math.cos(trueAnomaly);

        const r = numerator / denominator;
        return r;
    }

    /**
     * 
     * @param {Mass of star} M 
     * @param {Current time} t
     * @param {True Anomaly at point in time} v
     */
    velocityAtSpecificTime(M, t, v) {
        const r = this.distanceToSun(trueAnomaly);
        const squared = constant.GC * (M + this.mass) * ((2 / r) - (1 / this.a));
        const velocity = Math.sqrt(squared);

        return velocity;
    }

    setVelocity(v) {
        this.velocity = v;
    }

    applyForce(force) {
        //debugger
        // TODO
        // Is force passed by reference??? if yes it needs to be copied
        // force.copy.divide(this.mass); // Newtons second law F = m*a ->  F / m = a

        // TODO: Make sure that masses never equal 0!!
        // Divide force (vector) by mass (scalar)
        let forceCopy = force.clone();
        forceCopy.divideScalar(this.mass); // Newtons second law F = m*a ->  F / m = a
        this.acceleration.add(forceCopy);
    }

    update(elapsedTime) {
        //debugger
        //this.mesh.position.x = Math.cos(elapsedTime) * 20;
        //this.mesh.position.z = Math.sin(elapsedTime) * 20;

        // Apply forces
        this.velocity.add(this.acceleration);
        this.location.add(this.velocity);
        //this.mesh.position.set = this.location;
        this.mesh.position.x = this.location.x;
        this.mesh.position.y = this.location.y;
        this.mesh.position.z = this.location.z;
        // TODO: Find a better way to update the location of the planet
        //console.log("planet location: " + this.location.x + " " + this.location.y +  " " + this.location.z);
        
        // Clear accelaration 
        this.acceleration.multiplyScalar(0);
    }

    static degToRad(deg) {
        return deg * Math.PI / 180;
    }
}