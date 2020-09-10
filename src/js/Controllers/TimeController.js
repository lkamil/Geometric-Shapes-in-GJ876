class TimeController {
    constructor() {
        this.timer = new Timer();
        this.timer.enableFixedDelta();
        this.baseFixedDelta = 0.01667;
    }

    setSpeedFactor(newFactor) {
        console.log("time factor: " + newFactor);
        this.timer.setFixedDelta(this.baseFixedDelta * newFactor);
    }

    dt() {
        const elapsed = this.timer.getElapsed();
        return elapsed;
    }

}