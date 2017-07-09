const test = require('ava');
const sinon = require('sinon');
const createTask = require('../src/task'); 

const base = {
    message: 'message',
    name: 'name',
    stdin: true,
    validate: {
        logic: () => true,
        message: 'fail',
    },
    task: (data) => data,
};

test('hasMessage', t => {
    let task = createTask(base, 0);
    t.true(task.hasMessage);

    task = createTask({
        name: 'name',
    }, 0);
    t.false(task.hasMessage);
});

test('hasStdin', t => {
    let task = createTask(base, 0);
    t.true(task.hasStdin);

    task = createTask({
        name: 'name',
    }, 0);
    t.false(task.hasStdin);
});

test('hasTask', t => {
    let task = createTask(base, 0);
    t.true(task.hasTask);

    task = createTask({
        name: 'name',
    }, 0);
    t.false(task.hasTask);
});

test('hasValidate', t => {
    let task = createTask(base, 0);
    t.true(task.hasValidate);

    task = createTask({
        name: 'name',
    }, 0);
    t.false(task.hasValidate);
});

test('name', t => {
    let task = createTask(base, 0);
    t.deepEqual(task.name, base.name);

    task = createTask({
        message: 'message',
    }, 0);

    t.deepEqual(task.name, 'task0');
});

test('validate', t => {
    const spy = sinon.spy();
    const data = Object.assign({}, base, {
        validate: {
            logic: spy,
            message: 'fail',
        }
    });
    let task = createTask(data, 0);
    task.validate('foo');
    t.true(spy.calledOnce);

    task = createTask({
         message: 'message',
        name: 'name',
        stdin: true,
        task: () => true,
    });
    t.true(task.validate('foo'));
    t.true(spy.calledOnce);
});

test('exec', t => {
    const spy = sinon.spy();
    const data = {
        message: 'message',
        name: 'name',
        validate: {
            logic: () => true,
            message: 'fail',
        },
        task: spy,
    };

    let task = createTask(data, 0);
    const echoStub = sinon.stub(task, 'echo').callsFake(() => true);
    task.exec(1);
    t.true(echoStub.calledOnce);
    t.true(spy.calledOnce);
});
