class TimeController {
    constructor() {
        this.timer = new Timer();
        this.timer.enableFixedDelta();
        this.baseFixedDelta = 0.01667;
    }

    setSpeedFactor(newFactor) {
        this.timer.setFixedDelta(this.baseFixedDelta * newFactor);
    }

    getDelta() {
        return this.timer.getDelta();
    }

    dt() {
        const elapsed = this.timer.getElapsed();
        return elapsed;
    }
}
