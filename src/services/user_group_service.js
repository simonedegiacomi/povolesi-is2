const Models      = require('../models/index');
const {UserGroup} = Models;

module.exports = {
    async getAllGroups() {
        return await UserGroup.findAll({
            include: [{
                model: Models.User,
                as: 'createdBy'
            }]
        })
    },

    async createGroup(groupData) {
        return await UserGroup.create({
            ...groupData,
            createdById: groupData.createdBy.id
        });
    }
};