class BasicLight {

    constructor(scene) {
        // this.spotLight = new THREE.SpotLight(0xfffbe6);
        this.spotLight = new THREE.AmbientLight( 0xfffbe6 );

        //this.spotLight.position.set(-40, 60, -10);
        this.spotLight.castShadow = true;
        scene.add(this.spotLight);

        this.sunLight = new THREE.PointLight(0xfcffb8);
        this.sunLight.position.set(0,0,0);
        this.sunLight.castShadow = true;
        scene.add(this.sunLight);
    }

    update(elapsedTime) {
        let intensity = 2;
        this.sunLight.intensity = intensity;

    }
}