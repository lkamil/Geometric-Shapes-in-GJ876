class Star {

    constructor(scene, _radius) {
        this.radius = _radius;
        this.mass = 0.32; // Unit: Solar Mass (1SM = 1.98847×1030 kg)

        let sunGeometry = new THREE.SphereGeometry(this.radius, 20, 20);
        let sunMaterial = new THREE.MeshPhongMaterial({color: 0xf6ff3d, emissive: 0xf6ff3d, emissiveIntensity: 2.0});
        this.mesh = new THREE.Mesh(sunGeometry, sunMaterial);


        //this.mesh.castShadow = true;

        this.mesh.position.x = 0;
        this.mesh.position.y = 0;
        this.mesh.position.z = 0;

        console.log("Sun position: " + this.mesh.position.x + " " +  this.mesh.position.y + " " + this.mesh.position.z);

        scene.add(this.mesh);

    }

    update(elapsedTime) {
        //console.log("Update Sun");
        this.radius = controls.scale;
        this.mesh.scale.x = this.radius;
        this.mesh.scale.y = this.radius;
        this.mesh.scale.z = this.radius;
    }

}