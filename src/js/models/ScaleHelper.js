class ScaleHelper {
    constructor(scene, x, y, z) {
        let xHelper = this.initXHelper(x);
        scene.add(xHelper);
    }

    initXHelper(x) {
        var geometry = new THREE.BoxGeometry( 1,1, 1 );
        var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
        var cube = new THREE.Mesh( geometry, material );

        cube.position.x = x;
        cube.position.y = 0;
        cube.position.z = 0;
        return cube;
    }

    initYHelper() {

    }

    initZHelper() {

    }

    update() {

    }
}