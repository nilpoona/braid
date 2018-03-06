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

const createExecutor = () => {
    const taskResults = {};

    async function executor(tasks, view) {
        let result;
        for (let task of tasks) {
            if (task.hasMessage) {
                 view.render(task.getMessage());
            }

            if (task.hasStdin) {
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
                taskResults[task.name] = result;
            }
        }

        return taskResults;
    }

    function exec (taskData) {
        const rl = createCli();
        const tasks = taskData.map((data, index) => {
            return createTask(data, index);
        });

        const view = createView(rl);

        return executor(tasks, view);
    }

    return {
        exec,
    };
};

module.exports = createExecutor;
