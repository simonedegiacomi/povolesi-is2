const Joi = require('joi');
const SchemaUtils = require('../utils/schema_utils');
const {TaskAnswer, AssignedTask} = require('../models');

const taskAnswerSchema = Joi.object().keys({
    userId: Joi.number().integer().required(),
    taskId: Joi.number().integer().required(),
    assignmentId: Joi.number().integer().required(),
    answer: Joi.string().required()
});

module.exports = {

    errors: {
        ASSIGNED_TASK_NOT_FOUND: 'assigned task not found',
        EMPTY_ANSWER: '\"answer\" is not allowed to be empty'
    },

    async createTaskAnswer(taskAnswerData) {
        SchemaUtils.validateSchemaOrThrowArgumentError(taskAnswerData, taskAnswerSchema);

        const isTaskAssignedToUser = await this.isTaskAssignedToUser(
            taskAnswerData.taskId,
            taskAnswerData.assignmentId,
            taskAnswerData.userId
        );
        if (!isTaskAssignedToUser) {
            throw new Error(this.errors.ASSIGNED_TASK_NOT_FOUND);
        }

        return await TaskAnswer.create(taskAnswerData);
    },

    async isTaskAssignedToUser(taskId, assignmentId, userId) {
        const assignedTask = await AssignedTask.findOne({
            where: {
                taskId,
                assignmentId,
                userId
            }
        });
        return assignedTask != null;
    }

};