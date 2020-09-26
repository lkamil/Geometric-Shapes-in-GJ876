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

        this.lastXLength = 0;
    }

    /**
     * Gets three location vectors and checks if they are on one line
     * @param {Location of sun} p1 
     * @param {Location of inner planet} p2 
     * @param {Location of outer planet} p3 
     */
    isConjunction(lStar, lInner, lOuter) {
        let x = new THREE.Vector3();  
        x.crossVectors(lStar.clone().sub(lInner), lOuter.clone().sub(lInner));

        if (x.length() <= 0.0015) { // All points are on the same line
            // Check if inner Planet is between sun and outer planet
            let distOuterToSun = lOuter.distanceTo(lStar);
            let distOuterToInner = lOuter.distanceTo(lInner);

            if (distOuterToInner < distOuterToSun) {
                return true;
            } else {
                return false;
            }
        } else {
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
