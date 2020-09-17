class LoopFigureController {
    constructor(scene) {
        this.interval = 3;
        this.counter = 0;

        this.points = [];

        this.active = false;
        this.outerPlanet;
        this.innerPlanet;

        const material = new THREE.LineBasicMaterial({color: 0x0000ff});
        this.geometry = new THREE.BufferGeometry().setFromPoints( this.points );
        const loopFigure = new THREE.Line(this.geometry, material);
         
        scene.add(loopFigure);
    }

    prepareDrawing(innerPlanet, outerPlanet) {
        this.active = true;
        this.innerPlanet = innerPlanet;
        this.outerPlanet = outerPlanet;
    }

    getInvertedVector(planetLocation) {
        const inverted = planetLocation.clone().multiplyScalar(-1);

        return inverted;
    }
}
