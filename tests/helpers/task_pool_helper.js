const TaskPoolService = require('../../src/services/task_pool_service');
const TaskHelper = require('../helpers/task_helper');
const UserHelper = require('../helpers/user_helper');


module.exports = {

    async insertTaskPoolWith2TasksCreatedBy(userId) {

        //insert things in db
        const task1 = await TaskHelper.createValidTask(userId, "come sta lei?");
        const task2 = await TaskHelper.createValidTask(userId, "come stai?");

        const taskPool = {
            name: 'esempio',
            createdById: userId,
            numQuestionsToDraw: 1,
            tasks: [
                task1.id,
                task2.id
            ]
        };

        return await TaskPoolService.createTaskPool(taskPool);
    },

    async insertTaskPoolWith2Tasks() {
        const user = await UserHelper.insertNewRandom();
        return await this.insertTaskPoolWith2TasksCreatedBy(user.id);
    },

    async insertTaskPoolEmpty(userId) {
        const taskPool = {
            name: 'esempio',
            createdById: userId,
            numQuestionsToDraw: 0,
            tasks: []
        };

        return await TaskPoolService.createTaskPool(taskPool);

    },

};
