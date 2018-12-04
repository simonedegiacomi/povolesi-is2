const TaskHelper       = require('./task_helper');
const AssignmentHelper = require('./assignment_helper');
const {Answer}         = require('../../src/models');

module.exports = {
    async insertAnswrOfAOpenTask() {
        const assignemnt = await AssignmentHelper.insertSimpleAssignment();
        const users      = await assignemnt.getUsers();

        return await Answer.create({
            taskId      : task.id,
            assignmentId: assignment.id,
            userId      : user[0].id,
            openAnswer  : "Secondo me 42"
        });
    }
};