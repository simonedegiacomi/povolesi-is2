const TaskPoolService = require('../../src/services/task_pool_service');
const UserHelper      = require('../helpers/user_helper');

function insertArrayTaskPool(taskPools){
    taskPools.forEach( async (t) =>
        await TaskPoolService.createTaskPool(t) )

}


describe('creation of taskPool', () => {

    test('insert taskPool', async () => {
        const creator         = await UserHelper.insertMario();
        const taskPoolExample = {
            name     : 'esempio',
            createdBy: creator
        };

        const createdPool = await TaskPoolService.createTaskPool(taskPoolExample);

        expect(createdPool.name).toEqual(taskPoolExample.name);
        expect(createdPool.createdBy.toJSON()).toEqual(creator.toJSON());
    });

    test('insert taskPool without specifying the user', async () => {
        const taskPool = {
            name: 'esempio',
        };

        try {
            await TaskPoolService.createTaskPool(taskPool);
        } catch (e) {
            expect(e.message).toBe(TaskPoolService.errors.NO_CREATOR_SPECIFIED);
        }
    });
});

describe('get task of my taskPool', () => {
    test('insert taskPool', async () => {
        const mario = await UserHelper.insertMario();
        const giorgio = await UserHelper.insertGiorgio();

        const taskPool1 = {
            name     : 'esempio1',
            createdBy: giorgio
        }

        const taskPool2 = {
            name     : 'esempio2',
            createdBy: giorgio
        }

        const taskPool3 = {
            name     : 'esempio3',
            createdBy: mario
        }

        var array = [taskPool1, taskPool2, taskPool3]
        insertArrayTaskPool(array)

        const result = await TaskPoolService.getMyTaskPool(giorgio)

        // control for any element of array that the creator is giorgio
        result.forEach( (t) =>
            expect(t.createdById).toEqual(giorgio.id) )
    });
});