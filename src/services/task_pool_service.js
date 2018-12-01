
const {sequelize, TaskPool} = require('../models/index');

module.exports = {
    
    async createTaskPool(taskPool){
        await TaskPool.create(taskPool)
    },

    async getAllTaskPool() {
        return TaskPool.findAll({})
    },

    //ritorna un array di task
    getTaskPool: async function (userMe) {
        createTaskPool({
            name
        })

        //query SELECT * WHERE user=userMe
        return TaskPool.findAll({
            where: {
                createdBy: userMe
            }
        })
    }
};