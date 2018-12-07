const TaskPoolService = require('../../src/services/task_pool_service');
const TaskHelper = require('../helpers/task_helper');
const UserHelper = require('../helpers/user_helper');


module.exports = {

    async insertTaskPoolWith2TasksCreatedBy(user) {

        //insert things in db
        const task1 = await TaskHelper.createValidTask(user.id, "come sta lei?");
        const task2 = await TaskHelper.createValidTask(user.id, "come stai?");

        const taskPool = {
            name: 'esempio',
            createdBy: user
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
            createdBy: user
        };

        return await TaskPoolService.createTaskPool(taskPool);

    },

};
