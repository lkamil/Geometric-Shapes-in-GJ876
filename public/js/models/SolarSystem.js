class SolarSystem {
    constructor(scene, data) {
        this.star = new Star(scene, data.gj876);

        this.planetB = new Planet(scene, data.planets.gj876b, new THREE.Color( 0xac3729 ));
        this.planetC = new Planet(scene, data.planets.gj876c, new THREE.Color( 0x0c3789 ));
        this.planetD = new Planet(scene, data.planets.gj876d, new THREE.Color( 0x1fadd1 ));

        this.objects = new THREE.Object3D();
        this.objects.add(this.star.mesh);
        this.objects.add(this.planetB.mesh);
        this.objects.add(this.planetC.mesh);
        this.objects.add(this.planetD.mesh);
        scene.add(this.objects);
    }

    update(elapsedTime) {
        let speed = 1;
        this.star.update(elapsedTime * speed);
        this.planetB.update(elapsedTime * speed);
        this.planetC.update(elapsedTime * speed);
        this.planetD.update(elapsedTime * speed);
    }
}