const Joi = require('joi');
const SchemaUtils = require('../utils/schema_utils');
const {TaskAnswer, AssignedTask} = require('../models');
const UserService = require('./user_service');
const AssignmentService = require('./assignment_service');

const taskAnswerSchema = Joi.object().keys({
    userId: Joi.number().integer().required(),
    taskId: Joi.number().integer().required(),
    assignmentId: Joi.number().integer().required(),
    answer: Joi.string().required()
});

module.exports = {

    errors: {
        ASSIGNED_TASK_NOT_FOUND: 'assigned task not found',
        EMPTY_ANSWER: '\"answer\" is not allowed to be empty',
        USER_NOT_FOUND: 'user not found',
        ASSIGNMENT_NOT_FOUND: 'assignment not found',
        TASK_ANSWER_NOT_FOUND: 'task answer not found'
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
    },

    async getTaskAnswerByUserAndAssignment(userId, assignmentId) {
        const taskAnswers = await TaskAnswer.findAll({
            where: {
                userId,
                assignmentId
            }, attributes: [
                'answer',
                'assignmentId',
                'id',
                'submittedOn',
                'taskId',
                'userId'
            ]
        });
        if (!taskAnswers.length || taskAnswers == null) {
            await UserService.getUserById(userId);
            await AssignmentService.getAssignmentById(assignmentId);
        }
        return taskAnswers;
    },

    async getTaskAnswerById(taskAnswerId) {
        const taskAnswer = await TaskAnswer.findOne({
            where: {
                id: taskAnswerId
            }, attributes: [
                'answer',
                'assignmentId',
                'id',
                'submittedOn',
                'taskId',
                'userId'
            ]
        });

        if (taskAnswer == null) {
            throw new Error(this.errors.TASK_ANSWER_NOT_FOUND);
        }

        return taskAnswer;
    }

};