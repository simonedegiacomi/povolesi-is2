const UserHelper             = require('./user_helper');
const UserGroupsHelper       = require('./user_groups_helper');
const UserPermissionsService = require('../../src/services/user_permissions_service.js');

module.exports = {
    async insertUserPermission() {
        const group     = await UserGroupsHelper.insertGroup();
        const creator   = await group.getCreatedBy();
        const newMember = await UserHelper.insertMario();

        return await UserPermissionsService.createPermission(creator, {
            userGroupId         : group.id,
            userId              : newMember.id,
            canManageTasks      : false,
            canManageUsers      : false,
            canChangePermissions: false
        });
    }
};