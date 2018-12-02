const {TaskPool} = require('../models/index');


module.exports = {

    errors: {
        NO_CREATOR_SPECIFIED: "no creator specified"
    },

    async createTaskPool(taskPool) {
        if (taskPool.createdBy == null) {
            throw new Error(this.errors.NO_CREATOR_SPECIFIED);
        }

        try {
            const createdTaskPool     = await TaskPool.create({
                ...taskPool,
                createdById: taskPool.createdBy.id
            });
            createdTaskPool.createdBy = taskPool.createdBy;

            return createdTaskPool;
        } catch (e){
            console.log(e);
            return null;
        }
    },


    async getMyTaskPool(userMe) {

        //query SELECT * WHERE user=userMe
        const jsonArray = await TaskPool.findAll({
            where: {
                createdById: userMe.id
            }
        })

        return jsonArray
    }

};