const readline = require('readline');

class Cli {
    constructor(rl, emitter) {
        this.rl = rl; 
        this.emitter = emitter;
    }

    setPrompt(str) {
        this.rl.setPrompt(str);
    }

    on(name, cb) {
        this.rl.on(name, cb);
    }

    echo(str) {
        console.log(str);
    }
}

const createCli = (rl = readline, stdin = process.stdin, stdout = process.stdout, emitter) => {
    return new Cli(
        readline.createInterface({ input: stdin, output: stdout }),
        emitter
    );
};

module.exports = createCli;
