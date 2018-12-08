const {TaskPool, User, Task, Group, UserPermission, TaskDraw, Assignment} = require('../models/index');
const TaskPoolService = require('../services/task_pool_service');

module.exports={

    async isTaskExist(task){

        const fromDb = await Task.findOne({
            where:
                {id: task.id}
        });

        return fromDb !== null;
    },

    async isTasksExist(tasks) {

        for (let t of tasks) {

            if (!(await this.isTaskExist(t)))
                return false;
        }

        return true;
    },

    async isUserExist(user) {
        const fromDb = await User.findOne({
            where:
                {id: user.id}
        });

        return fromDb !== null;
    },

    async isTaskPoolIdExist(taskPoolId){
        const fromDb = await TaskPool.findOne({
            where:
                {id: taskPoolId}
        });

        return fromDb !== null;

    },

    async getUserById(userId){
        const fromDb = await User.findOne({
            where:
                {id: userId}
        });
        if(fromDb === null)
            throw new Error('user not exist');
            //FIXME: i don't know why but that no work
            //throw new Error(TaskPoolService.errors.NO_CREATOR_SPECIFIED);
        else
            return fromDb.toJSON();

    },

    async getTaskPoolByIdWithoutControl(taskPoolId){
        const fromDb = await TaskPool.findOne({
            where:
                {id: taskPoolId}
        });

        return fromDb;
    },



};