class CoordinateAxes {
    constructor(scene) {
        this.axes = this.initAxes(scene);
    }

    initAxes(scene) {
        const max = 5;
        const origin = new THREE.Vector3(0, 0, 0,);

        // Create x axis
        const maxX = new THREE.Vector3(max, 0, 0); 
        const xAxisGeometry = new THREE.BufferGeometry().setFromPoints([origin, maxX]);
        const xAxisMaterial = new THREE.LineBasicMaterial({color: 0x262C2F});
        const xAxis = new THREE.Line(xAxisGeometry, xAxisMaterial);

        // Create y axis
        const maxY = new THREE.Vector3(0, max, 0); 
        const yAxisGeometry = new THREE.BufferGeometry().setFromPoints([origin, maxY]);
        const yAxisMaterial = new THREE.LineBasicMaterial({color: 0x262C2F});
        const yAxis = new THREE.Line(yAxisGeometry, yAxisMaterial);

        // Create z axis
        const maxZ = new THREE.Vector3(0, 0, max); 
        const zAxisGeometry = new THREE.BufferGeometry().setFromPoints([origin, maxZ]);
        const zAxisMaterial = new THREE.LineBasicMaterial({color: 0x262C2F});
        const zAxis = new THREE.Line(zAxisGeometry, zAxisMaterial);

        scene.add(xAxis);
        scene.add(yAxis);
        scene.add(zAxis);

        let axes = [xAxis, yAxis, zAxis];

        return axes;
    }

    update() {

    }
}
