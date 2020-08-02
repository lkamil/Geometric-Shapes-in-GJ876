class Star {

    constructor(scene, data) {
        this.radius = rSunToAU(data.radius);
        this.mass = data.mass; // Unit: Solar Mass (1SM = 1.98847×1030 kg)
        this.location = new THREE.Vector3(0.1611, 0, 0.1232);


        let sunGeometry = new THREE.SphereGeometry(this.radius, 20, 20);
        let sunMaterial = new THREE.MeshPhongMaterial({color: 0xf6ff3d, emissive: 0xf6ff3d, emissiveIntensity: 2.0});
        this.mesh = new THREE.Mesh(sunGeometry, sunMaterial);

        //this.mesh.castShadow = true;
        
        console.log("Sun position: " + this.mesh.position.x + " " +  this.mesh.position.y + " " + this.mesh.position.z);

        //scene.add(this.mesh);

        // Set the location of the star
        this.mesh.position.set = this.location;

    }

    applyForce() {

    }

    attract(planet) {
        //debugger
        //console.log(planetLocation);
        let gravity = calcGravitationAttraction(this.mass, planet.mass, this.location, planet['location']);
        // console.log("gravity: " + gravity.x + " " + gravity.y + " " + gravity.z);
        //debugger
        return gravity;
    }

    update(elapsedTime) {
        //console.log("Update Sun");
        // TODO: bigger radius means bigger mass?
        // this.radius = controls.scale;
        // this.mesh.scale.x = this.radius;
        // this.mesh.scale.y = this.radius;
        // this.mesh.scale.z = this.radius;
    }

}