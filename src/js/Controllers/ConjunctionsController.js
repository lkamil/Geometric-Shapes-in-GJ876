class ConjunctionsController {
    constructor(scene) {
        this.points = [];
        // Create Line Geometry
        let geometry = new THREE.BufferGeometry();

        const maxPoints = 100;
        this.points = new Float32Array(maxPoints * 3);
        geometry.setAttribute('position', new THREE.BufferAttribute(this.points, 3));

        this.drawRange = 0; // Determines how many points are drawn
        geometry.setDrawRange(0, this.drawRange);

        // Create material
        const material = new THREE.LineBasicMaterial({color: 0xf5f5f5});

        // Create loop figure object
        this.conjunctionsLine = new THREE.Line(geometry, material);

        scene.add(this.conjunctionsLine);

        this.foundConjunctionRecently = false;
    }

    
    // isConjunction(lStar, lInner, lOuter) {
    //     let x = new THREE.Vector3();  
    //     x.crossVectors(lStar.clone().sub(lInner), lOuter.clone().sub(lInner));

    //     // Check if inner Planet is between sun and outer planet
    //     let distOuterToSun = lOuter.distanceTo(lStar);
    //     let distOuterToInner = lOuter.distanceTo(lInner);

    //     if (distOuterToInner < distOuterToSun) {
    //         // Check if points are more on one line than last value
    //         if (x.length() <= this.lastXLength) {
    //             this.lastXLength = x.length();
    //         } else if (x.length() > this.lastXLength) {
    //             // Last value was higher approximation
    //             return true;
    //         }
    //     } else {
    //         return false;
    //     }
    // }

    /**
     * Checks if the current constellation is a conjunction
     * @param {Elapsed time} dt 
     * @param {Delta time} delta 
     * @param {Location of Star} starLocation 
     * @param {Inner Planet Object} innerPlanet 
     * @param {Outer Planet Object} outerPlanet 
     */
    isConjunction(dt, delta, starLocation, innerPlanet, outerPlanet) {
        // Current values: 
        let innerPlanetLocation = innerPlanet.getLocation();
        let outerPlanetLocation = outerPlanet.getLocation();

        // Next values:
        let nextInnerPlanetLocation = innerPlanet.position(dt + delta);
        let nextOuterPlanetLocation = outerPlanet.position(dt + delta);

        // Current conjunction approximation
        let approx = new THREE.Vector3();
        approx.crossVectors(starLocation.clone().sub(innerPlanetLocation), 
                            outerPlanetLocation.clone().sub(innerPlanetLocation));
        approx = approx.length();

        // Next conjunction approximation
        let nextApprox = new THREE.Vector3();
        nextApprox.crossVectors(starLocation.clone().sub(nextInnerPlanetLocation), 
                                nextOuterPlanetLocation.clone().sub(nextInnerPlanetLocation));
        nextApprox = nextApprox.length();

        // If the current approximation is better than next approximation, conjunction or opposition is found
        if (approx < nextApprox && approx < 0.01 && !this.foundConjunctionRecently) {
            // Check if conjunction (and not opposition)
            // Distance from inner Planet to outer planet must be smaller than dist from
            // outer planet to sun
            let distOuterToSun = outerPlanetLocation.distanceTo(starLocation);
            let distOuterToInner = outerPlanetLocation.distanceTo(innerPlanetLocation);

            if (distOuterToInner < distOuterToSun) {
                this.foundConjunctionRecently = true;
                return true;
            } else {
                return false;
            }
        } else {
            if (approx > 0.01 && this.foundConjunctionRecently) {
                this.foundConjunctionRecently = false;
            }
            return false;
        }
    }

    addConjunction(v) {
        // Shift values by three positions
        for (let i = this.points.length - 1; i > 3; i-=3) {
            this.points[i] = this.points[i-3];
            this.points[i-1] = this.points[i-4];
            this.points[i-2] = this.points[i-5];
        }
        this.points[0] = v.x;
        this.points[1] = v.y;
        this.points[2] = v.z;

        this.drawRange += 1;
        this.conjunctionsLine.geometry.setDrawRange(0, this.drawRange);
        this.conjunctionsLine.geometry.attributes.position.needsUpdate = true;
    }
}
