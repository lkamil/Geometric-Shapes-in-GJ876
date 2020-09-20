class Trajectory {
    constructor(scene, initialPosition, orbitalPeriod) {
        this.maxPoints = Math.round(orbitalPeriod) * 3;
        this.initialPosition = initialPosition;

        let geometry = new THREE.BufferGeometry();

        // Create positions array
        this.positions = new Float32Array( this.maxPoints * 3); // 3 vertices per point
        geometry.setAttribute( 'position', new THREE.BufferAttribute(this.positions, 3));

        // Add gradient
        let color = this.gradientArray();
        geometry.setAttribute('color', new THREE.BufferAttribute(color, 3));
          
        // Create Material
        const material = new THREE.LineBasicMaterial({ 
            vertexColors: true  // Geometry provides color info
        });

        // Set draw range
        this.drawRange = 0;
        geometry.setDrawRange(0, this.drawRange);

        // Create trajectory line
        this.line = new THREE.Line(geometry, material);
        scene.add(this.line);
    }

    /**
     * Returns an array of color values that represent a linear gradient
     * from white to black.
     */
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

    lightModeColor() {
        const colors = new Float32Array(this.maxPoints * 3);
        for (let i = 0; i < colors.length; i+=1) {
            colors[i] = 0.7;
        }

        return colors;
    }

    /**
     * Adds a new point to the trajectory line
     * @param {Location vector} v 
     */
    addPosition(v) {
        // Shift values by three positions
        for (let i = this.positions.length - 1; i > 3; i-=3) {
            this.positions[i] = this.positions[i-3];
            this.positions[i-1] = this.positions[i-4];
            this.positions[i-2] = this.positions[i-5];
        }

        // Add new position
        this.positions[0] = v.x;
        this.positions[1] = v.y;
        this.positions[2] = v.z;

        // Increase draw range
        this.drawRange += 1;
        this.line.geometry.setDrawRange(0, this.drawRange);

        // Update geometry
        this.line.geometry.attributes.position.needsUpdate = true;
    }

    update(v) {
        this.addPosition(v);
    }

    changeLatestPosition(v) {
        this.positions[0] = v.x;
        this.positions[1] = v.y;
        this.positions[2] = v.z;

        this.line.geometry.attributes.position.needsUpdate = true;
    }

    /**
     * Resets trajectories
     */
    reset() {
        this.drawRange = 0;
        this.line.geometry.setDrawRange(0, this.drawRange);
    }

    switchToLightMode() {
        let color = this.lightModeColor();
        this.line.geometry.setAttribute('color', new THREE.BufferAttribute(color, 3));
        this.line.geometry.attributes.color.needsUpdate = true;
    }

    switchToDarkMode() {
        let color = this.gradientArray();
        this.line.geometry.setAttribute('color', new THREE.BufferAttribute(color, 3));
        this.line.geometry.attributes.color.needsUpdate = true;
    }
}
