const {User, UserGroup, UserPermission, Task} = require('../../models');

module.exports = {
    mapUser(model) {
        if (!(model instanceof User)) {
            throw new Error('first argument is not an instance of User');
        }

        return {
            id: model.id,
            name: model.name,
            email: model.email,
            badgeNumber: model.badgeNumber
        }
    },

    async mapUserGroup(group) {
        if(!(group instanceof UserGroup)) {
            throw new Error('first argument is not an instance of UserGroup');
        }

        const createdBy = await group.getCreatedBy();

        return {
            id: group.id,
            name: group.name,
            createdBy: this.mapUser(createdBy)
        }
    },

    mapUserPermission(model) {
        if(!(model instanceof UserPermission)) {
            throw new Error('first argument is not an instance of UserPermission');
        }

        return model.toJSON()
    },

    mapTask(model) {
        if(!(model instanceof Task)) {
            throw new Error('first argument is not an instance of Task');
        }

        return model.toJSON();
    }
};