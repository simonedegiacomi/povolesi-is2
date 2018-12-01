
const {sequelize, TaskPool} = require('../models/index');

module.exports = {
    
    async createTaskPool(taskPool){
        TaskPool.create(taskPool)
    },

    async insertTaskInTaskPool(task,taskPool){
        taskPool
    },

    async getAllTaskPool() {
        return TaskPool.findAll({})
    },

    //ritorna un array di task
    getTaskPool: async function (userMe) {
        //query SELECT * WHERE user=userMe
        return TaskPool.findAll({
            where: {
                createdBy: userMe
            }
        })
    }
};