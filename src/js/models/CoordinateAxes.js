class CoordinateAxes {
    constructor(scene, size) {
        this.size = size;
        this.axes = this.initAxes(scene);
        this.marks = this.initMarks(scene);

        this.hide();
    }

    initAxes(scene) {
        let axes = new THREE.Group();

        // First axis lies on z axis
        const p1 = new THREE.Vector3(0, 0, -this.size/ 2);
        const p2 = new THREE.Vector3(0, 0, this.size / 2); 
        const axis1Geometry = new THREE.BufferGeometry().setFromPoints([p1, p2]);
        const axis1Material = new THREE.LineBasicMaterial({color: 0x676767});
        const axis1 = new THREE.Line(axis1Geometry, axis1Material);
        axes.add(axis1);

        // Second axis is perpendicular to first axis and lies on orbital plane (59 deg)
        const p3 = new THREE.Vector3(-(this.size / 2)*Math.sin(degToRad(31)), -(this.size / 2) *Math.sin(degToRad(59)), 0);
        const p4 = new THREE.Vector3((this.size / 2)*Math.sin(degToRad(31)), (this.size / 2)*Math.sin(degToRad(59)), 0);
        const axis2Geometry = new THREE.BufferGeometry().setFromPoints([p3, p4]);
        const axis2Material = new THREE.LineBasicMaterial({color: 0x676767});
        const axis2 = new THREE.Line(axis2Geometry, axis2Material);
        axes.add(axis2);

        scene.add(axes);

        return axes;
    }

    initMarks(scene) {
        let marks = new THREE.Group();

        let step = 0.2; // Spacing between each mark
        let startPoint = new THREE.Vector3(-(this.size / 2)*Math.sin(degToRad(31)), -(this.size / 2)*Math.sin(degToRad(59)), -(this.size / 2));

        for (let i = 0; i <= this.size; i+= step) {
            // New Position
            let pos = startPoint.clone();
            pos.z += i;

            // Create Dot and set its position
            let geometry = new THREE.BoxGeometry(0.001, 0.007, 0.007);
            let material = new THREE.MeshBasicMaterial( {color: 0x676767} );
            let dot = new THREE.Mesh( geometry, material );
            dot.position.copy(pos);

            // Create and add label
            let div = document.createElement( 'div' );
		    div.className = 'label';
		    div.textContent = Math.round(pos.z * 10) / 10;
            div.style.marginTop = '10px';
            div.style.fontSize = '10px';
            let label = new CSS2DObject(div);
            dot.add(label);

            marks.add(dot);
        }

        // Add group of marks to scene
        scene.add(marks);

        return marks;
    }

    hide() {
        // Hide marks
        for (let i = 0; i < this.marks.children.length; i++) {
            this.marks.children[i].visible = false;
            this.marks.children[i].children[0].visible = false;
        }

        // Hide axes
        for (let i = 0; i < this.axes.children.length; i++) {
            this.axes.children[i].visible = false;
        }
    }

    show() {
        for (let i = 0; i < this.marks.children.length; i++) {
            this.marks.children[i].visible = true;
            this.marks.children[i].children[0].visible = true;
        }

        for (let i = 0; i < this.axes.children.length; i++) {
            this.axes.children[i].visible = true;
        }
    }
}
