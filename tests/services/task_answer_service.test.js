const TaskAnswerService = require('../../src/services/task_answer_service');
const UserHelper = require('../helpers/user_helper');
const UserGroupsHelper = require('../helpers/user_groups_helper');
const AssignmentHelper = require('../helpers/assignment_helper');
const TaskAnswerHelper = require('../helpers/task_answer_helper');

describe("Test the creation of a TaskAnswer", () => {

    test('Create a valid TaskAnswer', async () => {
        const {user, assignedTasks, assignment} = await AssignmentHelper.createAssignedTaskForUser();
        const assignedTask = assignedTasks[0];
        const answer = {
            userId: user.id,
            taskId: assignedTask,
            assignmentId: assignment.id
        };
        const createdAnswer = await TaskAnswerService.createTaskAnswer(answer);

        const fromDb = await TaskAnswerHelper.findTaskAnswerById(createdAnswer.id);
        expect(fromDb).toBeDefinedAndNotNull();
        expect(fromDb.userId).toBe(answer.userId);
    });

});