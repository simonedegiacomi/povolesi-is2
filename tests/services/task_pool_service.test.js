const TaskPoolService = require('../../src/services/task_pool_service');
const TaskHelper      = require('../helpers/task_helper');
const UserHelper      = require('../helpers/user_helper');
const TaskPoolHelper      = require('../helpers/task_pool_helper');

async function insertArrayTaskPool(taskPools) {

    for (const pool of taskPools) {
        await TaskPoolService.createTaskPool(pool);

    }
}


describe('creation of taskPool', () => {

    test('insert taskPool', async () => {
        const creator = await UserHelper.insertMario();
        const taskPoolExample = {
            name: 'esempio',
            createdBy: creator,
            numQuestionsToDraw: 0
        };

        const createdPool = await TaskPoolService.createTaskPool(taskPoolExample);

        expect(createdPool.name).toEqual(taskPoolExample.name);
        expect(createdPool.createdBy.toJSON()).toEqual(creator.toJSON());
    });

    test('insert taskPool with a task', async () => {

        const creator = await UserHelper.insertMario();

        const taskPoolExample = {
            name: 'esempio',
            createdBy: creator,
            numQuestionsToDraw: 0
        };
        const task = await TaskHelper.createOpenQuestionTask(creator.id);


        const createdPool = await TaskPoolService.createTaskPool(taskPoolExample, [task]);

        expect(createdPool.name).toEqual(taskPoolExample.name);
        expect(createdPool.createdBy.toJSON()).toEqual(creator.toJSON());

        const tasksFromPool = await createdPool.getTasks();
        expect(tasksFromPool[0].id).toEqual(task.id);
    });

    test('insert taskPool without specifying the user', async () => {
        const taskPool = {
            name: 'esempio',
            numQuestionsToDraw: 0
        };

        try {
            await TaskPoolService.createTaskPool(taskPool);
        } catch (e) {
            expect(e.message).toBe(TaskPoolService.errors.NO_CREATOR_SPECIFIED);
        }
    });

    test('insert taskPool without specifying the name', async () => {
        const noTaskPool = {};

        try {
            await TaskPoolService.createTaskPool(noTaskPool);
        } catch (e) {
            expect(e.message).toBe(TaskPoolService.errors.NO_NAME);
        }
    });


});

describe('get my taskPool', () => {

    test('get my taskPools that are two', async () => {
        const mario   = await UserHelper.insertMario();
        const giorgio = await UserHelper.insertGiorgio();

        const taskPool1 = {
            name: 'esempio1',
            createdBy: giorgio,
            numQuestionsToDraw: 0
        };
        const taskPool2 = {
            name: 'esempio2',
            createdBy: giorgio,
            numQuestionsToDraw: 0
        };
        const taskPool3 = {
            name: 'esempio3',
            createdBy: mario,
            numQuestionsToDraw: 0
        };

        let array = [taskPool1, taskPool2, taskPool3];
        await insertArrayTaskPool(array);

        const result = await TaskPoolService.getMyTaskPool(giorgio);

        // control for any element of array that the creator is giorgio
        for(let t of result){
            //TODO: mettere il tojson
            //expect(t.toJSON().createdById).toEqual(giorgio.id)
            expect(t.dataValues.createdById).toEqual(giorgio.id)
        }

    });

    test('get my task pool of user that no have taskPool',async () => {
        const mario = await UserHelper.insertMario();

        const result = await TaskPoolService.getMyTaskPool(mario);

        expect(result instanceof Array).toEqual(true);
        expect(result.length).toEqual(0);

    });

    test('get taskPools of user that no exist', async () => {
        const giorgio = {name: 'giorgio'};

        try {
            await TaskPoolService.getMyTaskPool(giorgio);
            expect().toFail();
        } catch (e) {
            expect(e.message).toEqual(TaskPoolService.errors.USER_NOT_EXIST)
        }
    });

    test('get a taskPool with some task inside', async () => {
        const giorgio = await UserHelper.insertGiorgio();
        //insert a taskPool with two tasks in db
        const taskPool = await TaskPoolHelper.insertTaskPoolWith2TasksCreatedBy(giorgio);

        expect(taskPool).toBeDefinedAndNotNull();
        expect( (await taskPool.getTasks()).length ).toEqual(2);

    });

});
