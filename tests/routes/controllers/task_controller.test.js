const request = require('supertest');

const app         = require('../../../src/app');
const UserHelper  = require('../../helpers/user_helper');
const {Task}      = require('../../../src/models');

async function postTaskWithAuthenticatedUser(taskBody) {
    const user = await UserHelper.insertNewRandom();
    return await request(app)
        .post('/api/v1/tasks')
        .set('X-API-TOKEN', user.authToken)
        .send(taskBody);
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
    expect(fromDb).toBeDefined();
}

async function postTaskWithAuthenticatedUserHavingCodeAndExpectToBeDefined(body, code) {
    const response = await postTaskWithAuthenticatedUserAndExpectCode(body, code);

    let taskId = response.body.taskId;
    expect(taskId).toBeDefined();

    await expectTaskWithIdToBeInDb(taskId);
}

describe("Test the creation of a new task", () => {
    test('POST /task with valid data should return 200', async () => {
        await postTaskWithAuthenticatedUserHavingCodeAndExpectToBeDefined({
            question: 'What is the meaning of life?',
            type: 'open',
            maxLength: 255,
            canBePeerReviewd: true
        }, 201);
    });

    test('POST /task without the question should return 400', async () => {
        await postTaskWithAuthenticatedUserAndExpectCode({
            type            : 'open',
            maxLength       : 255,
            canBePeerReviewd: true
        }, 400);
    });

    test('POST /task without the type should return 400', async () => {
        await postTaskWithAuthenticatedUserAndExpectCode({
            question: 'What is the meaning of life?',
            maxLength: 255,
            canBePeerReviewd: true
        }, 400);
    });

    test('POST /task with multiple choice type but without choices should return 400', async () => {
        await postTaskWithAuthenticatedUserAndExpectCode({
            question        : 'What is the meaning of life?',
            canBePeerReviewd: true,
            type            : 'multiple'
        }, 400);
    });

    test('should crate a new link question', async () => {
        await postTaskWithAuthenticatedUserHavingCodeAndExpectToBeDefined({
            question        : 'What is the meaning of life?',
            type            : 'link',
            maxLength       : 255,
            canBePeerReviewd: true
        }, 201);
    });

    test('should crate a new open multiple choice question', async () => {
        await postTaskWithAuthenticatedUserHavingCodeAndExpectToBeDefined({
            question        : 'What is the meaning of life?',
            type            : 'multiple',
            canBePeerReviewd: true,
            choices         : ["Happiness", "Balance", 42]
        }, 201);
    });

});