const request = require('supertest')

const app = require('../../../src/app');
const UserHelper  = require('../../helpers/user_helper');
const {TaskPool}      = require('../../../src/models');


var createTaskPoolToSend = function(user){
    const taskPoolExample = {
        name     : 'esempio',
        createdBy: user
    };

    return taskPoolExample
}


describe('Test for creation of new task pool', () => {

    test('POST /task-pools with valid data 201 with no tasks', async() => {
        const user = await UserHelper.insertNewRandom();

        const taskPoolExample = createTaskPoolToSend(user)
        const response = await request(app)
            .post('/api/v1/task-pools')
            .set('X-API-TOKEN',user.authToken)
            .send(taskPoolExample)

        expect(response.status).toBe(201);
        expect(response.body.taskPoolId).toBeDefined();

        const fromDb = await TaskPool.findOne({
            where: {id: response.body.taskPoolId}
        });


        expect(fromDb).toBeDefined();
    });

    test('POST /task-pools with valid data 401 with inexistent tasks', async() => {
        const user = await UserHelper.insertNewRandom();

        const taskPoolExample = createTaskPoolToSend(user)
        const response = await request(app)
            .post('/api/v1/task-pools')
            .set('X-API-TOKEN',user.authToken)
            .send({
                ...taskPoolExample,
                tasks : [12,60,32]
            })

        expect(response.status).toBe(401);
        expect(response.body.message).toEqual("tasks not exist")

        const fromDb = await TaskPool.findOne({
            where: {id: response.body.taskPoolId}
        });

    });
});
