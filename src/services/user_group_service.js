const {UserGroup} = require('../models/index');

module.exports = {
    async getAllGroups() {
        return await UserGroup.findAll()
    },

    async createGroup(groupData) {
        const group = UserGroup.build(groupData);

        try {
            group.setCreatedBy(groupData.owner);

            await group.save();
        } catch (e) {
            console.error(e);
            return null;
        }
        return group;
    }
};