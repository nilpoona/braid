const Rx = require('rxjs/Rx');

class View {
    constructor(rl) {
        this.rl = rl;
        this.isPause = false;
    }

    renderPrompt() {
        this.rl.prompt();
        return this;
    }

    render(value) {
        console.log(value);
        return this;
    }

    pause() {
        this.isPause = true;
        this.rl.pause();
    }

    subscribeKeyInputEvent(cb) {
        if (this.isPause) {
           this.rl.resume();
           this.isPause = false;
        }

        const lines = Rx.Observable.fromEvent(this.rl, 'line');
        lines.subscribe(cb);
        return this;
    }
}

function createView(rl) {
    return new View(rl);
}

module.exports = createView;