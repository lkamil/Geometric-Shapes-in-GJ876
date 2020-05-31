class Planet {
    constructor(scene) {
        this.radius = 1;

        let planetGeometry = new THREE.SphereGeometry(this.radius, 20, 20);
        let planetMaterial = new THREE.MeshLambertMaterial({color: 0xac3729 });
        this.mesh = new THREE.Mesh(planetGeometry, planetMaterial);


        this.mesh.receiveShadow = true;

        this.mesh.position.x = 0;
        this.mesh.position.y = 0;
        this.mesh.position.z = 0;

        scene.add(this.mesh);
    }

    update(elapsedTime) {
        this.mesh.position.x = Math.cos(elapsedTime) * 20;
        this.mesh.position.z = Math.sin(elapsedTime) * 20;

    }

    static degToRad(deg) {
        return deg * Math.PI / 180;
    }
}