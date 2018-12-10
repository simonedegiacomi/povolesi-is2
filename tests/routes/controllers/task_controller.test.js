const request = require('supertest');

const app = require('../../../src/app');
const UserHelper = require('../../helpers/user_helper');
const TaskHelper = require('../../helpers/task_helper');
const {Task} = require('../../../src/models');

async function postTaskWithUser(user, taskBody) {
    return await request(app)
        .post('/api/v1/tasks')
        .set('X-API-TOKEN', user.authToken)
        .send(taskBody);
}

async function postTaskWithAuthenticatedUser(taskBody) {
    const user = await UserHelper.insertNewRandom();
    return await postTaskWithUser(user, taskBody);
}

async function postTaskWithAuthenticatedUserAndExpectCode(body, code) {
    let response = await postTaskWithAuthenticatedUser(body);

    expect(response.status).toBe(code);

    return response;
}

async function expectTaskWithIdToBeInDb(taskId) {
    const fromDb = await Task.findOne({
        where: {id: taskId}
    });
    expect(fromDb).toBeDefinedAndNotNull();
}

async function postTaskWithAuthenticatedUserHavingCodeAndExpectToBeDefined(body, code) {
    const response = await postTaskWithAuthenticatedUserAndExpectCode(body, code);

    let taskId = response.body.taskId;
    expect(taskId).toBeAnInteger();

    await expectTaskWithIdToBeInDb(taskId);
}

describe("Test the creation of a new task", () => {
    test('POST /task with valid data should return 200', async () => {
        await postTaskWithAuthenticatedUserHavingCodeAndExpectToBeDefined({
            question: 'What is the meaning of life?',
            type: 'open',
            maxLength: 255,
            canBePeerReviewed: true
        }, 201);
    });

    test('POST /task without the question should return 400', async () => {
        await postTaskWithAuthenticatedUserAndExpectCode({
            type: 'open',
            maxLength: 255,
            canBePeerReviewed: true
        }, 400);
    });

    test('POST /task without the type should return 400', async () => {
        await postTaskWithAuthenticatedUserAndExpectCode({
            question: 'What is the meaning of life?',
            maxLength: 255,
            canBePeerReviewed: true
        }, 400);
    });

    test('POST /task with multiple choice type but without choices should return 400', async () => {
        await postTaskWithAuthenticatedUserAndExpectCode({
            question: 'What is the meaning of life?',
            canBePeerReviewed: true,
            type: 'multiple'
        }, 400);
    });

    test('should crate a new link question', async () => {
        await postTaskWithAuthenticatedUserHavingCodeAndExpectToBeDefined({
            question: 'What is the meaning of life?',
            type: 'link',
            maxLength: 255,
            canBePeerReviewed: true
        }, 201);
    });

    test('should crate a new open multiple choice question', async () => {
        await postTaskWithAuthenticatedUserHavingCodeAndExpectToBeDefined({
            question: 'What is the meaning of life?',
            type: 'multiple',
            canBePeerReviewed: true,
            choices: ["Happiness", "Balance", 42]
        }, 201);
    });

});

function createValidTaskWithQuestion(question) {
    return {
        question: question,
        type: 'open',
        maxLength: 255,
        canBePeerReviewed: true
    };
}

async function createValidTaskWithQuestionAndUser(user, question) {
    let task = createValidTaskWithQuestion(question);
    let response = await postTaskWithUser(user, task);

    task.id = response.body.taskId;
    return task;
}

describe("Test the retrieval of all the tasks", () => {

    test('should return all tasks that the user created', async () => {
        let user = await UserHelper.insertNewRandom();

        let taskA = await createValidTaskWithQuestionAndUser(user, "A");
        let taskB = await createValidTaskWithQuestionAndUser(user, "B");

        let response = await request(app)
            .get('/api/v1/tasks')
            .set('X-API-TOKEN', user.authToken)
            .send();

        let answersArray = response.body.map((task) => task.question);
        expect(answersArray).toContain(taskA.question);
        expect(answersArray).toContain(taskB.question);
    });

});

describe("Test the retrieval of a single task", () => {

    test('Should return an existing task with the given id', async () => {
        let user = await UserHelper.insertNewRandom();
        let task = await createValidTaskWithQuestionAndUser(user, "A");

        let response = await request(app)
            .get('/api/v1/tasks/' + task.id)
            .set('X-API-TOKEN', user.authToken)
            .send();

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(task.id);

    });

    test('Should return 404 error for not existing tasks', async () => {
        let user = await UserHelper.insertNewRandom();
        let response = await request(app)
            .get('/api/v1/tasks/123456')
            .set('X-API-TOKEN', user.authToken)
            .send();

        expect(response.status).toBe(404);
    });

});

describe("Test the deletion of a single task", () => {

    test('Should delete tasks', async () => {
        let user = await UserHelper.insertNewRandom();
        let task = await TaskHelper.createValidTask(user.id);

        await request(app)
            .delete('/api/v1/tasks/' + task.id)
            .set('X-API-TOKEN', user.authToken)
            .send();

        await TaskHelper.expectTaskToNotExistInDb(task.id)
    });

    test('Should not delete tasks that do not exist', async () => {
        let user = await UserHelper.insertNewRandom();

        let response = await request(app)
            .delete('/api/v1/tasks/123456')
            .set('X-API-TOKEN', user.authToken)
            .send();

        expect(response.status).toBe(404);
    });

});