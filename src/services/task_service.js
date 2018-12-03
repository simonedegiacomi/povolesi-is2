const {Task} = require('../../src/models');


module.exports = {

    errors: {
        WRONG_ARGUMENTS: 'wrong arguments'
    },

    async createTask(taskData) {
        if (!taskData) {
            throw new Error(this.errors.WRONG_ARGUMENTS);
        }
        if (typeof taskData.question !== 'string') {
            throw new Error(this.errors.WRONG_ARGUMENTS);
        }

        if (typeof taskData.type !== 'string' || Task.Types.every(t => taskData.type !== t)) {
            throw new Error(this.errors.WRONG_ARGUMENTS);
        }
        if (taskData.type === 'multiple') {
            if (!Array.isArray(taskData.choices) || taskData.choices.length < 2) {
                throw new Error(this.errors.WRONG_ARGUMENTS);
            }
        }

        return await Task.create(taskData);
    }

};