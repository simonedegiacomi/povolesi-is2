const TaskPoolService = require('../../src/services/task_pool_service');
const TaskHelper = require('../helpers/task_helper');
const UserHelper = require('../helpers/user_helper');
const {TaskPool} = require('../../src/models');

module.exports = {

    async insertTaskPoolWith2TasksCreatedBy(user) {

        //insert things in db
        const task1 = await TaskHelper.createValidTask(user.id, "come sta lei?");
        const task2 = await TaskHelper.createValidTask(user.id, "come stai?");

        const taskPool = {
            name: 'esempio',
            createdBy: user,
            numQuestionsToDraw: 1
        };

        return await TaskPoolService.createTaskPool(taskPool, [task1, task2]);
    },

    async insertTaskPoolWith2Tasks() {
        const user = await UserHelper.insertNewRandom();
        return await this.insertTaskPoolWith2TasksCreatedBy(user);
    },

    async insertTaskPoolEmpty(user) {
        const taskPool = {
            name: 'esempio',
            createdBy: user,
            numQuestionsToDraw: 0
        };

        return await TaskPoolService.createTaskPool(taskPool);
    },

    async findById (poolId) {
        return await TaskPool.findOne({
            where: {id: poolId}
        });
    },

    async expectToExistInDb(poolId) {
        expect(await this.findById(poolId)).toBeDefinedAndNotNull();
    }

};
