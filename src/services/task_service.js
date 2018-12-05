const ArrayHelper = require('../utils/array_utils');
const {assertIsNumber, assertIsDefined, assertIsString} = require('./parameters_helper');

const {Task} = require('../../src/models');


module.exports = {

    errors: {
        TASK_NOT_FOUND: 'task not found',
        WRONG_ARGUMENTS: 'wrong arguments'
    },

    async getTask(taskId, authenticatedUserId) {
        assertIsNumber(taskId, this.errors.WRONG_ARGUMENTS);
        assertIsNumber(authenticatedUserId, this.errors.WRONG_ARGUMENTS);

        //TODO: implement other users' tasks searches once the task draws are finished
        let foundTask = await Task.findOne({
            where: {
                userId: authenticatedUserId,
                id: taskId
            }
        });

        if (ArrayHelper.isObjectEmpty(foundTask)) {
            throw new Error(this.errors.TASK_NOT_FOUND)
        } else {
            return foundTask;
        }
    },

    async getTasks(authenticatedUserId) {
        return await Task.findAll({
            where: {userId: authenticatedUserId}
        });
    },

    async deleteTask(taskId, authenticatedUserId) {
        let taskWithId = await this.getTask(taskId, authenticatedUserId);

        //No need to check whenever the user can delete tasks. It's always possible for a user that can retrieve a task
        //to delete it

        //TODO: the deletion of a task will become extremely messy once we will implement assignment, peer review, etc..
        //We'll have to think about how to manage that situation
        await taskWithId.destroy();
    },

    async createTask(taskData) {
        assertIsDefined(taskData, this.errors.WRONG_ARGUMENTS);
        assertIsString(taskData.question, this.errors.WRONG_ARGUMENTS);
        assertIsNumber(taskData.userId, this.errors.WRONG_ARGUMENTS);

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