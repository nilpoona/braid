const createTask = require('./task');
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
                    return new Promise((resolve) => {
                        if (task.hasMessage) {
                            task.echo();
                        }
                        rl.prompt();
                        rl.on('line', (str) => {
                            const validationResult = task.validate(str);
                            if (validationResult) {
                                resolve(task.data.task(str.trim(), result));
                                return;
                            }
                            task.echoValidateErrorMessage();
                            rl.prompt();
                            return;
                        });
                    });
                })();
                rl.close();
            } else {
                result = await task.exec(result);
            }

            if (result) {
                taskResults[task.name] = result;
            }
        }

        return result;
    }

    const exec = (taskData) => {
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
