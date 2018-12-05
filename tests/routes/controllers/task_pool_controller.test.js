const request = require('supertest');

const app = require('../../../src/app');
const UserHelper = require('../../helpers/user_helper');
const TaskHelper = require('../../helpers/task_helper');
const {TaskPool} = require('../../../src/models');

describe('creation of taskPool', () => {

    test('insert taskPool with a task', async () => {
        const creator = await UserHelper.insertMario();
        const task = await TaskHelper.createOpenQuestionTask(creator.id);

        const response = await request(app)
            .post('/api/v1/task-pools')
            .set('X-API-TOKEN', creator.authToken)
            .send({
                "name": "Test task pool",
                "tasks": [task.id]
            });

        expect(response.status).toBe(201);
        expect(response.body.taskPoolId).toBeDefined();

        const fromDb = await TaskPool.findOne({
            where: {id: response.body.taskPoolId}
        });
        expect(fromDb).toBeDefined();

        const tasks = await fromDb.getTasks();
        expect(tasks.length).toBe(1);
        expect(tasks[0].id).toBe(task.id);
    });

});
