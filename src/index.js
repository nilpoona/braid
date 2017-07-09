const co = require('co');
const createTask = require('./task');
const readline = require('readline');

const createCli = () => {
    return readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
};

const executor = function* (tasks) {
    let result;
    for (let task of tasks) {
        if (task.hasStdin) {
            let rl = createCli();
            rl.prompt();
            result = yield (() => {
                return new Promise((resolve) => {
                    rl.on('line', (str) => {
                        resolve(task.data.task(str.trim(), result));
                    });
                });
            })();
            rl.close();
        } else {
            result = yield task.exec(result);
        }
    }

    return result;
}

const createBraid = () => {
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
            stdin: true,
            task: (str, before) => console.log(str, before + 1),
        },
        {
            message: 'もう一回',
        },
        {
            stdin: true,
            task: (str, before) => Promise.resolve('unko'),
        },

    ];


    const tasks = taskData.map((data) => {
        return createTask(data);
    });

    return co(executor(tasks))
    .then((value) => {
        return value;
    }, (err) => {
      console.error(err.stack);
    });
};

createBraid()
.then(r => console.log(r))
