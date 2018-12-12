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

describe('Test the get of a list all the task-answer, given a userId and assignmentId', () => {
    test('Should return the list of task-answer', async () => {
        const { taskAnswers, user, assignment } = await TaskAnswerHelper.createSomeTaskAnswer();

        const taskAnswersFromDb = await TaskAnswerService.getTaskAnswerByUserAndAssignment(user.id, assignment.id);
        taskAnswers[0].submittedOn = taskAnswersFromDb[0].submittedOn;
        taskAnswers[1].submittedOn = taskAnswersFromDb[1].submittedOn;

        expect(taskAnswers).toBeDefinedAndNotNull();
        expect(taskAnswersFromDb).toBeDefinedAndNotNull();

        expect(taskAnswersFromDb.map(t => t.toJSON())).toEqual(
            expect.arrayContaining(taskAnswers.map(t => t.toJSON()))
        );
    });

    test("Should return error if given an assignmentId that doesn't exits", async () => {
        const { taskAnswers, user, assignment } = await TaskAnswerHelper.createSomeTaskAnswer();

        await expect(TaskAnswerService.getTaskAnswerByUserAndAssignment(user.id, 459))
            .rejects.toThrow(new Error(TaskAnswerService.errors.ASSIGNMENT_NOT_FOUND));
    });

    test("Should return error if given an userId that doesn't exits", async () => {
        const { taskAnswers, user, assignment } = await TaskAnswerHelper.createSomeTaskAnswer();

        await expect(TaskAnswerService.getTaskAnswerByUserAndAssignment(756, assignment.id))
            .rejects.toThrow(new Error(TaskAnswerService.errors.USER_NOT_FOUND));
    });
});

describe('Test the get of a task answer given its id ', () => {
    test('Should return the task answer given its id', async () => {
        const { taskAnswers, user, assignment } = await TaskAnswerHelper.createSomeTaskAnswer();
        const taskAnswerId = await taskAnswers[0].id;

        const taskAnswerFromDb = await TaskAnswerService.getTaskAnswerById(taskAnswerId);
        taskAnswers[0].submittedOn = taskAnswerFromDb.submittedOn;

        expect(taskAnswerFromDb.toJSON()).toEqual(taskAnswers[0].toJSON());
    });

    test('Should return error if task answer is not found', async () => {
        await expect(TaskAnswerService.getTaskAnswerById('756'))
            .rejects.toThrow(new Error(TaskAnswerService.errors.TASK_ANSWER_NOT_FOUND));
    });

    test('Should return error if id is null', async () => {
        await expect(TaskAnswerService.getTaskAnswerById(null))
            .rejects.toThrow(new Error(TaskAnswerService.errors.TASK_ANSWER_NOT_FOUND));
    });
});