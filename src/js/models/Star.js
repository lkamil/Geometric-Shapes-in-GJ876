class Star {
    constructor(data) {
        this.radius = rSunToAU(data.radius);
        this.mass = data.mass; // Unit: Solar Mass (1SM = 1.98847×1030 kg)

        let sunGeometry = new THREE.SphereGeometry(this.radius, 20, 20);
        let sunMaterial = new THREE.MeshPhongMaterial({color: 0x813D3D});
        this.mesh = new THREE.Mesh(sunGeometry, sunMaterial);
        let center = new THREE.Vector3(0, 0, 0);
        this.mesh.position.copy(center);
    }

    translate(v) {
        this.mesh.position.copy(v);
    }

    moveToCenter() {
        const center = new THREE.Vector3(0, 0, 0,);
        this.mesh.position.copy(center);
    }

    show() {
        this.mesh.visible = true;
    }

    hide() {
        this.mesh.visible = false;
    }

    getLocation() {
        return this.mesh.position;
    }

    update(dt) {

    }
}
