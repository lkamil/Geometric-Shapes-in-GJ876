class TravelController {
    constructor() {
        this.moveAlongPoints = [];
    }

    moveCameraTo(position) {
        let travelDuration = 2000;
        camera.lookAt(position);
    }

    /**
     * @param {The camera that will be moved} camera
     * @param {Mean inclination of the planetary system} inclination 
     * @param {Distance of the camera} distance
     */
    setTravelPath(camera, i, distance) {
        // Orbital plane values
        let a = new THREE.Vector3(1, Math.sin(degToRad(i)) / Math.sin(degToRad(180-90-i)), 0);
        let b = new THREE.Vector3(0, 0, 1);

        // Top view position (perpendicular to orbital plane)
        let topView = b.clone().cross(a);
        topView.normalize();
        topView.multiplyScalar(distance);

        const curve = new THREE.LineCurve3(camera.position, topView);

        // Move camera along the points
        this.moveAlongPoints = curve.getPoints(30);
    }

    update() {
        // If points array is not empty, move camera to next point
        if (this.moveAlongPoints.length == 0) {
            return
        } else {
            let newCameraPosition = this.moveAlongPoints.shift();
            return newCameraPosition;
        }
    }
}