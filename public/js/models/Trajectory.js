class Trajectory {
    constructor(scene, initialPosition, orbitalPeriod) {
        this.maxPoints = Math.round(orbitalPeriod * 10);

        let geometry = new THREE.BufferGeometry();

        // Create and initialize positions array
        this.positions = new Float32Array( this.maxPoints * 3); // 3 vertices per point
        for (let i = 0; i < this.positions.length - 3; i+=3) {
            this.positions[i] = initialPosition.x;
            this.positions[i+1] = initialPosition.y;
            this.positions[i+2] = initialPosition.z;
        }

        // Set geometry attributes
        geometry.setAttribute( 'position', new THREE.BufferAttribute( this.positions, 3 ) );    
        
        // Material
        let material = new THREE.LineBasicMaterial( { color: 0xffffff } );

        this.line = new THREE.Line(geometry, material);

        scene.add(this.line);
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

    // Draw trajectory
    update() {
        // let curve = new THREE.SplineCurve(this.points);
        // let geometry = new THREE.BufferGeometry().setFromPoints( curve.getPoints(this.maxPoints));

        // let trajectory = new THREE.Line( geometry, material );
        

    }


}