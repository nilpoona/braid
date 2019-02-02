# braid

## Usage

```javascript
const createBraid = require('../lib/braid.js').createBraid;
const braid = createBraid();

process.on('unhandledRejection', console.dir);

braid.addTask({
    name: 'echo start message',
    message: 'start.',
    })
    .addTask({
        name: 'enter number',
        stdin: true, //Obtain values from standard input.
        message: 'Please enter one of numbers from 1 to 4.',
        validate: {
          logic: (str) => [1, 2, 3, 4].indexOf(parseInt(str, 10)) !== -1, //Input value verification logic
          message: 'Please enter a number from 1 to 4',
        },
        task: (str) => {
            return parseInt(str, 10) + 1;
        },
    })
    .addTask({
        name: 'enter number2',
        task: (before) => {
            return new Promise((resolve) => {
                setTimeout(() => {
                  resolve(before + 100)
                }, 200)
            });
        },
    })
    .addTask({
        name: 'number to string',
        task: (before) => `number: ${before}`,
    });

braid.exec()
    .then((results) => {
        for (result of results) {
            // task result value
            console.log(result.value)
        }
    })
    .catch(err => {
      console.error(err);
    });
```

## Task Data
```javascript
{
  name: task name
  stdin: Flag to allow standard input
  message: String to be displayed in standard output
  validate: {
    logic: (str) => Function for verifying the value of standard input
    message: String to be displayed at validation error
  },
  task: () => A function that describes the processing you want to execute. If the stdin flag is true, it will be executed after it is entered. In that case the value entered in the first argument is passed. Otherwise, the result of the previous task is passed.
}
```

## Support
node.js v10.x
