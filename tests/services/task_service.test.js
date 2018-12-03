const TaskHelper = require('../helpers/task_helper');
const {Task}     = require('../../src/models');

describe("Test the creation of a new task", () => {

    test('should crate a new open question task', async () => {
        const task = await TaskHelper.createOpenQuestionTask();

        const fromDb = await Task.findOne({
            where: {id: task.id}
        });
        expect(fromDb).toBeDefined();
    });

    test('should crate a new link question', async () => {
        const task = await TaskHelper.createLinkTask();

        const fromDb = await Task.findOne({
            where: {id: task.id}
        });
        expect(fromDb).toBeDefined();
    });

    test('should crate a new open multiple choice question', async () => {
        const task = await TaskHelper.createMultipleChoiceTask();

        const fromDb = await Task.findOne({
            where: {id: task.id}
        });
        expect(fromDb).toBeDefined();
    });

});