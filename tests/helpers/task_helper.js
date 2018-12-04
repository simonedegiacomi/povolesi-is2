const TaskService = require('../../src/services/task_service');

module.exports = {

    async insertOpenQuestionTask() {
        return await TaskService.createTask({
            question        : 'What is the meaning of life?',
            type            : 'open',
            maxLength       : 255,
            canBePeerReviewd: true
        });
    },

    async insertLinkTask() {
        return await TaskService.createTask({
            question        : 'What is the meaning of life?',
            type            : 'link',
            maxLength       : 255,
            canBePeerReviewd: true
        });
    },

    async insertMultipleChoiceTask() {
        return await TaskService.createTask({
            question        : 'What is the meaning of life?',
            type            : 'multiple',
            maxLength       : 255,
            canBePeerReviewd: true,
            choices         : ["Happiness", "Balance", 42]
        });
    }

};