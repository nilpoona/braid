# braid

## Usage

```javascript
const createExecutor = require('braid');
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
    task: (str) => return parseInt(str, 10) + 1,
  },
];
```

## Support
node.js 6
