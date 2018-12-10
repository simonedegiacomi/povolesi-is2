const UserHelper = require('./user_helper');
const UserPermissionsService = require('../../src/services/user_permissions_service');
const UserGroupService = require('../../src/services/user_group_service');

module.exports = {

    async createOneUserAndHisPermissionsForGroup(group) {
        const newMember = await UserHelper.insertNewRandom();
        const creator   = await group.getCreatedBy();

        return await UserPermissionsService.createPermission(creator.id, {
            userGroupId: group.id,
            userId: newMember.id,
            canManageTasks: false,
            canManageUsers: false,
            canChangePermissions: false
        });
    },

    async insertTwoUsersWithTheirPermissionsForGroup(group) {
        const permission1 = await this.createOneUserAndHisPermissionsForGroup(group);
        const permission2 = await this.createOneUserAndHisPermissionsForGroup(group);

        let permissionList = [];
        permissionList.push(permission1);
        permissionList.push(permission2);
        return permissionList;
    },

    async getUserPermissionList(group, creator) {
        return await UserPermissionsService.getPermissionListByGroup(creator.id, group);
    },

    async updateUserPermission(permission, canManageTasks, canManageUsers, canChangePermissions) {
        const groupId = await permission.userGroupId;
        const group = await UserGroupService.getGroupById(groupId);
        const creator = await group.getCreatedBy();
        return await UserPermissionsService.updateUserPermission(creator.id, permission, {
            userGroupId: group.id,
            userId: permission.id,
            canManageTasks: canManageTasks,
            canManageUsers: canManageUsers,
            canChangePermissions: canChangePermissions
        });
    },

    enableAllPermissions(permission) {
        permission.canManageTasks = true;
        permission.canManageUsers = true;
        permission.canChangePermissions = true;
    }


};