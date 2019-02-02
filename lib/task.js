class TaskResult {
    constructor(value, position, name) {
        this.value = value;
        this.position = position;
        this.name = name;
    }
}


class Task {
    constructor(data, index) {
        this.data = data;
        this.no = index;
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

    get hasValidate() {
        return this.data.hasOwnProperty('validate');
    }

    get name() {
        return this.data.name || `task${this.no}`;
    }

    get message() {
        return this.data.message;
    }

    validate(data) {
        if (this.hasValidate) {
            return this.data.validate.logic(data);
        }

        return true;
    }

    getValidateErrorMessage() {
        return this.data.validate.message || 'validation error.';
    }

    getMessage() {
        return this.data.message;
    }

    exec(before = null) {
        return new Promise((resolve) => {
            if (this.hasTask && !this.hasStdin) {
               resolve(this.data.task(before));
            }

            if (!this.hasStdin) {
                resolve(before);
            }
        });
    }
}

const createTask = (data, index) => {
    return new Task(data, index);
};

const createTaskResult = (value, position, name) => {
    return new TaskResult(value, position, name);
};

module.exports = {
    createTask,
    createTaskResult
};
