const Models      = require('../models/index');
const {UserGroup} = Models;

module.exports = {

    errors: {
        GROUP_NOT_FOUND: 'group not found',
        UNAUTHORIZED   : 'user not authorized'
    },

    async getAllGroups() {
        return await UserGroup.findAll({
            include: [{
                model: Models.User,
                as   : 'createdBy'
            }]
        });
    },

    async createGroup(groupData) {
        return await UserGroup.create({
            ...groupData,
            createdById: groupData.createdBy.id
        });
    },

    async getGroupById(id) {
        const group = await UserGroup.findOne({
            where: {
                id
            }
        }, {
            include: [{
                model: Models.User,
                as   : 'createdBy'
            }]
        });

        if (group == null) {
            throw new Error(this.errors.GROUP_NOT_FOUND);
        }

        return group;
    },

    async deleteById(user, id) {
        const group = await this.getGroupById(id);

        if(group.createdById !== user.id) {
            throw new Error(this.errors.UNAUTHORIZED);
        }

        await group.destroy();
    }
};