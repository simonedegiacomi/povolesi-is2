const UserHelper             = require('../helpers/user_helper');
const UserPermissionHelper   = require('../helpers/user_permission_helper');
const UserGroupsHelper       = require('../helpers/user_groups_helper');
const UserPermissionsService = require('../../src/services/user_permissions_service.js');
const {UserPermission}       = require('../../src/models');

describe("Test the creation of a user permission (add user to a group)", () => {

    test("Should return the user permission instance just created", async () => {
        const permission = await UserPermissionHelper.insertUserPermission();

        expect(permission).toBeDefined();

        const fromDb = await UserPermission.findOne({
            where: {id: permission.id}
        });
        expect(fromDb).toBeDefined();
    });

    test("Should throw an exception if a user outside the group creates a permission", async () => {
        const group     = await UserGroupsHelper.insertGroup();
        const newMember = await UserHelper.insertMario();

        const unauthorized = await UserHelper.insertNewRandom();

        try {
            await UserPermissionsService.createPermission(unauthorized, {
                userGroupId         : group.id,
                userId              : newMember.id,
                canManageTasks      : false,
                canManageUsers      : false,
                canChangePermissions: false
            });
            expect(true).toBe(false);
        } catch (e) {
            expect(e.message).toBe(UserPermissionsService.errors.UNAUTHORIZED);
        }
    });

    test("Should throw an exception when trying to insert a permission without specifying who wants to do it ", async () => {
        const group     = await UserGroupsHelper.insertGroup();
        const newMember = await UserHelper.insertMario();

        try {
            await UserPermissionsService.createPermission({
                userGroupId: group.id,
                userId     : newMember.id
            });
        } catch (e) {
            expect(e.message).toBe(UserPermissionsService.errors.WRONG_ARGUMENTS);
        }
    });

    // TODO: Add test when someone inside the group but without the permissions tries to add a user

    test("Should throw an exception when trying to insert a permission without specifying the group ", async () => {
        const group     = await UserGroupsHelper.insertGroup();
        const creator   = await group.getCreatedBy();
        const newMember = await UserHelper.insertMario();

        try {
            await UserPermissionsService.createPermission(creator, {
                userId: newMember.id
            });
        } catch (e) {
            expect(e.message).toBe(UserPermissionsService.errors.WRONG_ARGUMENTS);
        }
    });

    test("Should throw an exception when trying to insert a permission without specifying the new group member", async () => {
        const group   = await UserGroupsHelper.insertGroup();
        const creator = await group.getCreatedBy();

        try {
            await UserPermissionsService.createPermission(creator, {
                userGroupId: group.id,
            });
        } catch (e) {
            expect(e.message).toBe(UserPermissionsService.errors.WRONG_ARGUMENTS);
        }
    });


    test("Should throw an exception when trying to add a user to the group multiple times", async () => {
        const permission = await UserPermissionHelper.insertUserPermission();

        const group   = await permission.getUserGroup();
        const creator = await group.getCreatedBy();
        const member  = await permission.getUser();

        try {
            await UserPermissionsService.createPermission(creator, {
                userGroupId: group.id,
                userId     : member.id
            });
            expect(false).toBe(true);
        } catch (e) {
            expect(e.message).toBe(UserPermissionsService.errors.USER_ALREADY_MEMBER);
        }
    });

});

describe("Test the deletion of a user permission (remove a user fro a group)", () => {

    test("Should remove a user from a group", async () => {
        const permission = await UserPermissionHelper.insertUserPermission();
        const group      = await permission.getUserGroup();
        const creator    = await group.getCreatedBy();

        await UserPermissionsService.deletePermissionById(creator, permission.id);

        const fromDb = await UserPermission.findOne({
            where: {id: permission.id}
        });
        expect(fromDb).toBeNull();
    });

    test("Should throw an exception when someone outside a group tries remove a member", async () => {
        const permission = await UserPermissionHelper.insertUserPermission();
        const aUser      = await UserHelper.insertNewRandom();

        try {
            await UserPermissionsService.deletePermissionById(aUser, permission.id);
            expect(false).toBe(true);
        } catch (e) {
            expect(e.message).toBe(UserPermissionsService.errors.UNAUTHORIZED);
        }
    });


    test("Should throw an exception when a member without the 'manageUsers' permission tries remove a member", async () => {
        const permission = await UserPermissionHelper.insertUserPermission();
        const group      = await permission.getUserGroup();
        const creator    = await group.getCreatedBy();

        const memberWithoutPermission = await UserHelper.insertNewRandom();
        await UserPermissionsService.createPermission(creator, {
            userGroupId         : group.id,
            userId              : memberWithoutPermission.id,
            canManageTasks      : false,
            canManageUsers      : false,
            canChangePermissions: false
        });

        try {
            await UserPermissionsService.deletePermissionById(memberWithoutPermission, permission.id);
            expect(false).toBe(true);
        } catch (e) {
            expect(e.message).toBe(UserPermissionsService.errors.UNAUTHORIZED);
        }
    });

    test("Should throw an exception when someone tries to remove a non-member from a group", async () => {
        const permission = await UserPermissionHelper.insertUserPermission();
        const group      = await permission.getUserGroup();
        const creator    = await group.getCreatedBy();

        try {
            await UserPermissionsService.deletePermissionById(creator, 999);
            expect(false).toBe(true);
        } catch (e) {
            expect(e.message).toBe(UserPermissionsService.errors.USER_PERMISSION_NOT_FOUND);
        }
    });

});


