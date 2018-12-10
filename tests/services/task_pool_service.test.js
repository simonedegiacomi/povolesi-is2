const TaskPoolService = require('../../src/services/task_pool_service');
const TaskHelper = require('../helpers/task_helper');
const UserHelper = require('../helpers/user_helper');
const TaskPoolHelper = require('../helpers/task_pool_helper');


describe("Test utils methods of TaskPoolService", () => {

    test("The creator of a TaskPool can edit it", async () => {
        const giorgio = await UserHelper.insertGiorgio();
        const taskPool = await TaskPoolHelper.insertTaskPoolWith2TasksCreatedBy(giorgio.id);

        const giorgioCanEdit = await TaskPoolService.canUserManageTaskPoolById(taskPool.id, giorgio.id);

        expect(giorgioCanEdit).toEqual(true);
    });

    test("Someone who didn't create a TaskPool and which is not in any userGroup can't edit it", async () => {
        const mario = await UserHelper.insertMario();
        const taskPool = await TaskPoolHelper.insertTaskPoolWith2Tasks();

        const marioCanEdit = await TaskPoolService.canUserManageTaskPoolById(taskPool.id, mario.id);
        expect(marioCanEdit).toEqual(false);
    });
});


describe('Test the creation of a TaskPool', () => {

    test('insert valid TaskPool', async () => {
        const creator = await UserHelper.insertMario();
        const createdPool = await TaskPoolHelper.insertTaskPoolWith2TasksCreatedBy(creator.id);

        expect(createdPool.name).toEqual('esempio');
        expect(createdPool.createdById).toEqual(creator.id);
    });

    test('insert a TaskPool with a two task', async () => {
        const creator = await UserHelper.insertMario();
        const task = await TaskHelper.createOpenQuestionTask(creator.id);
        const createdPool = await TaskPoolHelper.insertTaskPoolWith2TasksCreatedBy(creator.id);

        expect(createdPool.name).toEqual('esempio');
        expect(createdPool.createdById).toEqual(creator.id);

        const tasksFromPool = await createdPool.getTasks();
        expect(tasksFromPool.length).toEqual(2);
    });

    test('insert a TaskPool without specifying the user', async () => {
        const taskPoolData = {
            name: 'esempio',
            numQuestionsToDraw: 0
        };
        await expect(TaskPoolService.createTaskPool(taskPoolData))
            .rejects.toThrow(new Error('"createdById" is required'));
    });

    test('insert taskPool without specifying the name', async () => {
        const noTaskPool = {
            createdById: (await UserHelper.insertNewRandom()).id,
            numQuestionsToDraw: 0
        };

        await expect(TaskPoolService.createTaskPool(noTaskPool))
            .rejects.toThrow(new Error('"name" is required'));
    });


});

describe('Get a list of the user TaskPools', () => {

    test('Get list with the Task pool that the user created', async () => {
        const mario = await UserHelper.insertMario();
        const giorgio = await UserHelper.insertGiorgio();

        const giorgioTaskPool = await TaskPoolHelper.insertTaskPoolEmpty(giorgio.id);
        await TaskPoolHelper.insertTaskPoolEmpty(mario.id);

        const pools = await TaskPoolService.getTaskPoolsByUserId(giorgio.id);

        expect(pools).toBeDefinedAndNotNull();
        expect(pools.length).toBe(1);
        expect(pools[0].id).toBe(giorgioTaskPool.id);
        expect(pools[0].createdById).toBe(giorgio.id);
    });

    test('Get list with the Task pool that the user created with two tasks inside', async () => {
        const giorgio = await UserHelper.insertGiorgio();
        const createdPool = await TaskPoolHelper.insertTaskPoolWith2TasksCreatedBy(giorgio.id);
        const createdTasks = await createdPool.getTasks();

        const pools = await TaskPoolService.getTaskPoolsByUserId(giorgio.id);
        const pool = pools[0];
        const tasks = await pool.getTasks();

        expect(tasks).toBeDefinedAndNotNull();
        expect(tasks.length).toBe(createdTasks.length);
        expect(tasks[0].id).toBe(createdTasks[0].id);
        expect(tasks[1].id).toBe(createdTasks[1].id);
    });

    test('Get empty list if the user didn\'t create a pool', async () => {
        const mario = await UserHelper.insertMario();
        const result = await TaskPoolService.getTaskPoolsByUserId(mario.id);

        expect(result).toBeDefinedAndNotNull();
        expect(result.length).toEqual(0);
    });

    test('Get taskPools of user that don\'t exist', async () => {
        const taskPools = await TaskPoolService.getTaskPoolsByUserId(123);

        expect(taskPools).toBeDefinedAndNotNull();
        expect(taskPools.length).toBe(0);
    });

});

describe('get task pool by id with control', () => {
    test('get task pool with two tasks', async () => {
        const giorgio = await UserHelper.insertGiorgio();
        const taskPool = await TaskPoolHelper.insertTaskPoolWith2TasksCreatedBy(giorgio.id);

        const taskPoolResult = await TaskPoolService.getTaskPoolById(taskPool.id, giorgio.id);


        expect(taskPool.id).toEqual(taskPoolResult.id);
        expect(taskPool.name).toEqual(taskPoolResult.name);

        expect((await taskPool.getTasks()).length).toEqual((await taskPoolResult.getTasks()).length);
    });

    test('get task pool with no tasks', async () => {
        const giorgio = await UserHelper.insertGiorgio();
        const taskPool = await TaskPoolHelper.insertTaskPoolEmpty(giorgio.id);

        const taskPoolResult = await TaskPoolService.getTaskPoolById(taskPool.id, giorgio.id);

        expect(taskPool.id).toEqual(taskPoolResult.id);
        expect(taskPool.name).toEqual(taskPoolResult.name);
    });

    test('get task pool that i can\'t manage', async () => {
        const giorgio = await UserHelper.insertGiorgio();
        const mario = await UserHelper.insertMario();
        const taskPool = await TaskPoolHelper.insertTaskPoolWith2TasksCreatedBy(giorgio.id);

        await expect(TaskPoolService.getTaskPoolById(taskPool.id, mario.id))
            .rejects.toThrow(new Error(TaskPoolService.errors.USER_CANT_MANAGE_TASK_POOL));
    });

    test('get task pool with users that no exist', async () => {
        const giorgio = await UserHelper.insertGiorgio();
        const taskPool = await TaskPoolHelper.insertTaskPoolWith2TasksCreatedBy(giorgio.id);

        await expect(TaskPoolService.getTaskPoolById(taskPool.id, 123))
            .rejects.toThrow(new Error(TaskPoolService.errors.USER_CANT_MANAGE_TASK_POOL));
    });
});
