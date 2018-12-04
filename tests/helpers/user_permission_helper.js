const UserHelper = require('./user_helper');
const UserGroupsHelper = require('./user_groups_helper');
const UserPermissionsService = require('../../src/services/user_permissions_service');

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
    }


};