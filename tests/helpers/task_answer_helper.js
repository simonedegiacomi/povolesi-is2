const TaskHelper       = require('./task_helper');
const AssignmentHelper = require('./assignment_helper');
const {Answer}         = require('../../src/models');

module.exports = {
    async insertAnswerOfAOpenTask() {
        const assignment = await AssignmentHelper.insertSimpleAssignment();
        const group      = await assignment.getGroup();
        const users      = await group.getUsers();

        return await Answer.create({
            taskId      : task.id,
            assignmentId: assignment.id,
            userId      : users[0].id,
            openAnswer  : "Secondo me 42"
        });
    }
};