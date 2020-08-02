class Planet {
    constructor(scene, data) {
        this.a = data.a; // Large semi axis
        this.e = data.e; // Numeric eccentricity
        this.radius = rEarthToAU(data.radius); // Radius of the planet in AU
        this.mass = mJupToSolarMass(data.mass); // Convert unit and set planet's mass
        this.orbitalPeroid = data.orbitalPeriod;
        //this.periapsis = data.periapsis; // Distance from Perihelion to Sun
        this.inclination = 0; // TODO: use data.inclination
        this.timeOfPerihelionPassage = 0; // TODO: USe Time of perihelon passage

        // this.position = this.initPosition();
        // this.velocity = this.initVelocity();
        
        // Initialize Planet Graphics
        let planetGeometry = new THREE.SphereGeometry(this.radius, 20, 20);
        let planetMaterial = new THREE.MeshLambertMaterial({color: new THREE.Color( 0xac3729 )});
        this.mesh = new THREE.Mesh(planetGeometry, planetMaterial);
        this.mesh.receiveShadow = true;

        //scene.add(this.mesh);

        //this.mesh.position.set = this.position;
    }

    /**
     * Returns the position of the planet at a specific point in time
     * @param {Point in time} t 
     */
    position(t) {
        
        let mv = this.meanAnomaly(this.orbitalPeroid, t, this.timeOfPerihelionPassage);
        let ev = this.eccentricAnomaly(mv, this.e);
        let v = this.trueAnomaly(ev);
        let r = this.distanceToSun(v);

        return this.cartesianPosition(v, r, this.inclination);
    }

    /**
     * Returns true anomaly at a specific point in time
     * @param {Eccentric anomaly (can be calculated with keplers equation)} ev 
     */
    trueAnomaly(ev) {
        let v = 2 * Math.atan(Math.sqrt((1+this.e) / (1-this.e)) * Math.tan(ev / 2));

        return v;
    }

    /**
     * Returns the eccentric anomaly at a specific point in time.
     * Uses Newton's Method to solve Kepler's Equation.
     * The eccentric anomaly is needed to calculate the true anomaly.
     * 
     * @param {MeanAnomaly at specific point in time} m 
     * @param {Numeric eccentricity} e 
     */
    eccentricAnomaly(m, e) {
        let maxI = 10; // Maximum Iterations
        let i = 0;
        // let precision = Math.pow(10, -8); // Set precision to eight decimal places

        // If eccentricity is small, set initial value of eccentric anomaly equal to mean anomaly
        // Otherwise PI is a better initial value
        let lastEA; // E_i
        let eA;
        //let eA = (e < 0.8 ? m : Math.PI); //E_i+1
        if (e < 0.8) {
            eA = m;
        } else {
            eA = 3.14159;
        }
       
        while (i < maxI) {
            lastEA = eA;
            eA = lastEA - (m - lastEA + e * Math.sin(lastEA)) / (e * Math.cos(lastEA) - 1);
            i++;
            //debugger
        }
        
        return eA;
    }

    /**
     * Returns the mean anomaly at a specific point in time
     * 
     * @param {Orbital Period (in days)} oP 
     * @param {Point in time} t 
     * @param {Time of perihelion passage (in JD)} tp
     */
    meanAnomaly(oP, t, tp) {
        let m = (2 * Math.PI / oP) * (t - tp);

        return m;
    }

    /**
     * Gets polar coordinates as arguments and transforms them to cartesian coordinates
     * 
     * @param {True anomaly} v 
     * @param {Distance to star} r 
     * @param {Inclination} i 
     */
    cartesianPosition(v, r, i) {
        // Transform polar coordinates to cartesian coordinates
        let x = r * Math.cos(i) * Math.cos(v);
        let y = r * Math.sin(i);
        let z = r * Math.cos(i) * Math.sin(v);
        debugger
        return new THREE.Vector3(x, y, z);
    }

    /**
     * Returns the distance to the planet's sun
     * @param {True Anomaly at a specific point in time} vv 
     */
    distanceToSun(v) {
        const numerator = this.a * (1 - this.e * this.e);
        const denominator = 1 + this.e * Math.cos(v);

        const r = numerator / denominator;
        // const r = this.a * (1 - this.e * Math.cos(ev));
        return r;
    }

    /**
     * Returns the velocity of a planet at a specific point in time
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

    // *** Old code ***

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
        // Calculate new planet position
        let pos = this.position(elapsedTime);
        //console.log(pos);
        this.mesh.position.set = pos;


        //this.mesh.position.x = Math.cos(elapsedTime) * 20;
        //this.mesh.position.z = Math.sin(elapsedTime) * 20;

        // Apply forces
        // this.velocity.add(this.acceleration);
        // this.location.add(this.velocity);
        //this.mesh.position.set = this.location;
        // this.mesh.position.x = this.location.x;
        // this.mesh.position.y = this.location.y;
        // this.mesh.position.z = this.location.z;
        // TODO: Find a better way to update the location of the planet
        //console.log("planet location: " + this.location.x + " " + this.location.y +  " " + this.location.z);
        
        // Clear accelaration 
        //this.acceleration.multiplyScalar(0);
    }
}