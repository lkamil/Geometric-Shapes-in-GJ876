class TravelController {
    constructor() {
        this.moveAlongPoints = [];
    }

    /**
     * Sets travel path for moving the camera to top view
     * @param {The camer that will be moved} camera 
     * @param {New camera position} topViewCoordinates 
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
