const {TaskPool,User} = require('../models/index');

var existUser = function(u){
    let jsonArray = User.findAll({
        where: {
            id: u.id
        }
    })

    return jsonArray.length
}

module.exports = {

    errors: {
        NO_CREATOR_SPECIFIED: "no creator specified",
        NO_NAME: "task pool have no name",
        USER_NOT_EXIST: "user not exist"
    },

    async createTaskPool(taskPool) {
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

            return createdTaskPool;
        } catch (e){
            console.log(e);
            return null;
        }
    },


    async getMyTaskPool(userMe) {

        if(existUser(userMe))
            throw new Error(this.errors.USER_NOT_EXIST);

        //query SELECT * WHERE user=userMe
        const jsonArray = await TaskPool.findAll({
           where: {
                createdById: userMe.id
           }
        })

        return jsonArray
    }

    async getTaskPool(userMe)

};