const TaskPoolService = require('../../src/services/task_pool_service');
const UserHelper      = require('../helpers/user_helper');


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
