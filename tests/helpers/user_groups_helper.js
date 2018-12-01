const UserGroupService = require('../../src/services/user_group_service');

module.exports = {

    async createGroup(groupName = "Group name") {
        return await UserGroupService.createGroup({
            'name': groupName
        });
    }
};
