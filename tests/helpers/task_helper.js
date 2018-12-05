const TaskService = require('../../src/services/task_service');
const {Task}      = require('../../src/models');

module.exports = {

    async createValidTaskWithQuestion(userId, question) {
        return await TaskService.createTask({
            question        : question,
            type            : 'open',
            maxLength       : 255,
            canBePeerReviewed: true,
            userId          : userId
        });
    },

    async createValidTask(userId) {
        return this.createOpenQuestionTask(userId);
    },

    async createOpenQuestionTask(userId) {
        return await TaskService.createTask({
            question        : 'What is the meaning of life?',
            type            : 'open',
            maxLength       : 255,
            canBePeerReviewed: true,
            userId          : userId
        });
    },

    async createLinkTask(userId) {
        return await TaskService.createTask({
            question        : 'What is the meaning of life?',
            type            : 'link',
            maxLength       : 255,
            canBePeerReviewed: true,
            userId          : userId
        });
    },

    async createMultipleChoiceTask(userId) {
        return await TaskService.createTask({
            question        : 'What is the meaning of life?',
            type            : 'multiple',
            maxLength       : 255,
            canBePeerReviewed: true,
            choices         : ["Happiness", "Balance", 42],
            userId          : userId
        });
    },

    async findTaskInDb(taskId) {
        return await Task.findOne({
            where: {id: taskId}
        });
    },

    async expectTaskToExistInDb(taskId) {
        let taskInDb = await this.findTaskInDb(taskId);
        expect(taskInDb).not.toBe(null);
    },

    async expectTaskToNotExistInDb(taskId) {
        let taskInDb = await this.findTaskInDb(taskId);
        expect(taskInDb).toBe(null);
    }

};