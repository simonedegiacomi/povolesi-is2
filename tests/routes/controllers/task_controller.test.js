const request = require('supertest');

const app         = require('../../../src/app');
const UserHelper  = require('../../helpers/user_helper');
const {Task}      = require('../../../src/models');

describe("Test the creation of a new task", () => {

    test('POST /task with valid data should return 200', async () => {
        const user     = await UserHelper.insertNewRandom();
        const response = await request(app)
            .post('/api/v1/tasks')
            .set('X-API-TOKEN', user.authToken)
            .send({
                question        : 'What is the meaning of life?',
                type            : 'open',
                maxLength       : 255,
                canBePeerReviewd: true
            });

        expect(response.status).toBe(201);
        expect(response.body.taskId).toBeDefined();

        const fromDb = await Task.findOne({
            where: {id: response.body.taskId}
        });
        expect(fromDb).toBeDefined();
    });

    test('POST /task without the question should return 400', async () => {
        const user     = await UserHelper.insertNewRandom();
        const response = await request(app)
            .post('/api/v1/tasks')
            .set('X-API-TOKEN', user.authToken)
            .send({
                type            : 'open',
                maxLength       : 255,
                canBePeerReviewd: true
            });

        expect(response.status).toBe(400);
    });

    test('POST /task without the type should return 400', async () => {
        const user     = await UserHelper.insertNewRandom();
        const response = await request(app)
            .post('/api/v1/tasks')
            .set('X-API-TOKEN', user.authToken)
            .send({
                question        : 'What is the meaning of life?',
                maxLength       : 255,
                canBePeerReviewd: true
            });

        expect(response.status).toBe(400);
    });

    test('POST /task with multiple choice type but without choices should return 400', async () => {
        const user     = await UserHelper.insertNewRandom();
        const response = await request(app)
            .post('/api/v1/tasks')
            .set('X-API-TOKEN', user.authToken)
            .send({
                question        : 'What is the meaning of life?',
                canBePeerReviewd: true,
                type            : 'multiple'
            });

        expect(response.status).toBe(400);
    });

    test('should crate a new link question', async () => {
        const user     = await UserHelper.insertNewRandom();
        const response = await request(app)
            .post('/api/v1/tasks')
            .set('X-API-TOKEN', user.authToken)
            .send({
                question        : 'What is the meaning of life?',
                type            : 'link',
                maxLength       : 255,
                canBePeerReviewd: true
            });

        expect(response.status).toBe(201);
        expect(response.body.taskId).toBeDefined();

        const fromDb = await Task.findOne({
            where: {id: response.body.taskId}
        });
        expect(fromDb).toBeDefined();
    });

    test('should crate a new open multiple choice question', async () => {
        const user     = await UserHelper.insertNewRandom();
        const response = await request(app)
            .post('/api/v1/tasks')
            .set('X-API-TOKEN', user.authToken)
            .send({
                question        : 'What is the meaning of life?',
                type            : 'multiple',
                canBePeerReviewd: true,
                choices         : ["Happiness", "Balance", 42]
            });

        expect(response.status).toBe(201);
        expect(response.body.taskId).toBeDefined();

        const fromDb = await Task.findOne({
            where: {id: response.body.taskId}
        });
        expect(fromDb).toBeDefined();
    });

});