class CameraManager {
    constructor(scene) {
        let fov = 45;
        let aspect = this.width / this.height;
        let near = 0.0001;
        let far = 1000;
        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this.camera.position.x = -0.8;
        this.camera.position.y = -0.3;
        this.camera.position.z = 0.5;
        // Making the camera point to the center of the scene using lookAt()
        this.camera.lookAt(scene.position);

        
    }

    setPosition(newPos) {
        this.camera.position.x = newPos.x;
        this.camera.position.y = newPos.y;
        this.camera.position.z = newPos.z;
    }
}