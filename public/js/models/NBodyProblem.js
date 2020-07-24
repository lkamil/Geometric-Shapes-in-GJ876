class NBodyProblem {
    constructor(objects_) {
        this.objects = objects_;

        //this.objects[0].applyForce(new THREE.Vector3(1,1,1));
    }

    // Formula from Book
    /**
     * Iterates through all objects and calculates the accelaration for each one.
     * Then, the accelerations are apllied to each object.
     */
    addAccelerations() {
        //console.log("Add accelerations");
        const numOfObjects = this.objects.length;
        //let accelerations = [];
        for (let i = 0; i < numOfObjects; i++) {
            
            let acc = new THREE.Vector3();
            const currentObject = this.objects[i];

            for (let j = 0; j < numOfObjects; j++) {
                if (i != j) {
                    let otherObject = this.objects[j];
                    let r2 = otherObject['location'];
                    let r1 = currentObject['location'];
                    const v_d = r1.sub(r2); 
                    //const dist = new THREE.Vector3(1,1,1);
                    const dSq = v_d.x * v_d.x + v_d.y * v_d.y + v_d.z * v_d.z;
                    //const distCu = v_d.x * v_d.x * v_d.x + v_d.y * v_d.y * v_d.y + v_d.z * v_d.z * v_d.z;
                
                    const v_f = v_d.divideScalar(dSq * (Math.sqrt(dSq + constant.SC))).multiplyScalar(
                              (-constant.GC * otherObject['mass']));
                
                    acc.addScalar(constant.DT * v_f);
                }
                
            }
            //console.log(acc);
            currentObject.applyForce(acc);

            // Add calculated acceleartion to list
            //accelerations.add(acc);
        }
        //return accelerations;

    }
    
    // addAccelerations() {
    //     //debugger
    //     //console.log("Add accelerations");
    //     const numOfObjects = this.objects.length;
    //     //let accelerations = [];
    //     for (let i = 0; i < numOfObjects; i++) {
            
    //         let acc = new THREE.Vector3();
    //         const currentObject = this.objects[i];

    //         for (let j = 0; j < numOfObjects; j++) {
    //             if (i != j) {
    //                 let otherObject = this.objects[j];
    //                 let r2 = otherObject['location'];
    //                 let r1 = currentObject['location'];
    //                 const dist = r2.sub(r1);
    //                 //const dist = new THREE.Vector3(1,1,1);
    //                 const distSq = dist.x * dist.x + dist.y * dist.y + dist.z * dist.z;
                
    //                 const f = (constant.GC * otherObject['mass']) /
    //                           (distSq * (Math.sqrt(distSq + constant.SC)));
                
    //                 acc.addScalar(constant.DT * f);
    //             }
                
    //         }
    //         //console.log(acc);
    //         currentObject.applyForce(acc);

    //         // Add calculated acceleartion to list
    //         //accelerations.add(acc);
    //     }
    //     //return accelerations;

    // }
}