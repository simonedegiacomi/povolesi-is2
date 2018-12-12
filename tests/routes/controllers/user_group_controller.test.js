const request = require('supertest');

const app = require('../../../src/app');
const UserHelper = require('../../helpers/user_helper');
const UserGroupHelper = require('../../helpers/user_groups_helper');
const ModelsMapper = require('../../../src/routes/controllers/models_mapper');
const {UserGroup} = require('../../../src/models');

describe('Test the user group creation', () => {

    test('It should create a new group', async () => {
        const user = await UserHelper.insertMario();
        const response = await request(app)
            .post('/api/v1/user-groups')
            .set('X-API-TOKEN', user.authToken)
            .send({name: 'IS2'});

        expect(response.status).toBe(201);
        expect(response.body.userGroupId).toBeAnInteger();
    });

    test('It should create a group without specifying the name', async () => {
        const user = await UserHelper.insertMario();
        const response = await request(app)
            .post('/api/v1/user-groups')
            .set('X-API-TOKEN', user.authToken)
            .send({});

        expect(response.status).toBe(400);
    });

});

// describe('Updating the user group', () => {
//
//     test('It should update the groups that the user has created', async () => {
//         const group = await UserGroupHelper.createGroup();
//         const user = await group.getCreatedBy();
//
//         const response = await request(app)
//             .put(`/api/v1/user-groups/${group.id}`)
//             .set('X-API-TOKEN', user.authToken)
//             .send({name: "New name"});
//
//         expect(response.status).toBe(201);
//
//         const loadedFromDb = await UserGroup.findOne({
//             where: {id: group.id}
//         });
//         expect(loadedFromDb.name).toBe("New name");
//     });
//
//     test('It should not update the groups that the user has not created', async () => {
//         const externalUser = await UserHelper.insertMario();
//
//         const group = await UserGroupHelper.createGroup();
//
//         const response = await request(app)
//             .put(`/api/v1/user-groups/${group.id}`)
//             .set('X-API-TOKEN', externalUser.authToken)
//             .send({name: "New name"});
//
//         expect(response.status).toBe(403);
//     });
//
// });

describe('The user group collection', () => {
    test('It should return the list when of groups', async () => {
        const user = await UserHelper.insertMario();

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
        expect(['A', 'B', 'C'].every(name => names.indexOf(name) > -1)).toBe(true);

    });

    test('It should return an empty list when no groups are registerd', async () => {
        const user = await UserHelper.insertMario();

        const response = await request(app)
            .get('/api/v1/user-groups')
            .set('X-API-TOKEN', user.authToken)
            .send();

        expect(response.status).toBe(200);

        const groups = response.body;
        expect(groups.length).toBe(0);
    });

    test('It should return a specific user group given its id', async () => {
        const user = await UserHelper.insertMario();
        const createdGroup = await UserGroupHelper.createGroup("A");
        createdGroup.createdBy = await createdGroup.getCreatedBy();

        const response = await request(app)
            .get(`/api/v1/user-groups/${createdGroup.id}`)
            .set('X-API-TOKEN', user.authToken)
            .send();

        expect(response.status).toBe(200);

        const group = response.body;
        expect(group).toBeDefinedAndNotNull();

        const expectedJson = await ModelsMapper.mapUserGroup(createdGroup);
        expect(group).toEqual(expectedJson);
    });

    test("It should return 404 if I request a group that doesn't exist", async () => {
        const user = await UserHelper.insertMario();

        const response = await request(app)
            .get('/api/v1/user-groups/123')
            .set('X-API-TOKEN', user.authToken)
            .send();

        expect(response.status).toBe(404);
    });
});


describe("Test the user group deletion", () => {
    test('It should delete an existing user group', async () => {
        const group = await UserGroupHelper.createGroup();
        const user = await group.getCreatedBy();

        const response = await request(app)
            .delete(`/api/v1/user-groups/${group.id}`)
            .set('X-API-TOKEN', user.authToken)
            .send();

        expect(response.status).toBe(200);

        const loadedFromDb = await UserGroup.findOne({
            where: {id: group.id}
        });
        expect(loadedFromDb).toBeNull();
    });

    test("It should return 404 if I try to delete a user group that doesn't exists", async () => {
        const user = await UserHelper.insertMario();

        const response = await request(app)
            .delete('/api/v1/user-groups/123')
            .set('X-API-TOKEN', user.authToken)
            .send();

        expect(response.status).toBe(404);
    });

    test("It should return 403 when someone who didn't create the group tries to delete the group", async () => {
        const group = await UserGroupHelper.createGroup();
        const user = await UserHelper.insertMario();

        const response = await request(app)
            .delete(`/api/v1/user-groups/${group.id}`)
            .set('X-API-TOKEN', user.authToken)
            .send();

        expect(response.status).toBe(403);
    });
});