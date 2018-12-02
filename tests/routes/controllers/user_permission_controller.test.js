const request = require('supertest');

const app             = require('../../../src/app');
const UserHelper      = require('../../helpers/user_helper');
const UserGroupHelper = require('../../helpers/user_groups_helper');

describe("Test the creation of a user permission", () => {

    test("POST /user-permissions with valid data should return 201 and the permission", async () => {
        const group     = await UserGroupHelper.createGroup();
        const creator   = await group.getCreatedBy();
        const newMember = await UserHelper.insertMario();

        const examplePermission = {
            userId              : newMember.id,
            userGroupId         : group.id,
            canManageTasks      : false,
            canManageUsers      : false,
            canChangePermissions: false
        };

        const response = await request(app)
            .post('/api/v1/user-permissions')
            .set('X-API-TOKEN', creator.authToken)
            .send(examplePermission);

        expect(response.status).toBe(201);
        expect(response.body.id).toBeDefined();
        examplePermission.id = response.body.id;
        expect(response.body).toEqual(examplePermission);
    });

    test("POST /user-permissions from a user outside the group should return 403", async () => {
        const group = await UserGroupHelper.createGroup();
        const user  = await UserHelper.insertMario();

        const aUser = await UserHelper.insertNewRandom();

        const response = await request(app)
            .post('/api/v1/user-permissions')
            .set('X-API-TOKEN', aUser.authToken)
            .send({
                userId              : user.id,
                userGroupId         : group.id,
                canManageTasks      : false,
                canManageUsers      : false,
                canChangePermissions: false
            });

        expect(response.status).toBe(403);
    });

    // TODO: Add test when someone inside the group but without the permissions tries to add a user

});