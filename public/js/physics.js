/**
 * Calculates the gravitytional attraction between two objects
 * @param {Mass of the first (bigger) object} m1 
 * @param {Mass of the second (smaller) object} m2 
 * @param {Location of the first object} l1 
 * @param {Location of the second object} l2 
 */
function calcGravitationAttraction(m1, m2, v_l1, v_l2) {
    // TODO: Check forces and direction
    //debugger
    let gc = 0.0043; // The gravitational Constant
    //let gc = 1;
    //console.log(gc);
    //let gc = 5;
    // Calculae direction of r-> by subtracting the locations of both objects
    v_lCopy = v_l1.clone();
    let v_force = v_lCopy.sub(v_l2); // Calc force direction
    v_force.normalize();

    //let distance = l2.sub(l1); // Distance between the two objects
    let d = v_l2.distanceTo(v_l1); // scalar

    // Calculate the magnitude of the force
    //let m = (gc * m1 * m2) / (distance * distance); // scalar
    let mag = (gc * m1 * m2) / (d * d);

    // Scale the force to the appropiate magnitude
    v_force.multiplyScalar(mag);
    //debugger

    return v_force;
}


function calcAngularMomentum(v_location, mass, v_velocity) {
    let v_momentum = v_velocity.clone().multiplyScalar(mass);
    let v_angMomentum = v_location.clone().multiply(v_momentum);

    return v_angMomentum;
}