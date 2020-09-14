class CameraManager {
    constructor(scene) {
        const fov = 45;
        const aspect = this.width / this.height;
        const near = 0.0001;
        const far = 1000;
        
        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

        const initialPosition = new THREE.Vector3(-0.8, -0.3, 0.5);
        this.camera.position.copy(initialPosition);

        // Making the camera point to the center of the scene using lookAt()
        this.camera.lookAt(scene.position);
    }

    /**
     * Returns the camera's position for a top view of the planetary system
     * @param {Mean Inclination of the planetary system} i 
     * @param {Distance from the system's center} distance 
     */
    topViewCoordinates(i, distance) {
        // Orbital plane values
        let v1 = new THREE.Vector3(1, Math.sin(degToRad(i)) / Math.sin(degToRad(180-90-i)), 0);
        let v2 = new THREE.Vector3(0, 0, 1);

        // Top view position (perpendicular to orbital plane)
        let topViewCoordinates = v2.clone().cross(v1);
        topViewCoordinates.normalize();
        topViewCoordinates.multiplyScalar(distance);

        return topViewCoordinates;
    }

    topViewOfPlanet(i, distance, planetPosition) {
        const topViewCoordinatesOfCenter = this.topViewCoordinates(i, distance);
        const topViewCoordinatesOfPlanet = topViewCoordinatesOfCenter.clone().add(planetPosition);

        return topViewCoordinatesOfPlanet;
    }

    setLookAt(focalPoint) {
        this.camera.lookAt(focalPoint);
    }

    setPosition(newPos) {
        this.camera.position.copy(newPos);
    }
}
