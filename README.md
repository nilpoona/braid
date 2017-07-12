# braid

## Usage

```javascript
const createExecutor = require('braid-cli');
const executor = createExecutor();

const taskData = [
  {
    name: 'echo start message',
    message: 'start.',
  },
  {
    name: 'enter number',
    stdin: true, //Obtain values from standard input.
    message: 'Please enter one of numbers from 1 to 4.',
    validate: {
      logic: (str) => [1, 2, 3, 4].indexOf(parseInt(str, 10)) !== -1, //Input value verification logic
      message: 'Please enter a number from 1 to 4',
    },
    task: (str) => parseInt(str, 10) + 1,
  },
  {
    name: 'number to string',
    task: (before) => `number: ${before}`,
  },
];

executor.exec(taskData)
.then((data) => {
  // {'enter number': n + 1, 'number to string': 'number: ${n}'};
  console.log(data);
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
node.js 6
