class AmbientLight {
    constructor(scene) {
        this.ambientLight = new THREE.AmbientLight( 0xEDC8AB );
        scene.add(this.ambientLight);
    }

    update(elapsedTime) {

    }
}