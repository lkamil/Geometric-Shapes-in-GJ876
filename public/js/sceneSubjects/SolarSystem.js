class SolarSystem {
    constructor(scene) {
        this.star = new Star(scene, controls.scale);
        this.planet_b = new Planet(scene, 1, new THREE.Color( 0xac3729 ));
    }

    update(elapsedTime) {
        this.star.update(elapsedTime);
        this.planet_b.update(elapsedTime);
    }
}