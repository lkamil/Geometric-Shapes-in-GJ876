class LinkLinesController {
    constructor(scene) {
        this.interval = 0.1;
        this.oldTime = 0;
        this.count = 0;
        this.lines = new THREE.Object3D();
        this.involvedPlanets = []; // Holds the names of the two planets
        this.active = false;
        this.conjunctionsController = new ConjunctionsController(scene);
        
        scene.add(this.lines);
    }

    newLinkLine(p1Location, p2Location) {
        const points = [p1Location, p2Location];
        const lineMaterial = new THREE.LineBasicMaterial( { color: 0xff1237, transparent: true, opacity: 0.3 } );
        const lineGeometry = new THREE.BufferGeometry().setFromPoints( points );
        const line = new THREE.Line( lineGeometry, lineMaterial );
        this.lines.add(line);
    }

    /**
     * Sets active state and planet names
     * @param {Elapsed time between each line (in days)} i
     * @param {Array that holds the planets names} planets 
     */
    prepareDrawing(i, planets) {
        this.involvedPlanets = planets;
        this.active = true;
        this.oldTime = 0;
        this.count = 0;
        this.interval = i;
    }

    endDrawing() {
        this.active = false;
        this.involvedPlanets = [];
    }

    clear() {
        this.lines.children = [];
    }

    recommendInterval(speedFactor, orbitalPeriods) {
        let smallestOrbitalPeriod = Math.min(...orbitalPeriods);
        
        let recommendedInterval = smallestOrbitalPeriod / (100 * speedFactor);
        // Convert from days to minutes
        let inMinutes = recommendedInterval * 1440;
        
        // console.log("recommended interval: " + recommendedInterval);
        return Math.round(inMinutes);

    }

    /**
     * Adds a new link line at set intervall
     * @param {Current location of a planet} p1Location 
     * @param {Current location of another planet} p2Location 
     */
    update(dt, starLocation, p1Location, p2Location) {
        let isConjunction = this.conjunctionsController.isConjunction(starLocation, p1Location, p2Location);

        // First line must be drawn on conjunction
        if (this.lines.children.length == 0 && !isConjunction) {
            return;
        }

        if (isConjunction) {
            this.conjunctionsController.addConjunction(p1Location);
        }
        
        let elapsedTimeSinceLastCall = dt - this.oldTime;
        if (this.count >= this.interval) {
            this.newLinkLine(p1Location, p2Location);
            this.count = 0;
        } else {
            this.count += elapsedTimeSinceLastCall;
        }

        this.oldTime = dt;    
    }
}
