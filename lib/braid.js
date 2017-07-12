const co = require('co');
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

    const executor = function* (tasks) {
        let result;
        for (let task of tasks) {
            if (task.hasStdin) {
                let rl = createCli();
                result = yield (() => {
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
                result = yield task.exec(result);
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
        return co(executor(tasks))
        .then((value) => {
            return taskResults;
        }, (err) => {
          console.error(err.stack);
        });
    }

    return {
        exec,
    };
};

module.exports = createExecutor;
