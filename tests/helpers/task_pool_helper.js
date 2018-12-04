const TaskPoolService = require('../../src/services/task_pool_service');
const TaskHelper = require('./task_helper');

module.exports = {

    async createSimplePool(createdBy) {
        const task = await TaskHelper.insertOpenQuestionTask();
        return await = TaskPoolService.createTaskPool({
            name: 'simple',
            createdBy
        }, [task]);
    }
};