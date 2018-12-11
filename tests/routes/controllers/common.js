const request = require('supertest');
const app = require('../../../src/app');

module.exports = {

    postUser(user) {
        return request(app)
            .post('/api/v1/register')
            .send(user);
    },

    postUserGroup(group, user) {
        return request(app)
            .post('/api/v1/user-groups')
            .set('X-API-TOKEN', user.authToken)
            .send(group)
    },

    postUserPermission(group, user) {
        return request(app)
            .post('/api/v1/user-permissions')
            .set('X-API-TOKEN', user.authToken)
            .send(group);
    },

    postTaskPool(pool, user) {
        return request(app)
            .post('/api/v1/task-pools')
            .set('X-API-TOKEN', user.authToken)
            .send(pool);
    },

    postTaskWithUser(user, taskBody) {
        return request(app)
            .post('/api/v1/tasks')
            .set('X-API-TOKEN', user.authToken)
            .send(taskBody);
    },

    postTaskAnswer(user, taskAnswer) {
        return request(app)
            .post('/api/v1/task-answers')
            .set('X-API-TOKEN', user.authToken)
            .send(taskAnswer);
    }
};