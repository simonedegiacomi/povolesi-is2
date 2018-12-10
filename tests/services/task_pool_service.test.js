const TaskPoolService = require('../../src/services/task_pool_service');
const TaskHelper      = require('../helpers/task_helper');
const UserHelper      = require('../helpers/user_helper');
const TaskPoolHelper  = require('../helpers/task_pool_helper');

describe('creation of taskPool', () => {

    test('insert taskPool', async () => {
        const createdPool = await TaskPoolService.createTaskPool({
            name: 'esempio',
            createdBy: await UserHelper.insertMario(),
            numQuestionsToDraw: 0
        });

        await TaskPoolHelper.expectToExistInDb(createdPool.id);
    });

    test('insert taskPool with a task', async () => {
        const creator = await UserHelper.insertMario();

        const taskPool = {
            name: 'esempio',
            createdBy: creator,
            numQuestionsToDraw: 0
        };
        const task = await TaskHelper.createOpenQuestionTask(creator.id);
        let insertedId = await TaskPoolService.createTaskPool(taskPool, [task]);


        let poolFromDb = await TaskPoolHelper.findById(insertedId.id);
        expect(poolFromDb.name).toEqual(taskPool.name);
        expect(poolFromDb.createdById).toEqual(creator.id);

        const tasksFromDb = await poolFromDb.getTasks();
        expect(tasksFromDb[0].id).toEqual(task.id);
    });

    test('insert taskPool without specifying the user', async () => {
        try {
            await TaskPoolService.createTaskPool({
                name: 'esempio',
                numQuestionsToDraw: 0
            });
        } catch (e) {
            expect(e.message).toBe(TaskPoolService.errors.NO_CREATOR_SPECIFIED);
        }
    });

    test('insert taskPool without specifying the name', async () => {
        try {
            await TaskPoolService.createTaskPool({});
        } catch (e) {
            expect(e.message).toBe(TaskPoolService.errors.NO_NAME);
        }
    });


});

describe('get my taskPool', () => {

    test('should be able to recognize users\' task pools', async () => {
        const mario   = await UserHelper.insertMario();
        const giorgio = await UserHelper.insertGiorgio();

        const taskPool1 = { name: 'esempio1', createdBy: giorgio, numQuestionsToDraw: 0 };
        const taskPool2 = { name: 'esempio2', createdBy: giorgio, numQuestionsToDraw: 0 };
        const taskPool3 = { name: 'esempio3', createdBy: mario,   numQuestionsToDraw: 0 };

        for (const pool of [taskPool1, taskPool2, taskPool3]) {
            await TaskPoolService.createTaskPool(pool);
        }

        const giorgioTaskPools = await TaskPoolService.getAllTaskPoolsOfUser(giorgio.id);
        expect(giorgioTaskPools.length).toBe(2);
        expect(giorgioTaskPools.every(pool => pool.createdById === giorgio.id)).toBe(true);
    });

    test('get my task pool of user that no have taskPool',async () => {
        const mario  = await UserHelper.insertMario();
        const result = await TaskPoolService.getAllTaskPoolsOfUser(mario.id);

        expect(result).toEqual([]);
    });

    test('get taskPools of user that no exist', async () => {
        try {
            await TaskPoolService.getAllTaskPoolsOfUser(12345);
            expect().toFail();
        } catch (e) {
            expect(e.message).toEqual(TaskPoolService.errors.USER_NOT_EXIST)
        }
    });

    test('get a taskPool with some task inside', async () => {
        const inserted   = await TaskPoolHelper.insertTaskPoolWith2TasksCreatedBy(await UserHelper.insertGiorgio());

        let fromDb = await TaskPoolHelper.findById(inserted.id);

        expect(fromDb).toBeDefinedAndNotNull();
        expect((await fromDb.getTasks()).length).toEqual(2);
    });

});
