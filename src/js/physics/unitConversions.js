
/**
 * Converts a given mass in jupiter mass to solar mass
 * @param {Mass in Jupiter Mass} m
 */
function mJupToSolarMass(m) {
    return m * 0.00095479; 
    // Conversion factor taken from:
    // DOI: 10.1007/s10569-011-9352-4
}

/**
 * Converts a given mass in earth radius to AU
 * @param {Distance in earth radius} d
 */
function rEarthToAU(d) {
    return d * 0.00004263496512710535386;
}

function rSunToAU(d) {
    return d * 0.00465047;
}

function degToRad(deg) {
    return deg * Math.PI / 180;
}

function radToDeg(rad) {
    return rad * 180 / Math.PI;
}


