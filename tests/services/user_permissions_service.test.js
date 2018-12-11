const UserHelper = require('../helpers/user_helper');
const UserPermissionHelper = require('../helpers/user_permission_helper');
const UserGroupsHelper = require('../helpers/user_groups_helper');
const UserPermissionsService = require('../../src/services/user_permissions_service.js');
const {UserPermission} = require('../../src/models');
const ArgumentError = require('../../src/services/argument_error');

describe("Test the listing of user permissions in a group", () => {
    test("Should return the user permission list given a groupId", async () => {
        const group = await UserGroupsHelper.createGroup();
        const creator = await group.getCreatedBy();

        const permissionList       = await UserPermissionHelper.insertTwoUsersWithTheirPermissionsForGroup(group);
        const permissionListFromDb = await UserPermissionHelper.getUserPermissionList(group, creator);

        expect(permissionList).toBeDefinedAndNotNull();
        expect(permissionListFromDb).toBeDefinedAndNotNull();

        expect(permissionListFromDb.map(p => p.toJSON())).toEqual(
            expect.arrayContaining(permissionList.map(p => p.toJSON()))
        );
    });

    test("Should return error group not found given a group that is null", async () => {
        const creator = await UserHelper.insertNewRandom();
        await expect(UserPermissionHelper.getUserPermissionList(null, creator))
            .rejects.toThrow(UserPermissionsService.errors.GROUP_NOT_FOUND);
    });

    test("Should return error user unathorized", async () => {
        const creator = await UserHelper.insertNewRandom();
        const group = await UserGroupsHelper.createGroup();
        await expect(UserPermissionHelper.getUserPermissionList(group, creator))
            .rejects.toThrow(UserPermissionsService.errors.UNAUTHORIZED);

    });
});

describe('Test the update of a user permission  (change privileges of a user)', () => {
    test('Should return the user permission updated given the permissionId and permission flags', async () => {
        const group = await UserGroupsHelper.createGroup();
        const permission = await UserPermissionHelper.createOneUserAndHisPermissionsForGroup(group);
        const permissionFromDb = await UserPermissionHelper.updateUserPermission(permission, true, true, true);

        UserPermissionHelper.enableAllPermissions(permission);

        expect(permissionFromDb.toJSON()).toEqual(permission.toJSON());

    });

    test('Should return error with actionPerformer a random UNAUTHORIZED user', async () => {
        const group = await UserGroupsHelper.createGroup();
        const permission = await UserPermissionHelper.insertUserPermission(group);

        await expect(UserPermissionHelper.updateUserPermissionWithoutPermission(permission, true, true, true))
            .rejects.toThrow(UserPermissionsService.errors.UNAUTHORIZED);

    });
});

