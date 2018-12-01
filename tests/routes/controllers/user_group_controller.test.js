const request = require('supertest');

const app = require('../../../src/app');
const UserHelper = require('../../helpers/user_helper');

describe('Test the user group creation', () => {

    test('Create a new group', async () => {
        const user     = await UserHelper.insertMario();
        const response = await request(app)
            .post('/api/v1/user-groups')
            .set('X-API-TOKEN', user.authToken)
            .send({
                name: 'IS2'
            });

        expect(response.status).toBe(201);
        expect(response.body.userGroupId).toBeDefined();
    });

    test('Create a group without specifying the name', async () => {
        const user     = await UserHelper.insertMario();
        const response = await request(app)
            .post('/api/v1/user-groups')
            .set('X-API-TOKEN', user.authToken)
            .send({});

        expect(response.status).toBe(400);
    });

});