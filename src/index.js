const co = require('co');
const createTask = require('./task');
const readline = require('readline');

const createCli = () => {
    return readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
};

const taskData = [
    {
        message: 'foobar',
    },
    {
        task: () => 1,
    },
    {
        task: (n) => n + 1,
    },
    {
        message: '入力せよ',
    },
    {
        name: 'num',
        stdin: true,
        validate: {
            logic: (str) => {
                return [1, 2, 3].indexOf(parseInt(str, 10)) !== -1; 
            },
            message: '1,2,3のいずれかを入力してね',
        },
        task: (str, before) => console.log(str, before + 1),
    },
    {
        message: 'もう一回',
    },
    {
        name: 'str',
        stdin: true,
        task: (str, before) => Promise.resolve('bar'),
    },

];
const createExecutor = () => {
    const taskResults = {};

    const executor = function* (tasks) {
        let result;
        for (let task of tasks) {
            if (task.hasStdin) {
                let rl = createCli();
                rl.prompt();
                result = yield (() => {
                    return new Promise((resolve) => {
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

const executor = createExecutor();

executor.exec(taskData)
.then(r => console.log(r))
