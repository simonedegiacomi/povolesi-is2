module.exports = {
    mapUser(model) {
        return {
            name       : model.name,
            email      : model.email,
            badgeNumber: model.badgeNumber
        }
    },

    async mapUserGroup(group) {
        const createdBy = await group.getCreatedBy();

        return {
            id: group.id,
            name: group.name,
            createdBy: this.mapUser(createdBy)
        }
    }
};