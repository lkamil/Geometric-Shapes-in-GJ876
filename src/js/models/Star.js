class Star {
    constructor(scene, data) {
        this.radius = rSunToAU(data.radius);
        this.mass = data.mass; // Unit: Solar Mass (1SM = 1.98847×1030 kg)

        let sunGeometry = new THREE.SphereGeometry(this.radius, 20, 20);
        let sunMaterial = new THREE.MeshPhongMaterial({color: 0x813D3D});
        this.mesh = new THREE.Mesh(sunGeometry, sunMaterial);
        this.mesh.position.set = new THREE.Vector3(0, 0, 0);
    }

    setLocation(l) {
        this.mesh.position.copy(l);
    }

    update(elapsedTime) {

    }

}
