const common = require('./common');

async function expectStatusAndReturnResponse(request, status) {
    // The following line work because request is a sort of Promise (with a method called 'then')
    const response = await request;

    expect(response.status).toBe(status);

    return response.body;
}

async function expectCreatedAndReturnEntity(request) {
    return await expectStatusAndReturnResponse(request, 201);
}

async function expectCreatedAndReturnUserIdAndAuthToken(request) {
    const {userId, token} = await expectCreatedAndReturnEntity(request);
    return {
        id: userId,
        authToken: token
    }
}

async function expectCreatedAndReturnTaskId(request) {
    const {taskId} = await expectCreatedAndReturnEntity(request);
    return taskId;
}

async function expectOkAndReturnResponse(request) {
    return await expectStatusAndReturnResponse(request, 200);
}


async function resolveExam(assignment, user) {
    const tasksToAnswer = assignment.assignedTasks;
    const assignmentId = assignment.id;

    for (let assignedTask of tasksToAnswer) {
        const taskId = assignedTask.taskId;
        const task = await expectOkAndReturnResponse(common.getTask(taskId, user));

        await expectCreatedAndReturnEntity(common.postTaskAnswer({
            assignmentId,
            taskId,
            answer: task.type === 'multiple' ? '42' : 'now' // Very sophisticated AI code
        }, user));
    }

    return tasksToAnswer.length;
}

describe('Test a complete scenario', () => {

    test('A professor assigns an exam to a group of users', async () => {
        // Crate the professor
        const professor = await expectCreatedAndReturnUserIdAndAuthToken(common.postUser({
            name: 'Fabio Casati',
            email: 'fabio@casati.it',
            password: 'password',
            badgeNumber: '123456'
        }));

        //  Create the TA
        const ta = await expectCreatedAndReturnUserIdAndAuthToken(common.postUser({
            name: 'Jorge Ramírez',
            email: 'jorge@ramírez.it',
            password: 'password',
            badgeNumber: '234567'
        }));

        // Create students
        const mattia = await expectCreatedAndReturnUserIdAndAuthToken(common.postUser({
            name: 'Mattia Simone',
            email: 'simone@mattia.it',
            password: 'password',
            badgeNumber: '345678'
        }));
        const slava = await expectCreatedAndReturnUserIdAndAuthToken(common.postUser({
            name: 'Slava Rublev',
            email: 'slava@ruble.it',
            password: 'password',
            badgeNumber: '456789'
        }));


        // The professor creates a group
        const {userGroupId} = await expectCreatedAndReturnEntity(common.postUserGroup({
            name: 'Corso IS2 2018'
        }, professor));

        // Add the ta
        const taPermission = await expectCreatedAndReturnEntity(common.postUserPermission({
            userGroupId,
            userId: ta.id,
            canManageTasks: true,
            canManageUsers: false,
            canChangePermissions: false
        }, professor));

        // Add the students
        const mattiaPermission = await expectCreatedAndReturnEntity(common.postUserPermission({
            userGroupId,
            userId: mattia.id,
            canManageTasks: false,
            canManageUsers: false,
            canChangePermissions: false
        }, professor));
        const slavaPermission = await expectCreatedAndReturnEntity(common.postUserPermission({
            userGroupId,
            userId: slava.id,
            canManageTasks: false,
            canManageUsers: false,
            canChangePermissions: false
        }, professor));

        // The professor creates some tasks
        const taskIds = [
            await expectCreatedAndReturnTaskId(common.postTaskWithUser({
                question: 'What is the meaning of life?',
                type: 'multiple',
                canBePeerReviewed: true,
                multipleChoicesAllowed: false,
                choices: ['Happiness', 'Balance', 42]
            }, professor)),
            await expectCreatedAndReturnTaskId(common.postTaskWithUser({
                question: 'When is the right time to commit',
                type: 'open',
                canBePeerReviewed: true,
                maxLength: 512
            }, professor))
        ];

        // Create a task pool
        const {taskPoolId} = await expectCreatedAndReturnEntity(common.postTaskPool({
            name: 'IS2 Exam',
            tasks: taskIds,
            numQuestionsToDraw: 1
        }, professor));

        // Create assignments
        const startsOn = new Date();
        const submissionDeadline = new Date();
        const peerReviewsDeadline = new Date();

        submissionDeadline.setHours(startsOn.getHours() + 1);
        peerReviewsDeadline.setHours(startsOn.getHours() + 2);

        const {assignmentId} = await expectCreatedAndReturnEntity(common.postAssignment({
            name: 'January IS2 Exam',
            taskPoolIds: [taskPoolId],
            assignedUserGroupId: userGroupId,
            startsOn,
            submissionDeadline,
            peerReviewsDeadline
        }, professor));

        // students take their exams
        const slavaAssignments = await expectOkAndReturnResponse(common.getAssignedAssignments(slava));
        const mattiaAssignments = await expectOkAndReturnResponse(common.getAssignedAssignments(mattia));

        expect(slavaAssignments.length).toBe(1);
        expect(mattiaAssignments.length).toBe(1);

        const slavaFirstAssignment = slavaAssignments[0];
        const mattiaFirstAssignment = mattiaAssignments[0];

        expect(slavaFirstAssignment.assignedTasks.length).toBe(1);
        expect(mattiaFirstAssignment.assignedTasks.length).toBe(1);

        // Students resolve the exams
        await resolveExam(slavaAssignments[0], slava);
        await resolveExam(mattiaAssignments[0], mattia);

        // The TA read the answers of the students
        const slavaAnswers = await expectOkAndReturnResponse(common.getTaskAnswerByAssignmentIdAndUserId(assignmentId, slava.id, ta));
        const mattiaAnswers = await expectOkAndReturnResponse(common.getTaskAnswerByAssignmentIdAndUserId(assignmentId, slava.id, ta));
        expect(slavaAnswers.length).toBe(1);
        expect(mattiaAnswers.length).toBe(1);
    });

});