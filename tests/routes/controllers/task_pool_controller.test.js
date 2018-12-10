const request = require('supertest');

const app = require('../../../src/app');

const UserHelper  = require('../../helpers/user_helper');
const TaskHelper  = require('../../helpers/task_helper');
const TaskPoolHelper  = require('../../helpers/task_pool_helper');
const {TaskPool}      = require('../../../src/models');

describe('POST /task-pools', () => {

    test('POST /task-pools with valid data 201 with no tasks', async() => {
        const user = await UserHelper.insertNewRandom();

        const taskPoolExample = TaskPoolHelper.createSampleTaskPool(user);
        const response = await request(app)
            .post('/api/v1/task-pools')
            .set('X-API-TOKEN',user.authToken)
            .send(taskPoolExample);


        expect(response.status).toBe(201);
        expect(response.body.taskPoolId).toBeDefinedAndNotNull();

        const fromDb = await TaskPool.findOne({
            where: {id: response.body.taskPoolId}
        });


        expect(fromDb).toBeDefinedAndNotNull();
    });

    test('POST /task-pools with valid data 401 with valid tasks', async() => {
        const user = await UserHelper.insertNewRandom();
        const task1 = await TaskHelper.createValidTask(user.id,"come sta lei?");
        const task2 = await TaskHelper.createValidTask(user.id,"come stai?");
        const taskPoolExample = TaskPoolHelper.createSampleTaskPool(user);

        const response = await request(app)
            .post('/api/v1/task-pools')
            .set('X-API-TOKEN',user.authToken)
            .send({
                ...taskPoolExample,
                tasks : [task1.id,task2.id]
            });

        expect(response.status).toBe(401);
        expect(response.body.message).toEqual("tasks not exist");

        const fromDb = await TaskPool.findOne({
            where: {id: response.body.taskPoolId}
        });
        expect(fromDb).toBeNull();
    });

    test('POST /task-pools with valid data 401 with inexistent tasks', async() => {
        const user = await UserHelper.insertNewRandom();

        const taskPoolExample = TaskPoolHelper.createSampleTaskPool(user);
        const response = await request(app)
            .post('/api/v1/task-pools')
            .set('X-API-TOKEN',user.authToken)
            .send({
                ...taskPoolExample,
                tasks : [12,60,32]
            });

        expect(response.status).toBe(401);
        expect(response.body.message).toEqual("tasks not exist");

        const fromDb = await TaskPool.findOne({
            where: {id: response.body.taskPoolId}
        });
        expect(fromDb).toBeNull();
    });


});

describe('GET /task-pools', () => {

    test('GET /task-pools with valid data 201 with no tasks', async() => {
        const giorgio = await UserHelper.insertGiorgio();
        const taskPool = await TaskPoolHelper.insertTaskPoolEmpty(giorgio);

        const response = await request(app)
            .get('/api/v1/task-pools')
            .set('X-API-TOKEN',giorgio.authToken);


        expect(response.status).toBe(200);

        const result = response.body;
        expect(result[0].id).toEqual(taskPool.id);
        expect(result[0].name).toEqual(taskPool.name);

    });

    test('GET /task-pools with valid data 201 with two tasksPool', async() => {
        const giorgio = await UserHelper.insertGiorgio();

        await TaskPoolHelper.insertTaskPoolWith2TasksCreatedBy(giorgio);
        await TaskPoolHelper.insertTaskPoolEmpty(giorgio);

        const response = await request(app)
            .get('/api/v1/task-pools')
            .set('X-API-TOKEN',giorgio.authToken);


        expect(response.status).toBe(200);

        const result = response.body;
        for(let t of result){
            expect(t.id).toEqual(t.id);
            expect(t.name).toEqual(t.name);
        }

        expect(result.length).toEqual(2);

    });

    test('GET /task-pools with valid data 201 with two tasks', async() => {
        const giorgio = await UserHelper.insertGiorgio();
        await TaskPoolHelper.insertTaskPoolWith2TasksCreatedBy(giorgio);

        const response = await request(app)
            .get('/api/v1/task-pools')
            .set('X-API-TOKEN',giorgio.authToken);


        expect(response.status).toBe(200);

        const result = response.body;
        expect(result[0].tasks.length).toEqual(2);

    });

    test('GET /task-pools with no authentication', async() => {

        const response = await request(app)
            .get('/api/v1/task-pools');

        expect(response.status).toBe(401);
    });

});
