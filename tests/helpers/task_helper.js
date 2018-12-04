const TaskService = require('../../src/services/task_service');

module.exports = {

    async createOpenQuestionTask() {
        return await TaskService.createTask({
            question        : 'What is the meaning of life?',
            type            : 'open',
            maxLength       : 255,
            canBePeerReviewd: true
        });
    },

    async createLinkTask() {
        return await TaskService.createTask({
            question        : 'What is the meaning of life?',
            type            : 'link',
            maxLength       : 255,
            canBePeerReviewd: true
        });
    },

    async createMultipleChoiceTask() {
        return await TaskService.createTask({
            question        : 'What is the meaning of life?',
            type            : 'multiple',
            maxLength       : 255,
            canBePeerReviewd: true,
            choices         : ["Happiness", "Balance", 42]
        });
    }

};