const UserHelper = require('./user_helper');
const UserGroupsHelper = require('./user_groups_helper');
const UserPermissionsService = require('../../src/services/user_permissions_service');
const UserGroupService = require('../../src/services/user_group_service');

module.exports = {

    async insertUserPermission(group) {
        const creator = await group.getCreatedBy();
        const newMember = await UserHelper.insertNewRandom();

        return await UserPermissionsService.createPermission(creator, {
            userGroupId: group.id,
            userId: newMember.id,
            canManageTasks: false,
            canManageUsers: false,
            canChangePermissions: false
        });
    },

    async insertMultipleUserPermission(group) {
        let permissionList = [];
        const member1 = await this.insertUserPermission(group);
        const member2 = await this.insertUserPermission(group);
        permissionList.push(member1);
        permissionList.push(member2);
        return await permissionList;
    },

    async getUserPermissionList(group) {
        const creator = group.getCreatedBy();
        return await UserPermissionsService.getPermissionListByGroup(creator, group);
    },

    async updateUserPermission(permission, canManageTasks, canManageUsers, canChangePermissions) {
        const groupId = await permission.userGroupId;
        const group = await UserGroupService.getGroupById(groupId);
        const creator = group.getCreatedBy();
        return await UserPermissionsService.updateUserPermission(creator, permission, {
            userGroupId: group.id,
            userId: permission.id,
            canManageTasks: canManageTasks,
            canManageUsers: canManageUsers,
            canChangePermissions: canChangePermissions
        });
    },

    async givePrivilegeToUser(permission) {
        permission.canManageTasks = true;
        permission.canManageUsers = true;
        permission.canChangePermissions = true;
        const permissionUpdated = await permission;
        return await permissionUpdated;
    }


};