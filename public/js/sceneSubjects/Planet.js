class Planet {
    constructor(scene, _mass, _radius, _location, _color) {
        this.radius = _radius;
        this.mass = _mass;
        this.location = _location;

        this.velocity = new THREE.Vector3(0, 0, 0);
        this.acceleration = new THREE.Vector3(0, 0, 0);

        let planetGeometry = new THREE.SphereGeometry(this.radius, 20, 20);
        let planetMaterial = new THREE.MeshLambertMaterial({color: _color});
        this.mesh = new THREE.Mesh(planetGeometry, planetMaterial);

        this.mesh.receiveShadow = true;

        scene.add(this.mesh);
        this.mesh.position.set = this.location;
        // debugger
    }

    applyForce(force) {
        //debugger
        // TODO
        // Is force passed by reference??? if yes it needs to be copied
        // force.copy.divide(this.mass); // Newtons second law F = m*a ->  F / m = a

        // TODO: Make sure that masses never equal 0!!
        // Divide force (vector) by mass (scalar)
        let forceCopy = force.clone();
        forceCopy.divideScalar(this.mass); // Newtons second law F = m*a ->  F / m = a
        this.acceleration.add(forceCopy);
    }

    update(elapsedTime) {
        //debugger
        //this.mesh.position.x = Math.cos(elapsedTime) * 20;
        //this.mesh.position.z = Math.sin(elapsedTime) * 20;

        // Apply forces
        this.velocity.add(this.acceleration);
        this.location.add(this.velocity);
        //this.mesh.position.set = this.location;
        this.mesh.position.x = this.location.x;
        this.mesh.position.y = this.location.y;
        this.mesh.position.z = this.location.z;
        // TODO: Find a better way to update the location of the planet
        //console.log("planet location: " + this.location.x + " " + this.location.y +  " " + this.location.z);
        
        // Clear accelaration 
        this.acceleration.multiplyScalar(0);
    }

    static degToRad(deg) {
        return deg * Math.PI / 180;
    }
}