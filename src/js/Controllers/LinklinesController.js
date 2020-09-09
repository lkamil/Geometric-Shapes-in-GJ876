class LinkLinesController {
    constructor(scene) {
        this.interval = 4;
        this.counter = 0;
        this.lines = new THREE.Object3D();
        this.involvedPlanets = []; // Holds the names of the two planets
        this.active = false;
        
        scene.add(this.lines);
    }

    newLinkLine(p1Location, p2Location) {
        const points = [p1Location, p2Location];
        const lineMaterial = new THREE.LineBasicMaterial( { color: 0x000ff, transparent: true, opacity: 0.3 } );
        const lineGeometry = new THREE.BufferGeometry().setFromPoints( points );
        const line = new THREE.Line( lineGeometry, lineMaterial );
        this.lines.add(line);
    }

    /**
     * Sets active state and planet names
     * @param {Array that holds the planets names} planets 
     */
    prepareDrawing(planets) {
        this.involvedPlanets = planets;
        this.active = true;
    }

    endDrawing() {
        this.active = false;
        this.involvedPlanets = [];
    }

    clear() {
        this.lines.children = [];
    }

    /**
     * Adds a new link line at set intervall
     * @param {Current location of a planet} p1Location 
     * @param {Current location of another planet} p2Location 
     */
    update(p1Location, p2Location) {
        if (this.counter >= this.interval) {
            this.newLinkLine(p1Location, p2Location);
            this.counter = 0;
        } else {
            this.counter += 1;
        }
    }
}