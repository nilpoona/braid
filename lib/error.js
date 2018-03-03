class TaskExecuteError extends Error {
    constructor(name, message, stack) {
        super(message);
        this.name = `${this.constructor.name}(${name})`;
        this.stack = stack
    }
}

module.exports = TaskExecuteError;