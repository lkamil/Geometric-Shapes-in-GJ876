class Sun {

    constructor(scene) {
        this.radius = 2;

        let sunGeometry = new THREE.SphereGeometry(this.radius, 20, 20);
        let sunMaterial = new THREE.MeshLambertMaterial({color: 0xffffcc});
        this.mesh = new THREE.Mesh(sunGeometry, sunMaterial);


        this.mesh.castShadow = true;

        this.mesh.position.x = -4;
        this.mesh.position.y = 3;
        this.mesh.position.z = 0;

        console.log("Sun position: " + this.mesh.position.x + " " +  this.mesh.position.y + " " + this.mesh.position.z);

        scene.add(this.mesh);

    }

    update() {
        //console.log("Update Sun");
        if (this.radius <= 4) {
            let scale = 1.1;
            this.radius = this.radius * scale;
            this.mesh.scale.set(scale, scale, scale);
        } else if (this.radius >= 4){
            let scale = 0.9;
            this.radius = this.radius * scale;
            this.mesh.scale.set(scale, scale, scale);
        }
    }

}