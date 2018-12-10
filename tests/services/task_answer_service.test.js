const TaskAnswerService = require('../../src/services/task_answer_service');
const UserHelper = require('../helpers/user_helper');
const AssignmentHelper = require('../helpers/assignment_helper');
const TaskAnswerHelper = require('../helpers/task_answer_helper');

describe("Test the creation of a TaskAnswer", () => {

    test('Should create a valid TaskAnswer', async () => {
        const {user, assignedTasks, assignment} = await AssignmentHelper.createAssignedTaskForUser();
        const answer = {
            userId: user.id,
            taskId: assignedTasks[0].taskId,
            assignmentId: assignment.id,
            answer: '42'
        };
        const createdAnswer = await TaskAnswerService.createTaskAnswer(answer);

        const fromDb = await TaskAnswerHelper.findTaskAnswerById(createdAnswer.id);
        expect(fromDb).toBeDefinedAndNotNull();
        expect(fromDb.userId).toBe(answer.userId);
    });

    test('Should not create a TaskAnswer answered by a user that doesn\'t exist', async () => {
        const {assignedTasks, assignment} = await AssignmentHelper.createAssignedTaskForUser();
        const answer = {
            userId: 123,
            taskId: assignedTasks[0].id,
            assignmentId: assignment.id,
            answer: '42'
        };

        await expect(TaskAnswerService.createTaskAnswer(answer))
            .rejects.toThrow(new Error(TaskAnswerService.errors.ASSIGNED_TASK_NOT_FOUND));
    });

    test('Should not create a TaskAnswer for a task that doesn\'t exist', async () => {
        const {user, assignment} = await AssignmentHelper.createAssignedTaskForUser();
        const answer = {
            userId: user.id,
            taskId: 123,
            assignmentId: assignment.id,
            answer: '42'
        };

        await expect(TaskAnswerService.createTaskAnswer(answer))
            .rejects.toThrow(new Error(TaskAnswerService.errors.ASSIGNED_TASK_NOT_FOUND));
    });

    test('Should not create a TaskAnswer for an assignment that doesn\'t exist', async () => {
        const {user, assignedTasks} = await AssignmentHelper.createAssignedTaskForUser();
        const answer = {
            userId: user.id,
            taskId: assignedTasks[0].id,
            assignmentId: 123,
            answer: '42'
        };

        await expect(TaskAnswerService.createTaskAnswer(answer))
            .rejects.toThrow(new Error(TaskAnswerService.errors.ASSIGNED_TASK_NOT_FOUND));
    });

    test('Should not create a TaskAnswer for a task not assigned to a user', async () => {
        const giorgio = await UserHelper.insertGiorgio();
        const {assignedTasks} = await AssignmentHelper.createAssignedTaskForUser();
        const answer = {
            userId: giorgio.id,
            taskId: assignedTasks[0].id,
            assignmentId: 123,
            answer: '42'
        };

        await expect(TaskAnswerService.createTaskAnswer(answer))
            .rejects.toThrow(new Error(TaskAnswerService.errors.ASSIGNED_TASK_NOT_FOUND));
    });



    test('Should not create a TaskAnswer with an empty answer', async () => {
        const {user, assignedTasks, assignment} = await AssignmentHelper.createAssignedTaskForUser();
        const answer = {
            userId: user.id,
            taskId: assignedTasks[0].id,
            assignmentId: assignment.id,
            answer: ''
        };

        await expect(TaskAnswerService.createTaskAnswer(answer))
            .rejects.toThrow(new Error(TaskAnswerService.errors.EMPTY_ANSWER));
    });

});