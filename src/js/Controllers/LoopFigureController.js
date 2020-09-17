class LoopFigureController {
    constructor(scene) {
        this.interval = 3;
        this.counter = 0;

        this.points = [];

        this.active = false;
        this.outerPlanet;
        this.innerPlanet;

        // Create Line Geometry
        let geometry = new THREE.BufferGeometry();

        const maxPoints = 500000;
        this.points = new Float32Array(maxPoints * 3);

        geometry.setAttribute('position', new THREE.BufferAttribute(this.points, 3));

        this.drawRange = 0; // Determines how many points are drawn
        geometry.setDrawRange(0, this.drawRange);

        // Create material
        const material = new THREE.LineBasicMaterial({color: 0xff1237});

        // Create loop figure object
        this.loopFigure = new THREE.Line(geometry, material);
         
        scene.add(this.loopFigure);
    }

    addPosition(v) {
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
        this.loopFigure.geometry.setDrawRange(0, this.drawRange);
        this.loopFigure.geometry.attributes.position.needsUpdate = true;
    }

    prepareDrawing(innerPlanet, outerPlanet) {
        this.active = true;
        this.innerPlanet = innerPlanet;
        this.outerPlanet = outerPlanet;
    }

    clear() {
        this.drawRange = 0;
        this.loopFigure.geometry.setDrawRange(0, this.drawRange);
    }

    getInvertedVector(planetLocation) {
        const inverted = planetLocation.clone().multiplyScalar(-1);

        return inverted;
    }
}
