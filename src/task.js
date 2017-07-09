class Task {
    constructor(data) {
        this.data = data;
    }

    get hasMessage() {
        return this.data.hasOwnProperty('message');
    }

    get hasStdin() {
        return this.data.hasOwnProperty('stdin');
    }

    get hasTask() {
        return this.data.hasOwnProperty('task');
    }

    get message() {
        return this.data.message;
    }

    exec(before = null) {
        return new Promise((resolve) => {
            if (this.hasMessage) {
                console.log(this.data.message);
            }
            
            if (this.hasTask && !this.hasStdin) {
               resolve(this.data.task(before));
            }
            
            if (!this.hasStdin) {
                resolve(before);
            }
        });
    }
}

const createTask = (data) => {
    return new Task(data);
};

module.exports = createTask;
