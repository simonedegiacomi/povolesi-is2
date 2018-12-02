const UserHelper             = require('../helpers/user_helper');
const UserPermissionHelper   = require('../helpers/user_permission_helper');
const UserPermissionsService = require('../../src/services/user_permissions_service.js');

describe("Test the creation of a user permission", () => {

    test("Should return the user permission instance just created", async () => {
        const permission = UserPermissionHelper.insertUserPermission();

        expect(permission).toBeDefined();
    });

    test("Should throw an exception if an unathorized user create a permission", async () => {
        const group     = await UserGroupsHelper.createGroup();
        const newMember = await UserHelper.insertMario();

        const unauthorized = await UserHelper.insertNewRandom();

        try {
            const permission = await UserPermissionsService.createPermission(unauthorized, group, newMember);
        } catch (e) {
            expect(e.message).toBe(UserPermissionsService.errors.UNAUTHORIZED);
        }
    });

    test("Should throw an exception when trying to insert a permission without specifying who wants to do it ", async () => {
        const group     = await UserGroupsHelper.createGroup();
        const newMember = await UserHelper.insertMario();

        try {
            const permission = await UserPermissionsService.createPermission(group, newMember);
        } catch (e) {
            expect(e.message).toBe(UserPermissionsService.errors.WRONG_ARGUMENTS);
        }
    });

    test("Should throw an exception when trying to insert a permission without specifying the group ", async () => {
        const group     = await UserGroupsHelper.createGroup();
        const creator   = await group.getCreatedBy();
        const newMember = await UserHelper.insertMario();

        try {
            const permission = await UserPermissionsService.createPermission(creator, newMember);
        } catch (e) {
            expect(e.message).toBe(UserPermissionsService.errors.WRONG_ARGUMENTS);
        }
    });

    test("Should throw an exception when trying to insert a permission without specifying the new group member", async () => {
        const group   = await UserGroupsHelper.createGroup();
        const creator = await group.getCreatedBy();

        try {
            const permission = await UserPermissionsService.createPermission(creator, group);
        } catch (e) {
            expect(e.message).toBe(UserPermissionsService.errors.WRONG_ARGUMENTS);
        }
    });


    test("Should throw an exception when trying to add a user to the group multiple times", async () => {
        const permission = UserPermissionHelper.insertUserPermission();

        const group   = await permission.getGroup();
        const creator = await group.getCreatedBy();
        const member  = await permission.getUser();

        try {
            const permission = await UserPermissionsService.createPermission(creator, group, member);
        } catch (e) {
            expect(e.message).toBe(UserPermissionsService.errors.USER_ALREADY_MEMBER);
        }
    });

});
