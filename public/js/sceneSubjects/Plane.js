class Plane {
    constructor(scene) {
        // Creating a plane with a wdith of 60 and a height of 20
        var planeGeometry = new THREE.PlaneGeometry(60, 20);
        var planeMaterial = new THREE.MeshLambertMaterial({color: 0xbbb887}); // Defining what the plane will look like
        var plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.receiveShadow = true;

        plane.rotation.x = -0.5 * Math.PI; // Rotate 90° around the x axis
        plane.position.x = 15;
        plane.position.y = 0;
        plane.position.z = 0;

        scene.add(plane);
    }

    update() {
        
    }
}