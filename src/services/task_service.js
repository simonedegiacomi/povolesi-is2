const {assertIsNumber, assertIsDefined, assertIsString} = require('./parameters_helper');

const ArgumentError = require('./argument_error');
const {Task} = require('../../src/models');


module.exports = {

    errors: {
        TASK_NOT_FOUND: 'Task not found',
        WRONG_ARGUMENTS: 'Wrong arguments',
        ONLY_THE_CREATOR_CAN_DELETE_A_TASK: 'only the creator can delete a task'
    },

    /**
     *
     * @param taskId
     * @param authenticatedUserId
     * @returns {Promise<Model>}
     */
    async getTask(taskId, authenticatedUserId) {
        assertIsNumber(taskId);
        assertIsNumber(authenticatedUserId);

        let foundTask = await this._getTaskById(taskId);

        // TODO: Check if user can see the task

        return foundTask;
    },

    /**
     * Retrieves the task from the database, regardless of who asked for it
     * @param taskId
     * @returns {Promise<Model>}
     * @private
     */
    async _getTaskById(id) {
        const foundTask = await Task.findOne({
            where: {id}
        });

        if (foundTask === null) {
            throw new Error(this.errors.TASK_NOT_FOUND)
        }

        return foundTask;
    },

    async getTasks(authenticatedUserId) {
        return await Task.findAll({
            where: {userId: authenticatedUserId}
        });
    },

    async deleteTask(taskId, authenticatedUserId) {
        const task = await this._getTaskById(taskId);

        if (task.userId !== authenticatedUserId) {
            throw new ArgumentError(this.errors.ONLY_THE_CREATOR_CAN_DELETE_A_TASK);
        }

        //TODO: the deletion of a task will become extremely messy once we will implement assignment, peer review, etc..
        //We'll have to think about how to manage that situation
        await task.destroy();
    },

    async createTask(taskData) {
        assertIsDefined(taskData);
        assertIsString(taskData.question);
        assertIsNumber(taskData.userId);

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