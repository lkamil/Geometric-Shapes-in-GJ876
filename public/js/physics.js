
const constant = {
    GC: 0.0002959122, // Gravitational Constant 4 * PI^2
    SC: 0.15, // Softening constant
    T0: 2450602.093, // Beginning of Time
};

/**
 * Converts a given mass in jupiter mass to solar mass
 * @param {Mass in Jupiter Mass} mJup
 */
function mJupToSolarMass(mJup) {
    return mJup * 0.0009547919;
}

function degToRad(deg) {
    return deg * Math.PI / 180;
}

function radToDeg(rad) {
    return rad * 180 / Math.PI;
}

function rEarthToAU(dist) {
    return dist * 0.00004263496512710535386;
}

function rSunToAU(dist) {
    return dist * 0.00465047;
}

/**
 * Calculates the gravitytional attraction between two objects with masses m1 and m2
 * @param {Mass of the first (bigger) object} m1 
 * @param {Mass of the second (smaller) object} m2 
 * @param {Location of the first object} l1 
 * @param {Location of the second object} l2 
 */
function calcGravitationAttraction(m1, m2, v_r1, v_r2) {
    // TODO: Check forces and direction
    //debugger
    
    // Calculae direction of r-> by subtracting the locations of both objects
    v_rCopy = v_r1.clone();
    let v_force = v_rCopy.sub(v_r2); // Calc force direction
    v_force.normalize();

    //let distance = l2.sub(l1); // Distance between the two objects
    let d = v_r2.distanceTo(v_r1); // scalar

    // Calculate the magnitude of the force
    let mag = ((constant.GC * m1 * m2) / (d * (d)));

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

