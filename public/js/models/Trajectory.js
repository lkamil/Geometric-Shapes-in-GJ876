class Trajectory {
    constructor(scene, orbitalPeriod) {
        this.maxPoints = Math.round(orbitalPeriod * 15);

        let geometry = new THREE.BufferGeometry();
        this.positions = new Float32Array( this.maxPoints * 3); // 3 vertices per point

        // Set geometry attributes
        geometry.setAttribute( 'position', new THREE.BufferAttribute( this.positions, 3 ) );    
        

        // Material
        let material = new THREE.LineBasicMaterial( { color: 0xffffff } );

        this.line  = new THREE.Line(geometry, material);
        this.line.geometry.setDrawRange(0, 0);
        scene.add(this.line);
    }

    addPosition(x, y, z) {
        let drawCount = 0;
        let l = this.positions.length;
        // Shift values by three positions
        for (let i = l - 1; i > 3; i-=3) {
            if (this.positions[i] != 0 && drawCount == 0) {
                drawCount = i;
            }
            this.positions[i] = this.positions[i-3];
            this.positions[i-1] = this.positions[i-4];
            this.positions[i-2] = this.positions[i-5];
        }
        this.positions[0] = x;
        this.positions[1] = y;
        this.positions[2] = z;

        //console.log("trajectories: " + this.positions);
        // Set draw range
        this.line.geometry.setDrawRange(0, drawCount);
        //console.log("Draw Range: " + drawCount);
        this.line.geometry.attributes.position.needsUpdate = true;
    }

    // Draw trajectory
    update() {
        // let curve = new THREE.SplineCurve(this.points);
        // let geometry = new THREE.BufferGeometry().setFromPoints( curve.getPoints(this.maxPoints));

        // let trajectory = new THREE.Line( geometry, material );
        

    }


}