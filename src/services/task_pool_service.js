
const {sequelize, TaskPool} = require('../models/index');

var ERROR = "FAIL OF QUERY, the task pool is incorrect"

module.exports = {
    
    async createTaskPool(taskPool){
        try {
            await TaskPool.create(taskPool)
        } catch(e) {
            return ERROR
        }

        //cerco l'utente appena creato
        const jsonArray = await TaskPool.findAll({
            where: {
                id: taskPool.id
            }
        })

        return jsonArray[0]

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