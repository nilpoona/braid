const EventEmitter = require('events');
const createTask = require('./task');
const creaeCli = require('./cli');

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
            stdin: true,
            task: (str) => console.log(str),
        },
    ];


    const emitter = new EventEmitter();
    const cli = creaeCli(emitter);

    const tasks = taskData.map((data) => {
        return createTask(data, emitter);
    });

    console.log(tasks);
};

createBraid();
