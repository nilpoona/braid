class Task {
    constructor(data, emitter) {
        this.data = data;
        this.emitter = emitter;
    }

    get hasMessage() {
        return this.data.hasOwnProperty('message');
    }

    get hasStdin() {
        return this.data.hasOwnProperty('stdin');
    }

    get message() {
        return this.data.message;
    }

    exec() {
        if (this.hasMessage) {
            this.emitter.emit('echo', this.message);
        }
    }
}

const createTask = (data, emitter) => {
    return new Task(data, emitter);
};

module.exports = createTask;
