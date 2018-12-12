const request = require('supertest');

const app = require('../../../src/app');
const UserHelper = require('../../helpers/user_helper');
const AssignmentHelper = require('../../helpers/assignment_helper');
const TaskAnswerHelper = require('../../helpers/task_answer_helper');
const TaskAnswerService = require('../../../src/services/task_answer_service');

const {postTaskAnswer, getTaskAnswerByAssignmentIdAndUserId} = require('./common');


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

describe('Test the API to get a list of task answers given userId and assignmentId', () => {
    test('GET /task-answers with valid query parameters should return 200 and a list of task answers', async () => {
        const {user, assignment} = await TaskAnswerHelper.createSomeTaskAnswer();

        const response = await getTaskAnswerByAssignmentIdAndUserId(assignment.id, user.id, user);

        expect(response.status).toBe(200);

        const fromDb = await TaskAnswerService.getTaskAnswerByUserAndAssignment(user.id, assignment.id);

        const fromDbJSON = fromDb.map(t => t.toJSON());
        fromDbJSON[0].submittedOn = await response.body[0].submittedOn;
        fromDbJSON[1].submittedOn = await response.body[1].submittedOn;


        expect(fromDb).toBeDefinedAndNotNull();
        expect(response.body).toEqual(
            expect.arrayContaining(fromDbJSON)
        );
    });


    test('GET /task-answers without userId query parameter should return 400', async () => {
        const {taskAnswers, user, assignment} = await TaskAnswerHelper.createSomeTaskAnswer();

        const response = await request(app)
            .get(`/api/v1/task-answers?assignmentId=${assignment.id}`)
            .set('X-API-TOKEN', user.authToken);

        expect(response.status).toBe(400);
    });

    test('GET /task-answers without assignmentId query parameter should return 400', async () => {
        const {taskAnswers, user, assignment} = await TaskAnswerHelper.createSomeTaskAnswer();

        const response = await request(app)
            .get(`/api/v1/task-answers?userId=${user.id}`)
            .set('X-API-TOKEN', user.authToken);

        expect(response.status).toBe(400);
    });

    //test parametro insesistente
    test('GET /task-answers with a non existing userId query parameter should return 404', async () => {
        const {taskAnswers, user, assignment} = await TaskAnswerHelper.createSomeTaskAnswer();

        const response = await request(app)
            .get(`/api/v1/task-answers?userId=892&assignmentId=${assignment.id}`)
            .set('X-API-TOKEN', user.authToken);

        expect(response.status).toBe(404);
    });

    test('GET /task-answers with a non existing assignmentId query parameter should return 404', async () => {
        const {taskAnswers, user, assignment} = await TaskAnswerHelper.createSomeTaskAnswer();

        const response = await request(app)
            .get(`/api/v1/task-answers?userId=${user.id}&assignmentId=649`)
            .set('X-API-TOKEN', user.authToken);

        expect(response.status).toBe(404);
    });
});

describe('Test the API that get a task-answer given its taskAnswerId', () => {
    test('GET /task-answers/:id should return 200 and the task answer', async () => {
        const {taskAnswers, user, assignment} = await TaskAnswerHelper.createSomeTaskAnswer();
        const newTaskAnswer = taskAnswers[0];

        const response = await request(app)
            .get(`/api/v1/task-answers/${newTaskAnswer.id}`)
            .set('X-API-TOKEN', user.authToken);

        expect(response.status).toBe(200);

        const newTaskAnswerJSON = newTaskAnswer.toJSON();
        newTaskAnswerJSON.submittedOn = response.body.submittedOn;
        expect(response.body).toEqual(newTaskAnswerJSON);
    });

    test('GET /task-answers/:id with a not existing taskAnswerId should return 404', async () => {
        const {taskAnswers, user, assignment} = await TaskAnswerHelper.createSomeTaskAnswer();

        const response = await request(app)
            .get('/api/v1/task-answers/799')
            .set('X-API-TOKEN', user.authToken);

        expect(response.status).toBe(404);
    })
});