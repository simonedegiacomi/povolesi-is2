const TaskHelper  = require('../helpers/task_helper');
const UserHelper  = require('../helpers/user_helper');
const {Task}      = require('../../src/models');
const TaskService = require('../../src/services/task_service');

describe("Test the creation of a new task", () => {

    test('should crate a new open question task', async () => {
        let user = await UserHelper.insertNewRandom();
        const task = await TaskHelper.createOpenQuestionTask(user.id);

        const fromDb = await Task.findOne({
            where: {id: task.id}
        });
        expect(fromDb).toBeDefined();
    });

    test('should throw an exception when trying to create a open task without the question', async () => {
        try {
            await TaskService.createTask({
                type            : 'open',
                maxLength       : 255,
                canBePeerReviewed: true
            });
            expect(true).toBe(false);
        } catch (e) {
            expect(e.message).toBe(TaskService.errors.WRONG_ARGUMENTS);
        }
    });

    test('should throw an exception when trying to create a open task without the type', async () => {
        try {
            await TaskService.createTask({
                name            : 'a',
                maxLength       : 255,
                canBePeerReviewed: true
            });
            expect(true).toBe(false);
        } catch (e) {
            expect(e.message).toBe(TaskService.errors.WRONG_ARGUMENTS);
        }
    });

    test('should throw an exception when trying to create a multiple choice task without the choices', async () => {
        try {
            await TaskService.createTask({
                type            : 'multiple',
                name            : 'a',
                canBePeerReviewed: true
            });
            expect(true).toBe(false);
        } catch (e) {
            expect(e.message).toBe(TaskService.errors.WRONG_ARGUMENTS);
        }
    });

    test('should crate a new link question', async () => {
        let user = await UserHelper.insertNewRandom();
        const task = await TaskHelper.createLinkTask(user.id);

        const fromDb = await Task.findOne({
            where: {id: task.id}
        });
        expect(fromDb).toBeDefined();
    });

    test('should crate a new open multiple choice question', async () => {
        let user = await UserHelper.insertNewRandom();
        const task = await TaskHelper.createMultipleChoiceTask(user.id);

        const fromDb = await Task.findOne({
            where: {id: task.id}
        });
        expect(fromDb).toBeDefined();
    });

});