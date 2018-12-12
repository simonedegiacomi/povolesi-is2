const {TaskAnswer} = require('../../src/models');

const AssignmentHelper = require('../helpers/assignment_helper');
const TaskAnswerService = require('../../src/services/task_answer_service');

module.exports = {
    async findTaskAnswerById(id) {
        return await TaskAnswerService.getTaskAnswerById(id);
    },

    async createSomeTaskAnswer() {
        let taskAnswers = [];
        const {user, assignedTasks, assignment} = await AssignmentHelper.createAssignedTaskForUser();
        const answer1 = {
            userId: user.id,
            taskId: assignedTasks[0].taskId,
            assignmentId: assignment.id,
            answer: '42'
        };
        const answer2 = {
            userId: user.id,
            taskId: assignedTasks[1].taskId,
            assignmentId: assignment.id,
            answer: '95'
        };
        taskAnswers.push(await TaskAnswerService.createTaskAnswer(answer1));
        taskAnswers.push(await TaskAnswerService.createTaskAnswer(answer2));

        return await {
            taskAnswers,
            user,
            assignment
        };
    }
};