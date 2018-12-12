const request = require('supertest');

const app = require('../../../src/app');

const UserHelper = require('../../helpers/user_helper');
const TaskHelper = require('../../helpers/task_helper');
const TaskPoolHelper = require('../../helpers/task_pool_helper');
const {TaskPool} = require('../../../src/models');
const TaskPoolService = require('../../../src/services/task_pool_service');
const {postTaskPool} = require('./common');

function createTaskPoolToSend() {
    return {
        name: 'esempio',
        numQuestionsToDraw: 0,
        tasks: []
    }
}

describe('POST /task-pools', () => {

    test('POST /task-pools with valid data should return 201 with no tasks', async () => {
        const user = await UserHelper.insertNewRandom();
        const taskPoolExample = createTaskPoolToSend(user.id);
        const response = await postTaskPool(taskPoolExample, user);


        expect(response.status).toBe(201);
        expect(response.body.taskPoolId).toBeDefinedAndNotNull();

        const fromDb = await TaskPool.findOne({
            where: {id: response.body.taskPoolId}
        });

        expect(fromDb).toBeDefinedAndNotNull();
    });

    test('POST /task-pools with valid data should return 201', async () => {
        const user = await UserHelper.insertNewRandom();
        const task1 = await TaskHelper.createValidTask(user.id, "come sta lei?");
        const task2 = await TaskHelper.createValidTask(user.id, "come stai?");
        const taskPoolExample = createTaskPoolToSend(user.id);
        const response = await postTaskPool({
            ...taskPoolExample,
            tasks: [task1.id, task2.id]
        }, user);

        expect(response.status).toBe(201);

        const fromDb = await TaskPool.findOne({
            where: {id: response.body.taskPoolId}
        });
        expect(fromDb).toBeDefinedAndNotNull();
    });

    test('POST /task-pools with tasks that doesn\'t exist should return 404', async () => {
        const user = await UserHelper.insertNewRandom();
        const taskPoolExample = createTaskPoolToSend(user.id);
        const response = await postTaskPool({
            ...taskPoolExample,
            tasks: [12, 60, 32],
        }, user);

        expect(response.status).toBe(404);
        expect(response.body.errorMessage).toEqual(TaskPoolService.errors.TASK_NOT_FOUND);
    });

    test('POST /task-pools with one task but numQuestionsToDraw=2 should return 400', async () => {
        const user = await UserHelper.insertNewRandom();
        const taskPoolExample = createTaskPoolToSend(user.id);
        const response = await postTaskPool({
            ...taskPoolExample,
            tasks: [
                (await TaskHelper.createValidTask(user.id)).id
            ],
            numQuestionsToDraw: 2
        }, user);

        expect(response.status).toBe(400);
        expect(response.body.errorMessage).toEqual("numQuestionsToDraw is greater than the number of tasks");
    });

});

describe('GET /task-pools', () => {

    test('GET /task-pools with valid data 201 with no tasks', async () => {
        const giorgio = await UserHelper.insertGiorgio();
        const taskPool = await TaskPoolHelper.insertTaskPoolEmpty(giorgio.id);

        const response = await request(app)
            .get('/api/v1/task-pools')
            .set('X-API-TOKEN', giorgio.authToken);


        expect(response.status).toBe(200);

        const result = response.body;
        expect(result[0].id).toEqual(taskPool.id);
        expect(result[0].name).toEqual(taskPool.name);

    });

    test('GET /task-pools with valid data 201 with two tasksPool', async () => {
        const giorgio = await UserHelper.insertGiorgio();

        await TaskPoolHelper.insertTaskPoolWith2TasksCreatedBy(giorgio.id);
        await TaskPoolHelper.insertTaskPoolEmpty(giorgio.id);

        const response = await request(app)
            .get('/api/v1/task-pools')
            .set('X-API-TOKEN', giorgio.authToken);


        expect(response.status).toBe(200);

        const result = response.body;
        for (let t of result) {
            expect(t.id).toEqual(t.id);
            expect(t.name).toEqual(t.name);
        }

        expect(result.length).toEqual(2);

    });

    test('GET /task-pools with valid data 201 with two tasks', async () => {
        const giorgio = await UserHelper.insertGiorgio();
        await TaskPoolHelper.insertTaskPoolWith2TasksCreatedBy(giorgio.id);

        const response = await request(app)
            .get('/api/v1/task-pools')
            .set('X-API-TOKEN', giorgio.authToken);


        expect(response.status).toBe(200);

        const result = response.body;
        expect(result[0].tasks.length).toEqual(2);

    });

    test('GET /task-pools with no authentication', async () => {

        const response = await request(app)
            .get('/api/v1/task-pools');

        expect(response.status).toBe(401);
    });

});

