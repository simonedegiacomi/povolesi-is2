const {TaskPool, User, Task} = require('../models/index');


module.exports = {

    errors: {
        NO_CREATOR_SPECIFIED: "no creator specified",

        NO_NAME             : "task pool have no name",
        USER_NOT_EXIST      : "user not exist",
        TASK_NOT_EXIST      : "task not exist"
    },

    async createTaskPool(taskPool, tasks = []) {

        if (taskPool.name == null) {
            throw new Error(this.errors.NO_NAME);
        }
        else if (taskPool.createdBy == null) {
            throw new Error(this.errors.NO_CREATOR_SPECIFIED);
        }

        try {
            const createdTaskPool     = await TaskPool.create({
                ...taskPool,
                createdById: taskPool.createdBy.id
            });
            createdTaskPool.createdBy = taskPool.createdBy;

            //aggiungo i task al taskPool creato
            await createdTaskPool.setTasks(tasks);

            return createdTaskPool;

        } catch (e) {
            console.log(e);
            throw e;
        }
    },


    async getMyTaskPool(userMe) {
        if(!(userMe instanceof User)){ // TODO: Check in the db
            throw new Error(this.errors.USER_NOT_EXIST);
        }

        //query SELECT * WHERE user=userMe
        const jsonArray = await TaskPool.findAll({
           where: {
                createdById: userMe.id
            }
        });

        return jsonArray
    },

    /*
    async getTasksOf(taskPool){

        const jsonResult = Task.findAll({
            where: {
                TaskPool_Task: taskPool.id
            }
        })

        return jsonResult

*/

};