const TaskHelper  = require('../helpers/task_helper');
const {Task}      = require('../../src/models');
const TaskService = require('../../src/services/task_service');

describe("Test the creation of a new task", () => {

    test('should crate a new open question task', async () => {
        const task = await TaskHelper.createOpenQuestionTask();

        const fromDb = await Task.findOne({
            where: {id: task.id}
        });
        expect(fromDb).toBeDefined();
    });

    test('should throw an exception when trying to create a open task without the name', async () => {
        try {
            await TaskService.createTask({
                type            : 'open',
                maxLength       : 255,
                canBePeerReviewd: true
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
                canBePeerReviewd: true
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
                canBePeerReviewd: true
            });
            expect(true).toBe(false);
        } catch (e) {
            expect(e.message).toBe(TaskService.errors.WRONG_ARGUMENTS);
        }
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