class BasicLight {

    constructor(scene) {
        this.spotLight = new THREE.SpotLight(0xfffbe6);
        // this.spotLight = new THREE.AmbientLight( 0xfffbe6 );

        this.spotLight.position.set(-40, 60, -10);
        this.spotLight.castShadow = true;
        scene.add(this.spotLight);
    }

    update() {

    }
}