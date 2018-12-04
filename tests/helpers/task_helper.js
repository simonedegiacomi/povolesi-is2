const TaskService = require('../../src/services/task_service');

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
    }

};