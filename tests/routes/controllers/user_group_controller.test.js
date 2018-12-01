const request = require('supertest');

const app = require('../../../src/app');
const UserHelper = require('../../helpers/user_helper');
const UserGroupHelper  = require('../../helpers/user_groups_helper');

describe('Test the user group creation', () => {

    test('It should create a new group', async () => {
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

    test('It should create a group without specifying the name', async () => {
        const user     = await UserHelper.insertMario();
        const response = await request(app)
            .post('/api/v1/user-groups')
            .set('X-API-TOKEN', user.authToken)
            .send({});

        expect(response.status).toBe(400);
    });

});


describe('The user group collection', () => {
    test('It should return the list when of groups', async () => {
        const user     = await UserHelper.insertMario();

        await UserGroupHelper.createGroup("A");
        await UserGroupHelper.createGroup("B");
        await UserGroupHelper.createGroup("C");

        const response = await request(app)
            .get('/api/v1/user-groups')
            .set('X-API-TOKEN', user.authToken)
            .send();

        expect(response.status).toBe(200);

        const groups = response.body;
        expect(groups.length).toBe(3);

        const names = groups.map(item => item.name);
        expect(['A', 'B', 'C'].every(name => names.indexOf(name) > -1));

    });

    test('It should return an empty list when no groups are registerd', async () => {
        const user     = await UserHelper.insertMario();

        const response = await request(app)
            .get('/api/v1/user-groups')
            .set('X-API-TOKEN', user.authToken)
            .send();

        expect(response.status).toBe(200);

        const groups = response.body;
        expect(groups.length).toBe(0);
    })
});