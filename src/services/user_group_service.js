const {UserGroup} = require('../models/index');

module.exports = {
    async getAllGroups() {
        return await UserGroup.findAll()
    },

    async createGroup(group) {
        return await UserGroup.create(group);
    }
};