function sendGetTaskPoolById(taskPoolId, user) {
    return request(app)
        .get(`/api/v1/task-pools/${taskPoolId}`)
        .set('X-API-TOKEN', user.authToken);
}

describe('GET /task-pools/id', () => {

    test('GET /task-pools/id should return 200', async () => {
        const giorgio = await UserHelper.insertGiorgio();
        const taskPool = await TaskPoolHelper.insertTaskPoolWith2TasksCreatedBy(giorgio.id);

        const response = await sendGetTaskPoolById(taskPool.id, giorgio);
        const result = response.body;

        expect(response.status).toBe(200);
        expect(result).toBeDefinedAndNotNull();
        expect(result.id).toEqual(taskPool.id);
        expect(result.tasks.length).toEqual((await taskPool.getTasks()).length);
        expect(result.name).toEqual(taskPool.name);

    });

    test('GET /task-pools/id from a user that can\'t manage the specified task should return 403', async () => {
        const giorgio = await UserHelper.insertGiorgio();
        const mario = await UserHelper.insertMario();
        const taskPool = await TaskPoolHelper.insertTaskPoolEmpty(giorgio.id);

        const response = await sendGetTaskPoolById(taskPool.id, mario);
        const result = response.body;

        expect(response.status).toBe(403);
        expect(result).toEqual({errorMessage: TaskPoolService.errors.USER_CANT_MANAGE_TASK_POOL})
    });

    test('GET /task-pools/id which not exist should return 404', async () => {
        const giorgio = await UserHelper.insertGiorgio();

        const response = await sendGetTaskPoolById(123, giorgio);
        const result = response.body;

        expect(response.status).toBe(404);
        expect(result).toEqual({errorMessage: TaskPoolService.errors.TASK_POOL_NOT_FOUND})
    });

});

function sendDeleteTaskPoolById(taskPoolId, user) {
    return request(app)
        .delete(`/api/v1/task-pools/${taskPoolId}`)
        .set('X-API-TOKEN', user.authToken);
}

describe('DELETE /task-pools/id', () => {



    test('DELETE /task-pools/id should return 200', async () => {
        const giorgio = await UserHelper.insertGiorgio();
        const taskPool = await TaskPoolHelper.insertTaskPoolWith2TasksCreatedBy(giorgio.id);

        const response = await sendDeleteTaskPoolById(taskPool.id, giorgio);
        const result = response.body;

        expect(response.status).toBe(200);
        expect(result).toBeDefinedAndNotNull();
        expect(result.id).toEqual(taskPool.id);
        expect(result.name).toEqual(taskPool.name);

    });

    test('DELETE /task-pools/id with a user that can\'t manage the specified task should return 403', async () => {
        const giorgio = await UserHelper.insertGiorgio();
        const mario = await UserHelper.insertMario();
        const taskPool = await TaskPoolHelper.insertTaskPoolEmpty(giorgio.id);

        const response = await sendDeleteTaskPoolById(taskPool.id, mario);
        const result = response.body;

        expect(response.status).toBe(403);
        expect(result).toEqual({errorMessage: TaskPoolService.errors.USER_CANT_MANAGE_TASK_POOL})
    });

    test('DELETE /task-pools/id which not exist should return 404', async () => {
        const giorgio = await UserHelper.insertGiorgio();

        const response = await sendDeleteTaskPoolById(123, giorgio);
        const result = response.body;

        expect(response.status).toBe(404);
        expect(result).toEqual({errorMessage: TaskPoolService.errors.TASK_POOL_NOT_FOUND})
    });

});
