class Trajectory {
    constructor(scene, initialPosition, orbitalPeriod) {
        this.maxPoints = Math.round(orbitalPeriod * 18);
        this.initialPosition = initialPosition;

        let geometry = new THREE.BufferGeometry();

        // Create and initialize positions array
        this.positions = new Float32Array( this.maxPoints * 3); // 3 vertices per point
        for (let i = 0; i < this.positions.length - 3; i+=3) {
            this.positions[i] = initialPosition.x;
            this.positions[i+1] = initialPosition.y;
            this.positions[i+2] = initialPosition.z;
        }

        let colors = this.gradientArray();

        // Set geometry attributes
        geometry.setAttribute( 'position', new THREE.BufferAttribute(this.positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
          
        // Material
        const material = new THREE.LineBasicMaterial({ 
            vertexColors: true  // Geometry provides color info
        });

        this.line = new THREE.Line(geometry, material);
        scene.add(this.line);
    }

    gradientArray() {
        let step = 1 / this.maxPoints;
        let dec = step;
        const colors = new Float32Array(this.maxPoints * 3);
        for (let i = 0; i < colors.length - 2; i+=3) {
            colors[i] = 1 - dec;
            colors[i+1] = 1 - dec;
            colors[i+2] = 1 - dec;

            dec += step;
        }

        return colors;
    }

    addPosition(x, y, z) {
        // Shift values by three positions
        for (let i = this.positions.length - 1; i > 3; i-=3) {
            this.positions[i] = this.positions[i-3];
            this.positions[i-1] = this.positions[i-4];
            this.positions[i-2] = this.positions[i-5];
        }
        this.positions[0] = x;
        this.positions[1] = y;
        this.positions[2] = z;

        this.line.geometry.attributes.position.needsUpdate = true;
    }

    update(x, y, z) {
        this.addPosition(x, y, z);
    }

    /**
     * Resets trajectories
     */
    clear() {
        for (let i = 0; i < this.positions.length - 3; i+=3) {
            this.positions[i] = this.initialPosition.x;
            this.positions[i+1] = this.initialPosition.y;
            this.positions[i+2] = this.initialPosition.z;
        }
    }
}
