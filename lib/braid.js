const createTask = require('./task');
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
        this.taskResults = {};
        this.tasksData = [];
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
                this.taskResults[task.name] = result;
            }
        }

        return this.taskResults;
    }

    addTaskData(data = {}) {
        this.tasksData.push(data);
        return this;
    }

    deleteTaskDataByIndex(index = 0) {
        this.tasksData.splice(index, 1);
        return this;
    }

    emptyTasksData() {
        this.tasksData = [];
        return this;
    }

    exec () {
        const tasks = this.tasksData.map((data, index) => {
            return createTask(data, index);
        });

        return this.execTasks(tasks);
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
