class Star {

    constructor(scene, data) {
        this.radius = rSunToAU(data.radius);
        this.mass = data.mass; // Unit: Solar Mass (1SM = 1.98847×1030 kg)

        let sunGeometry = new THREE.SphereGeometry(this.radius, 20, 20);
        let sunMaterial = new THREE.MeshPhongMaterial({color: 0x813D3D, emissive: 0x813D3D});
        this.mesh = new THREE.Mesh(sunGeometry, sunMaterial);
        this.mesh.position.set = new THREE.Vector3(0, 0, 0);

        this.light = new THREE.PointLight(0xB6210B, 0.8);
        this.light.position.set(0,0,0);
        this.light.castShadow = true;
        scene.add(this.light);
    }

    update(elapsedTime) {

    }

}