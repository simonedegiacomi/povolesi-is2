const UserHelper = require('../../helpers/user_helper');
const AssignmentHelper = require('../../helpers/assignment_helper');
const TaskAnswerHelper = require('../../helpers/task_answer_helper');
const {postTaskAnswer} = require('./common');

describe('Test the API to create a TaskAnswer', () => {


    test('POST /task-answer with valid data should return 200', async () => {
        const {user, assignedTasks, assignment} = await AssignmentHelper.createAssignedTaskForUser();
        const answer = {
            userId: user.id,
            taskId: assignedTasks[0].taskId,
            assignmentId: assignment.id,
            answer: '42'
        };
        const response = await postTaskAnswer(answer, user);

        expect(response.status).toBe(201);

        const fromDb = await TaskAnswerHelper.findTaskAnswerById(response.body.taskAnswerId);
        expect(fromDb).toBeDefinedAndNotNull();
        expect(fromDb.userId).toBe(answer.userId);
    });

    test('Should not create a TaskAnswer for a task that doesn\'t exist', async () => {
        const {user, assignment} = await AssignmentHelper.createAssignedTaskForUser();
        const answer = {
            userId: user.id,
            taskId: 123,
            assignmentId: assignment.id,
            answer: '42'
        };
        const response = await postTaskAnswer(answer, user);

        expect(response.status).toBe(400);
    });

    test('Should not create a TaskAnswer for an assignment that doesn\'t exist', async () => {
        const {user, assignedTasks} = await AssignmentHelper.createAssignedTaskForUser();
        const answer = {
            userId: user.id,
            taskId: assignedTasks[0].taskId,
            assignmentId: 123,
            answer: '42'
        };
        const response = await postTaskAnswer(answer, user);

        expect(response.status).toBe(400);
    });

    test('Should not create a TaskAnswer for a task not assigned to a user', async () => {
        const giorgio = await UserHelper.insertGiorgio();
        const {assignedTasks, assignment} = await AssignmentHelper.createAssignedTaskForUser();
        const answer = {
            taskId: assignedTasks[0].taskId,
            assignmentId: assignment.id,
            answer: '42'
        };
        const response = await postTaskAnswer(answer, giorgio);

        expect(response.status).toBe(400);
    });


    test('Should not create a TaskAnswer with an empty answer', async () => {
        const {user, assignedTasks, assignment} = await AssignmentHelper.createAssignedTaskForUser();
        const answer = {
            userId: user.id,
            taskId: assignedTasks[0].taskId,
            assignmentId: assignment.id,
            answer: ''
        };
        const response = await postTaskAnswer(answer, user);

        expect(response.status).toBe(400);
    });


});