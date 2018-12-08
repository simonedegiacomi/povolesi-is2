const TaskHelper = require('../helpers/task_helper');
const UserHelper = require('../helpers/user_helper');
const TaskService = require('../../src/services/task_service');


describe("Test the creation of a new task", () => {

    test('should crate a new open question task', async () => {
        let user = await UserHelper.insertNewRandom();
        const task = await TaskHelper.createOpenQuestionTask(user.id);

        await TaskHelper.expectTaskToExistInDb(task.id);
    });

    test('should throw an exception when trying to create a open task without the question', async () => {
        try {
            await TaskService.createTask({
                type: 'open',
                maxLength: 255,
                canBePeerReviewed: true
            });
            expect().toFail();
        } catch (e) {
            expect(e.message).toContain(TaskService.errors.WRONG_ARGUMENTS);
        }
    });

    test('should throw an exception when trying to create a open task without the type', async () => {
        try {
            await TaskService.createTask({
                name: 'a',
                maxLength: 255,
                canBePeerReviewed: true
            });
            expect().toFail();
        } catch (e) {
            expect(e.message).toContain(TaskService.errors.WRONG_ARGUMENTS);
        }
    });

    test('should throw an exception when trying to create a multiple choice task without the choices', async () => {
        try {
            await TaskService.createTask({
                type: 'multiple',
                name: 'a',
                canBePeerReviewed: true
            });
            expect().toFail();
        } catch (e) {
            expect(e.message).toContain(TaskService.errors.WRONG_ARGUMENTS);
        }
    });

    test('should crate a new link question', async () => {
        let user = await UserHelper.insertNewRandom();
        const task = await TaskHelper.createLinkTask(user.id);

        await TaskHelper.expectTaskToExistInDb(task.id);
    });

    test('should crate a new open multiple choice question', async () => {
        let user = await UserHelper.insertNewRandom();
        const task = await TaskHelper.createMultipleChoiceTask(user.id);

        await TaskHelper.expectTaskToExistInDb(task.id);
    });
});

describe("Test the retrieval of all the tasks", () => {
    let user;
    beforeEach(async () => {
        user = await UserHelper.insertNewRandom();
    });

    test('Should return an empty array if there are no tasks', async () => {
        let tasks = await TaskService.getTasks(user.id);

        expect(tasks).toMatchObject([]);
    });


    test('Should be able to retrieve a single task', async () => {
        let questionA = await TaskHelper.createValidTaskWithQuestion(user.id, "A");
        let tasks = await TaskService.getTasks(user.id);

        expect(tasks[0].question).toBe(questionA.question);
    });

    test('Should be able to retrieve multiple tasks', async () => {
        await TaskHelper.createValidTaskWithQuestion(user.id, "A");
        await TaskHelper.createValidTaskWithQuestion(user.id, "B");

        let tasks = await TaskService.getTasks(user.id);
        expect(tasks).toHaveLength(2);
    });

    test('User should not be able to see tasks of other users that do not share a group with him', async () => {
        let firstUserQuestion = await TaskHelper.createValidTaskWithQuestion(user.id, "A");

        let anotherUser = await UserHelper.insertNewRandom();
        let anotherUserQuestion = await TaskHelper.createValidTaskWithQuestion(anotherUser.id, "B");

        let tasksA = await TaskService.getTasks(user.id);
        expect(tasksA[0].question).toBe(firstUserQuestion.question);

        let tasksB = await TaskService.getTasks(anotherUser.id);
        expect(tasksB[0].question).toBe(anotherUserQuestion.question);
    });

    //TODO: implement this once the task draws are finished
    //
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

describe("Test the retrieval of a task with a specific ID", () => {

    test('Should be able to retrieve a task with a specific ID', async () => {
        let user = await UserHelper.insertNewRandom();
        let task = await TaskHelper.createValidTaskWithQuestion(user.id, "A");

        let foundTask = await TaskService.getTask(task.id, user.id);
        expect(foundTask).toBeDefinedAndNotNull()
    });

    test('Should fail to retrieve a non-existing task', async () => {
        try {
            await TaskService.getTask(10000, 0);
            expect().toFail();
        } catch (e) {
        }

    });

    test('Should fail to retrieve a task of other users that do not share a group with him', async () => {
        let mario = await UserHelper.insertMario();
        let giorgio = await UserHelper.insertGiorgio();

        let taskCreatedByMario = await TaskHelper.createValidTaskWithQuestion(mario.id, "A");

        try {
            await TaskService.getTask(taskCreatedByMario.id, giorgio.id);
            expect().toFail();
        } catch (e) {
        }
    });
});


describe("Test the deletion of a task with a specific ID", () => {

    test('Should delete a task', async () => {
        let user = await UserHelper.insertNewRandom();
        let task = await TaskHelper.createValidTask(user.id);

        await TaskHelper.expectTaskToExistInDb(task.id);
        await TaskService.deleteTask(task.id, user.id);
        await TaskHelper.expectTaskToNotExistInDb(task.id);
    });

    test('Should throw an error when a task does not exists', async () => {
        let user = await UserHelper.insertNewRandom();
        try {
            await TaskService.deleteTask(1, user.id);
            expect().toFail();
        } catch (e) {
        }
    });

    test('Should not allow to delete a task that is not manageable by the user', async () => {
        let giorgio = await UserHelper.insertGiorgio();
        let mario = await UserHelper.insertMario();

        let taskCreatedByGiorgio = await TaskHelper.createValidTask(giorgio.id);

        try {
            await TaskService.deleteTask(taskCreatedByGiorgio.id, mario.id);
            expect().toFail();
        } catch (e) {
        }

    });

});
