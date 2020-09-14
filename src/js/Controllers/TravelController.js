class TravelController {
    constructor() {
        this.moveAlongPoints = [];
    }

    /**
     * @param {The camera that will be moved} camera
     * @param {Mean inclination of the planetary system} inclination 
     * @param {Distance of the camera} distance
     */
    setTravelPath(camera, topViewCoordinates) {
        const curve = new THREE.LineCurve3(camera.position, topViewCoordinates);

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