const request = require('supertest');

const app = require('../../../src/app');

const UserHelper  = require('../../helpers/user_helper');
const TaskHelper  = require('../../helpers/task_helper');
const TaskPoolHelper  = require('../../helpers/task_pool_helper');
const {TaskPool}      = require('../../../src/models');
const TaskPoolService = require('../../../src/services/task_pool_service');

var createTaskPoolToSend = function(user){
    return {
        name: 'esempio',
        createdBy: user,
        numQuestionsToDraw: 0
    }
};


describe('POST /task-pools', () => {

    test('POST /task-pools with valid data 201 with no tasks', async() => {
        const user = await UserHelper.insertNewRandom();

        const taskPoolExample = createTaskPoolToSend(user);
        const response = await request(app)
            .post('/api/v1/task-pools')
            .set('X-API-TOKEN',user.authToken)
            .send(taskPoolExample);


        expect(response.status).toBe(201);
        expect(response.body.taskPoolId).toBeDefined();

        const fromDb = await TaskPool.findOne({
            where: {id: response.body.taskPoolId}
        });


        expect(fromDb).toBeDefined();
    });

    test('POST /task-pools with valid data 401 with valid tasks', async() => {
        const user = await UserHelper.insertNewRandom();
        const task1 = await TaskHelper.createValidTask(user.id,"come sta lei?");
        const task2 = await TaskHelper.createValidTask(user.id,"come stai?");
        const taskPoolExample = createTaskPoolToSend(user);

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

    });

    test('POST /task-pools with valid data 401 with inexistent tasks', async() => {
        const user = await UserHelper.insertNewRandom();

        const taskPoolExample = createTaskPoolToSend(user);
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

        const taskPool1 = await TaskPoolHelper.insertTaskPoolWith2TasksCreatedBy(giorgio);
        const taskPool2 = await TaskPoolHelper.insertTaskPoolEmpty(giorgio);

        const response = await request(app)
            .get('/api/v1/task-pools')
            .set('X-API-TOKEN',giorgio.authToken);


        expect(response.status).toBe(200);

        const result = response.body;
        var a;
        for(let t of result){
            expect(t.id).toEqual(t.id);
            expect(t.name).toEqual(t.name);
        }

        expect(result.length).toEqual(2);

    });

    test('GET /task-pools with valid data 201 with two tasks', async() => {
        const giorgio = await UserHelper.insertGiorgio();
        const taskPool = await TaskPoolHelper.insertTaskPoolWith2TasksCreatedBy(giorgio);

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

describe('GET /task-pools/id', ()=>{

    test('GET /task-pools/id on a taskPool existent', async() => {
        const giorgio = await UserHelper.insertGiorgio();
        const taskPool = await TaskPoolHelper.insertTaskPoolWith2TasksCreatedBy(giorgio);

        const response = await request(app)
            .get('/api/v1/task-pools/'+taskPool.id)
            .set('X-API-TOKEN',giorgio.authToken);



        expect(response.status).toBe(201);

        const result = response.body;

        expect(result).not.toBe(null);
        expect(result.id).toEqual(taskPool.id);
        expect(result.tasks.length).toEqual((await taskPool.getTasks()).length);
        expect(result.name).toEqual(taskPool.name);

    });

    test('GET /task-pools/id on a taskPool without tasks existent', async() => {
        const giorgio = await UserHelper.insertGiorgio();
        const taskPool = await TaskPoolHelper.insertTaskPoolEmpty(giorgio);

        const response = await request(app)
            .get('/api/v1/task-pools/'+taskPool.id)
            .set('X-API-TOKEN',giorgio.authToken);



        expect(response.status).toBe(201);

        const result = response.body;

        expect(result).not.toBe(null);
        expect(result.id).toEqual(taskPool.id);
        expect(result.name).toEqual(taskPool.name);
    });

    test('GET /task-pools/id that i can\'t manage', async() => {
        const giorgio = await UserHelper.insertGiorgio();
        const mario = await UserHelper.insertMario();
        const taskPool = await TaskPoolHelper.insertTaskPoolEmpty(giorgio);

        const response = await request(app)
            .get('/api/v1/task-pools/'+taskPool.id)
            .set('X-API-TOKEN',mario.authToken);



        expect(response.status).toBe(401);

        const result = response.body;
        expect(result).toEqual({errorMessage: TaskPoolService.errors.YOU_CANT_MANAGE_THIS_TASKPOOL})
    });

    test('GET /task-pools/id which not exist', async() => {
        const giorgio = await UserHelper.insertGiorgio();
        const taskPool = {id: 1414};

        const response = await request(app)
            .get('/api/v1/task-pools/'+taskPool.id)
            .set('X-API-TOKEN',giorgio.authToken);



        expect(response.status).toBe(409);

        const result = response.body;
        expect(result).toEqual({errorMessage: TaskPoolService.errors.TASK_POOL_ID_IS_NO_CORRECT})
    });

});
