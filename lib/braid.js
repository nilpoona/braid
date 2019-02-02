const { createTask, createTaskResult } = require('./task');
const createView = require('./view');
const TaskExecuteError = require('./error');
const readline = require('readline');

const createCli = () => {
    return readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
};

const defaultTaskData = {
    name: 'task name',
};

class Application {
    constructor(view) {
        this.taskResults = [];
        this.tasks = [];
        this.view = view;
    }

    async execTasks(tasks) {
        let result;
        const view = this.view;
        for (const task of tasks) {
            if (task.hasMessage) {
                 view.render(task.getMessage());
            }

            if (task.hasStdin) {
                // TODO Refactor
                result = await (() => {
                    return new Promise((resolve, reject) => {
                        view.renderPrompt();
                        view.subscribeKeyInputEvent((str) => {
                            const isSuccess = task.validate(str);
                            if (isSuccess) {
                                try {
                                    resolve(task.data.task(str.trim(), result));
                                    return;
                                } catch (err) {
                                    execError = new TaskExecuteError(err.name, err.message, err.stack);
                                    reject(execError);
                                    return;
                                }
                            }

                            const errMessage = task.getValidateErrorMessage();
                            view.render(errMessage);
                            view.renderPrompt();
                            return;
                        });
                    });
                })();
                view.pause();
            } else {
                try {
                    result = await task.exec(result);
                } catch (err) {
                    execError = new TaskExecuteError(err.name, err.message, err.stack);
                    Promise.reject(execError);
                }
            }

            if (result) {
                this.taskResults.push(createTaskResult(result, task.no, task.name));
            }
        }

        return this.taskResults;
    }

    addTask(data = {}) {
        const task = createTask(data, this.tasks.length)
        this.tasks.push(task);
        return this;
    }

    deleteTaskByIndex(index = 0) {
        this.tasks.splice(index, 1);
        return this;
    }

    deleteTasks() {
        this.tasks = [];
        return this;
    }

    exec () {
        return this.execTasks(this.tasks);
    }
}

function createBraid() {
    const rl = createCli();
    const view = createView(rl);
    const app = new Application(view);
    return app;
}

module.exports = {
    createBraid,
    defaultTaskData,
};
