const {TaskPool,User,Task} = require('../models/index');

var notExistUser = function(u){
    let jsonArray = User.findAll({
        where: {
            id: u.id
        }
    })

    return jsonArray.length
}

var notExistTask = function(t){
    let jsonArray = Task.findAll({
        where: {
            id: t.id
        }
    })

    return jsonArray.length
}

var addTaskToTaskPool = async function (tasks,taskPool){

    tasks.forEach( (t) => {
        if(notExistTask(t))
            throw new Error(this.errors.TASK_NOT_EXIST);
    })

    try {
        await taskPool.setTasks(tasks)
    } catch (e){
        console.log("non riuscito a inserire i task nel taskPool")
        console.log(e);
        return null;
    }

}



module.exports = {

    errors: {
        NO_CREATOR_SPECIFIED: "no creator specified",
        NO_NAME: "task pool have no name",
        USER_NOT_EXIST: "user not exist",
        TASK_NOT_EXIST: "task not exist"
    },

    async addTaskPool(taskPool,tasks) {
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
            await addTaskToTaskPool(tasks,createdTaskPool)

            return createdTaskPool;

        } catch (e){
            console.log(e);
            return null;
        }
    },


    async getMyTaskPool(userMe) {

        if(notExistUser(userMe))
            throw new Error(this.errors.USER_NOT_EXIST);

        //query SELECT * WHERE user=userMe
        const jsonArray = await TaskPool.findAll({
           where: {
                createdById: userMe.id
           }
        })

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

    },*/

};