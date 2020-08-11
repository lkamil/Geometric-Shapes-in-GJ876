class Planet {
    constructor(scene, data, color) {
        this.a = data.a; // Large semi axis
        this.e = data.e; // Numeric eccentricity
        this.radius = rEarthToAU(data.radius) * 7; // Radius of the planet in AU
        this.mass = mJupToSolarMass(data.mass); // Convert unit and set planet's mass
        this.orbitalPeroid = data.orbitalPeriod;
        //this.periapsis = data.periapsis; // Distance from Perihelion to Sun
        this.i = data.i;
        this.timeOfPerihelionPassage = 0; // TODO: USe Time of perihelon passage
        this.w = data.argOfPeriapsis;
        this.o = data.longitudeOfAscendingNode;

        

        // this.position = this.initPosition();
        // this.velocity = this.initVelocity();
        
        // Initialize Planet Graphics
        let planetGeometry = new THREE.SphereGeometry(this.radius, 20, 20);
        console.log("Planet radius: " + this.radius);
        let planetMaterial = new THREE.MeshLambertMaterial({color: color});
        this.mesh = new THREE.Mesh(planetGeometry, planetMaterial);
        this.mesh.receiveShadow = true;

        this.trajectory = new Trajectory(scene, this.orbitalPeroid);

        //scene.add(this.mesh);

        //this.mesh.position.set = this.position;
    }

    /**
     * Returns the position of the planet at a specific point in time
     * @param {Point in time} t 
     */
    position(t) {
        
        let mv = this.meanAnomaly(this.orbitalPeroid, t, this.timeOfPerihelionPassage);
        //console.log(mv);
        let ev = this.eccentricAnomaly(mv, this.e);
        let v = this.trueAnomaly(ev);
        let r = this.distanceToSun(v);

        let pos = this.cartesianPosition(v, r);

        //pos.multiplyScalar(5);
        return pos;
    }

    /**
     * Returns true anomaly at a specific point in time
     * @param {Eccentric anomaly (can be calculated with keplers equation)} ev 
     */
    trueAnomaly(ev) {
        //let v = 2 * Math.atan(Math.sqrt((1+this.e) / (1-this.e)) * Math.tan(ev / 2));
        let v = 2 * Math.atan2((Math.sqrt(1 + this.e) * Math.sin(ev / 2)),
                               (Math.sqrt(1 - this.e) * Math.cos(ev / 2)));

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

        // Normalize m to a value between 0 and 2PI
        m  = m % 2 * Math.PI;

        return m;
    }

    /**
     * Gets polar coordinates as arguments and transforms them to cartesian coordinates
     * 
     * @param {True anomaly} v 
     * @param {Distance to star} r  
     */
    cartesianPosition(v, r) {
        // Transform polar coordinates to cartesian coordinates
        // let x = r * Math.sin(v);
        // let y = 0;
        // let z = r * Math.cos(v);

        let x = r * Math.cos(v);
        let y = 0;
        let z = r * Math.sin(v);
        
        //debugger
        return new THREE.Vector3(x, y, z);
    }

    /**
     * Gets polar coordinates as arguments and transforms them to cartesian coordinates
     * 
     * @param {True anomaly} v 
     * @param {Distance to star} r 
     */
    cartesianPosition2(v, r) {
        // Transform polar coordinates to cartesian coordinates
        let ox = r * Math.cos(v);
        let oy = 0;
        let oz = r * Math.sin(v);
        

        let z = (oz * (Math.cos(this.w) * Math.sin(this.o)) + 
                     (Math.sin(this.w) * Math.cos(this.i) * Math.cos(this.o))) + 
                (ox * (Math.cos(this.w) * Math.cos(this.i) * Math.cos(this.o)) - 
                     (Math.sin(this.w) * Math.sin(this.o)));

        let y = (oz * Math.sin(this.w) * Math.sin(this.i)) +
                (ox * Math.cos(this.w) * Math.sin(this.i));
        
        let x = (oz * (Math.cos(this.w) * Math.cos(this.o)) - 
                      (Math.sin(this.w) * Math.cos(this.i) * Math.sin(this.o))) - 
                (ox * (Math.sin(this.w) * Math.cos(this.o)) + 
                      (Math.cos(this.w) * Math.cos(this.i) * Math.sin(this.o)));

        //debugger
        //console.log("x: " + x + " y: " + y + " z: " + z);
        return new THREE.Vector3(x, y, z);
    }

    /**
     * Returns the distance to the planet's sun
     * @param {True Anomaly at a specific point in time} v
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

    update(elapsedTime) {
        //debugger
        // Calculate new planet position
        let pos = this.position(elapsedTime);
        //console.log(pos);
        //this.mesh.position.set = pos;
        this.mesh.position.x = pos.x;
        this.mesh.position.y = pos.y;
        this.mesh.position.z = pos.z;

        // Update trajectory
        this.trajectory.addPosition(pos.x, pos.y, pos.z);
    }
}