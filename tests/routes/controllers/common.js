const request = require('supertest');

const app = require('../../../src/app');
const AssignmentService = require('../../../src/services/assignment_service');

function authenticatedPostRequestWithBody(path, body, user) {
    return request(app)
        .post(path)
        .set('X-API-TOKEN', user.authToken)
        .send(body)
}

function authenticatedGet(path, user) {
    return request(app)
        .get(path)
        .set('X-API-TOKEN', user.authToken);
}

module.exports = {

    postUser(user) {
        return request(app)
            .post('/api/v1/register')
            .send(user);
    },

    postUserGroup(group, user) {
        return authenticatedPostRequestWithBody('/api/v1/user-groups', group, user);
    },

    postUserPermission(permission, user) {
        return authenticatedPostRequestWithBody('/api/v1/user-permissions', permission, user);
    },

    postTaskPool(pool, user) {
        return authenticatedPostRequestWithBody('/api/v1/task-pools', pool, user);
    },

    postTaskWithUser(taskBody, user) {
        return authenticatedPostRequestWithBody('/api/v1/tasks', taskBody, user);
    },

    postTaskAnswer(taskAnswer, user) {
        return authenticatedPostRequestWithBody('/api/v1/task-answers', taskAnswer, user);
    },

    postAssignment(assignment, user) {
        // TODO: Replace code with the real code when the controller for the assignment is ready
        //return authenticatedPostRequestWithBody('/api/v1/assignments', assignment, user);

        return new Promise((resolve) => {
            AssignmentService.createAssignment({
                ...assignment,
                createdById: user.id
            }).then(createdAssignment => {
                    resolve({
                        status: 201,
                        body: {
                            assignmentId: createdAssignment.id
                        }
                    })
                });
        });
    },

    getAssignedAssignments(user) {
        return authenticatedGet('/api/v1/users/me/assignments', user);
    },

    getTaskAnswersOfAssignment(assignmentId, user) {
        return authenticatedGet(`/api/v1/task-answers?assignmentId=${assignmentId}`, user);
    },

    getTask (taskId, user) {
        return authenticatedGet(`/api/v1/tasks/${taskId}`, user);
    }
};