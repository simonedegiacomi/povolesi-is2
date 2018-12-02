const {UserGroup} = require('../models/index');

module.exports = {
    async getAllGroups() {
        return await UserGroup.findAll()
    },

    async createGroup(groupData) {
        const group = UserGroup.build(groupData);

        try {

            await group.save();

            await group.setCreatedBy(groupData.createdBy);

        } catch (e) {
            console.error(e);
            return null;
        }
        return group;
    }
};