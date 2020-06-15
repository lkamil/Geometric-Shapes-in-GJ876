class Planet {
    constructor(scene, _radius, _color) {
        this.radius = _radius;

        let planetGeometry = new THREE.SphereGeometry(this.radius, 20, 20);
        let planetMaterial = new THREE.MeshLambertMaterial({color: _color});
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