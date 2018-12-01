const {TaskPool} = require('../models/index');


module.exports = {

    errors: {
        NO_CREATOR_SPECIFIED: "no creator specified"
    },

    async createTaskPool(taskPool) {
        if (taskPool.createdBy == null) {
            throw new Error(this.errors.NO_CREATOR_SPECIFIED);
        }

        const createdTaskPool = await TaskPool.create({
            ...taskPool,
            createdById: taskPool.createdBy.id
        });
        createdTaskPool.createdBy = taskPool.createdBy;
        return createdTaskPool;
    },


    //TODO: da fare
    /*
    async getAllTaskPool() {
        return TaskPool.findAll({})
    },

    //ritorna un array di task
    getMyTaskPool: async function (userMe) {

        //query SELECT * WHERE user=userMe
        return await TaskPool.findAll({})
    }
    */
};