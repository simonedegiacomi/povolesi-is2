const UserGroupService = require('../../src/services/user_group_service');
const UserHelper = require('./user_helper');
const UserPermissionHelper = require('./user_permission_helper');

module.exports = {

    async createGroup(groupName = "Group name") {
        return await UserGroupService.createGroup({
            name: groupName,
            createdBy: await UserHelper.insertNewRandom()
        });
    },

    async createGroupWithUser() {
        const group = await this.createGroup();
        const permission = await UserPermissionHelper.insertUserPermission(group);

        return {
            group,
            user: await permission.getUser()
        };
    }


};
