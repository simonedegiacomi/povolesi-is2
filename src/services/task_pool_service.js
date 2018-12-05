const {TaskPool, User, Task} = require('../models/index');

var isTaskExist = async function(task){

    const fromDb = await Task.findOne({
        where:
            {id: task.id}
    })

    return fromDb !== null
}

var isTasksExist = async function(tasks){

    for(let t of tasks) {

        if (!(await isTaskExist(t)))
            return false
    }

    return true
}


module.exports = {

    errors: {
        NO_CREATOR_SPECIFIED: "no creator specified",

        NO_NAME             : "task pool have no name",
        USER_NOT_EXIST      : "user not exist",
        TASK_NOT_EXIST      : "tasks not exist"
    },

    async createTaskPool(taskPool, tasks = []) {

        if (taskPool.name == null) {
            throw new Error(this.errors.NO_NAME);
        }
        else if (taskPool.createdBy == null) {
            throw new Error(this.errors.NO_CREATOR_SPECIFIED);
        }else if (! (await isTasksExist(tasks))){
            throw new Error(this.errors.TASK_NOT_EXIST);
        }

        try {
            const createdTaskPool = await TaskPool.create({
                ...taskPool,
                createdById: taskPool.createdBy.id
            });
            createdTaskPool.createdBy = taskPool.createdBy;

            //aggiungo i task al taskPool creato
            await createdTaskPool.setTasks(tasks);

            return createdTaskPool;

        } catch (e) {
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


};