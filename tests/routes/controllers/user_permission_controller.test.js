const request = require('supertest');

const app = require('../../../src/app');
const UserHelper = require('../../helpers/user_helper');
const UserGroupHelper = require('../../helpers/user_groups_helper');
const UserPermissionHelper = require('../../helpers/user_permission_helper');
const UserPermissionsService = require('../../../src/services/user_permissions_service');
const {UserPermission} = require('../../../src/models');

describe("Test the creation of a user permission", () => {

    test("POST /user-permissions with valid data should return 201 and the permission", async () => {
        const group = await UserGroupHelper.createGroup();
        const creator = await group.getCreatedBy();
        const newMember = await UserHelper.insertMario();

        const examplePermission = {
            userId: newMember.id,
            userGroupId: group.id,
            canManageTasks: false,
            canManageUsers: false,
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
        const user = await UserHelper.insertMario();

        const aUser = await UserHelper.insertNewRandom();

        const response = await request(app)
            .post('/api/v1/user-permissions')
            .set('X-API-TOKEN', aUser.authToken)
            .send({
                userId: user.id,
                userGroupId: group.id,
                canManageTasks: false,
                canManageUsers: false,
                canChangePermissions: false
            });

        expect(response.status).toBe(403);
    });

    // TODO: Add test when someone inside the group but without the permissions tries to add a user

});

describe("Test the deletion of a user permission (remove a user fro a group)", () => {
    test("DELETE /user-permissions/:id with valid data should return 200", async () => {
        const permission = await UserPermissionHelper.insertUserPermission();
        const group = await permission.getUserGroup();
        const creator = await group.getCreatedBy();

        const response = await request(app)
            .delete(`/api/v1/user-permissions/${permission.id}`)
            .set('X-API-TOKEN', creator.authToken)
            .send();

        expect(response.status).toBe(200);

        const fromDb = await UserPermission.findOne({
            where: {id: permission.id}
        });
        expect(fromDb).toBeNull();
    });

    test("DELETE /user-permissions/:id should return 403 when someone outside a group tries remove a member", async () => {
        const permission = await UserPermissionHelper.insertUserPermission();
        const aUser = await UserHelper.insertNewRandom();


        const response = await request(app)
            .delete(`/api/v1/user-permissions/${permission.id}`)
            .set('X-API-TOKEN', aUser.authToken)
            .send();

        expect(response.status).toBe(403);
    });

    test("DELETE /user-permissions/:id should return 403 when a member without the 'manageUsers' permission tries remove a member", async () => {
        const permission = await UserPermissionHelper.insertUserPermission();
        const group = await permission.getUserGroup();
        const creator = await group.getCreatedBy();

        const memberWithoutPermission = await UserHelper.insertNewRandom();
        await UserPermissionsService.createPermission(creator, {
            userGroupId: group.id,
            userId: memberWithoutPermission.id,
            canManageTasks: false,
            canManageUsers: false,
            canChangePermissions: false
        });

        const response = await request(app)
            .delete(`/api/v1/user-permissions/${permission.id}`)
            .set('X-API-TOKEN', memberWithoutPermission.authToken)
            .send();

        expect(response.status).toBe(403);
    });

    test("DELETE /user-permissions/:id should return 404 when someone tries to remove a non-member", async () => {
        const permission = await UserPermissionHelper.insertUserPermission();
        const group = await permission.getUserGroup();
        const creator = await group.getCreatedBy();

        const response = await request(app)
            .delete('/api/v1/user-permissions/999')
            .set('X-API-TOKEN', creator.authToken)
            .send();

        expect(response.status).toBe(404);
    });
});
