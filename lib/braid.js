const createTask = require('./task');
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

    async function executor(tasks) {
        let result;
        for (let task of tasks) {
            if (task.hasStdin) {
                let rl = createCli();
                result = await (() => {
                    return new Promise((resolve, reject) => {
                        if (task.hasMessage) {
                            task.echo();
                        }
                        rl.prompt();
                        rl.on('line', (str) => {
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
                            task.echoValidateErrorMessage();
                            rl.prompt();
                            return;
                        });
                    });
                })();
                rl.close();
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
        const tasks = taskData.map((data, index) => {
            return createTask(data, index);
        });

        return executor(tasks);
    }

    return {
        exec,
    };
};

module.exports = createExecutor;
