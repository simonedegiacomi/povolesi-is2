const {Task} = require('../models/index');



module.exports = {

    errors: {},

    async createTask(task){
        const createdTask = await Task.create(task);

        return createdTask
    }

};