describe("Test the creation of a user permission (add user to a group)", () => {

    test("Should return the user permission instance just created", async () => {
        const group      = await UserGroupsHelper.createGroup();
        const permission = await UserPermissionHelper.createOneUserAndHisPermissionsForGroup(group);

        expect(permission).toBeDefinedAndNotNull();

        const fromDb = await UserPermission.findOne({
            where: {id: permission.id}
        });
        expect(fromDb).toBeDefinedAndNotNull();
    });

    test("Should throw an exception if a user outside the group creates a permission", async () => {
        const unauthorized = await UserHelper.insertNewRandom();

        try {
            await UserPermissionsService.createPermission(unauthorized.id, {
                userGroupId: (await UserGroupsHelper.createGroup()).id,
                userId:      (await UserHelper.insertMario()).id,
                canManageTasks: false,
                canManageUsers: false,
                canChangePermissions: false
            });
            expect().toFail();
        } catch (e) {
            expect(e.message).toBe(UserPermissionsService.errors.UNAUTHORIZED);
        }
    });

    test("Should throw an exception when trying to insert a permission without specifying who wants to do it ", async () => {
        try {
            await UserPermissionsService.createPermission({
                userGroupId: (await UserGroupsHelper.createGroup()).id,
                userId:      (await UserHelper.insertMario()).id
            });
        } catch (e) {
            expect(e).toBeInstanceOf(ArgumentError);
        }
    });

    // TODO: Add test when someone inside the group but without the permissions tries to add a user

    test("Should throw an exception when trying to insert a permission without specifying the group ", async () => {
        const group = await UserGroupsHelper.createGroup();
        const creator = await group.getCreatedBy();

        try {
            await UserPermissionsService.createPermission(creator.id, {
                userId: (await UserHelper.insertMario()).id
            });
        } catch (e) {
            expect(e).toBeInstanceOf(ArgumentError);
        }
    });

    test("Should throw an exception when trying to insert a permission without specifying the new group member", async () => {
        const group   = await UserGroupsHelper.createGroup();
        const creator = await group.getCreatedBy();

        try {
            await UserPermissionsService.createPermission(creator.id, {
                userGroupId: group.id,
            });
        } catch (e) {
            expect(e).toBeInstanceOf(ArgumentError);
        }
    });


    test("Should throw an exception when trying to add a user to the group multiple times", async () => {
        const group   = await UserGroupsHelper.createGroup();
        const permission = await UserPermissionHelper.createOneUserAndHisPermissionsForGroup(group);
        const creator = await group.getCreatedBy();
        const member = await permission.getUser();

        try {
            await UserPermissionsService.createPermission(creator.id, {
                userGroupId: group.id,
                userId: member.id
            });
            expect().toFail();
        } catch (e) {
            expect(e.message).toBe(UserPermissionsService.errors.USER_ALREADY_MEMBER);
        }
    });

});

describe("Test the deletion of a user permission (remove a user fro a group)", () => {

    test("Should remove a user from a group", async () => {
        const group      = await UserGroupsHelper.createGroup();
        const permission = await UserPermissionHelper.createOneUserAndHisPermissionsForGroup(group);
        const creator    = await group.getCreatedBy();

        await UserPermissionsService.deletePermissionById(creator.id, permission.id);

        const fromDb = await UserPermission.findOne({
            where: {id: permission.id}
        });
        expect(fromDb).toBeNull();
    });

    test("Should throw an exception when someone outside a group tries remove a member", async () => {
        const group      = await UserGroupsHelper.createGroup();
        const permission = await UserPermissionHelper.createOneUserAndHisPermissionsForGroup(group);
        const aUser      = await UserHelper.insertNewRandom();

        try {
            await UserPermissionsService.deletePermissionById(aUser.id, permission.id);
            expect().toFail();
        } catch (e) {
            expect(e.message).toBe(UserPermissionsService.errors.UNAUTHORIZED);
        }
    });


    test("Should throw an exception when a member without the 'manageUsers' permission tries remove a member", async () => {

        const group      = await UserGroupsHelper.createGroup();
        const permission = await UserPermissionHelper.createOneUserAndHisPermissionsForGroup(group);
        const creator    = await group.getCreatedBy();

        const memberWithoutPermission = await UserHelper.insertNewRandom();
        await UserPermissionsService.createPermission(creator.id, {
            userGroupId: group.id,
            userId: memberWithoutPermission.id,
            canManageTasks: false,
            canManageUsers: false,
            canChangePermissions: false
        });

        try {
            await UserPermissionsService.deletePermissionById(memberWithoutPermission.id, permission.id);
            expect().toFail();
        } catch (e) {
            expect(e.message).toBe(UserPermissionsService.errors.UNAUTHORIZED);
        }
    });

    test("Should throw an exception when someone tries to remove a non-member from a group", async () => {
        const group      = await UserGroupsHelper.createGroup();
        const creator    = await group.getCreatedBy();

        let giorgio = await UserHelper.insertGiorgio();

        try {
            await UserPermissionsService.deletePermissionById(creator.id, giorgio.id);
            expect().toFail();
        } catch (e) {
            expect(e.message).toBe(UserPermissionsService.errors.USER_PERMISSION_NOT_FOUND);
        }
    });

});


