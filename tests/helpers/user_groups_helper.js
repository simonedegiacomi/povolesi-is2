const UserGroupService = require('../../src/services/user_group_service');
const UserHelper = require('./user_helper');

module.exports = {

    async createGroup(groupName = "Group name") {
        return await UserGroupService.createGroup({
            name: groupName,
            createdBy: await UserHelper.insertNewRandom()
        });
    }
};
