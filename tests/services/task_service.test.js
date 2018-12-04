const TaskHelper  = require('../helpers/task_helper');
const UserHelper  = require('../helpers/user_helper');
const {Task}      = require('../../src/models');
const TaskService = require('../../src/services/task_service');

async function expectTaskToExistInDb(task) {
    const fromDb = await Task.findOne({
        where: {id: task.id}
    });
    expect(fromDb).toBeDefined();
}

describe("Test the creation of a new task", () => {

    test('should crate a new open question task', async () => {
        let user   = await UserHelper.insertNewRandom();
        const task = await TaskHelper.createOpenQuestionTask(user.id);

        await expectTaskToExistInDb(task);
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
        let user   = await UserHelper.insertNewRandom();
        const task = await TaskHelper.createLinkTask(user.id);

        await expectTaskToExistInDb(task);
    });

    test('should crate a new open multiple choice question', async () => {
        let user   = await UserHelper.insertNewRandom();
        const task = await TaskHelper.createMultipleChoiceTask(user.id);

        await expectTaskToExistInDb(task);
    });
});

describe("Test the retrieval of all the tasks", () => {
    let user;
    beforeEach(async () => {
        user = await UserHelper.insertNewRandom();
    });

    test('Should return an empty array if there are no tasks', async () => {
        let tasks = TaskService.getTasks(user.id);

        expect(tasks).toMatchObject({});
    });


    test('Should be able to retrieve a single task', async () => {
        let questionA = await TaskHelper.createValidTaskWithQuestion(user.id, "A");
        let tasks = await TaskService.getTasks(user.id);

        expect(tasks[0].question).toBe(questionA.question);
    });

    test('Should be able to retrieve multiple tasks', async () => {
        await TaskHelper.createValidTaskWithQuestion(user.id, "A");
        await TaskHelper.createValidTaskWithQuestion(user.id, "B");

        let tasks     = await TaskService.getTasks(user.id);
        expect(tasks).toHaveLength(2);
    });

    test('User should not be able to see tasks of other users that do not share a group with him', async () => {
        let firstUserQuestion = await TaskHelper.createValidTaskWithQuestion(user.id, "A");

        let anotherUser         = await UserHelper.insertNewRandom();
        let anotherUserQuestion = await TaskHelper.createValidTaskWithQuestion(anotherUser.id, "B");

        let tasksA = await TaskService.getTasks(user.id);
        expect(tasksA[0].question).toBe(firstUserQuestion.question);

        let tasksB = await TaskService.getTasks(anotherUser.id);
        expect(tasksB[0].question).toBe(anotherUserQuestion.question);
    });

    //TODO:
    // test('User should be able to see tasks of other users that do share a group with him', async () => {
    //     let anotherUser         = await UserHelper.insertNewRandom();
    //     let anotherUserQuestion = await TaskHelper.createValidTaskWithQuestion(anotherUser.id, "A");
    //
    //     let group = await UserGroupsHelper.createGroup();
    //
    //
    //     let tasksA = await TaskService.getTasks(user.id);
    //     expect(tasksA[0].question).toBe(firstUserQuestion.question);
    //
    //     let tasksB = await TaskService.getTasks(anotherUser.id);
    //     expect(tasksB[0].question).toBe(anotherUserQuestion.question);
    // });

});