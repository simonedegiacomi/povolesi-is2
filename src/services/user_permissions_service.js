const {sequelize, User, UserPermission, UserGroup} = require('../models');

module.exports = {

    errors: {
        UNAUTHORIZED       : 'user is not authorized',
        USER_ALREADY_MEMBER: 'the user that you want to add is already a member of the specified group',
        WRONG_ARGUMENTS    : 'wrong argument number or type',
        GROUP_NOT_FOUND    : 'group not found'
    },

    async createPermission(inviter, permission) {
        if (!inviter instanceof User) {
            throw new Error(this.errors.WRONG_ARGUMENTS);
        }
        if (!permission || !permission.userId || !permission.userGroupId) {
            throw new Error(this.errors.WRONG_ARGUMENTS);
        }

        const group = await UserGroup.findOne({
            where: {id: permission.userGroupId}
        });
        if (group == null) {
            throw new Error(this.errors.GROUP_NOT_FOUND);
        }

        const hasPermission = await this._canUserManageGroupUsers(inviter, group);
        if (!hasPermission) {
            throw new Error(this.errors.UNAUTHORIZED);
        }

        try {
            return await UserPermission.create({
                userId              : permission.userId,
                userGroupId         : permission.userGroupId,
                canManageTasks      : permission.canManageTasks || false,
                canManageUsers      : permission.canManageUsers || false,
                canChangePermissions: permission.canChangePermissions || false
            });
        } catch (e) {
            if (this._isDuplicateMemberError(e)) {
                throw new Error(this.errors.USER_ALREADY_MEMBER);
            }

            // TODO: Check if wrong user or group

            throw e;
        }
    },

    async _canUserManageGroupUsers(user, group) {
        if (user.id === group.createdById) {
            return true;
        }

        const permission = await UserPermission.findOne({
            where: {
                userId     : user.id,
                userGroupId: group.id
            }
        });
        if (permission == null) {
            return false;
        }

        return permission.canManageUsers;
    },

    _isDuplicateMemberError(e) {
        if (e instanceof sequelize.UniqueConstraintError && e.errors.length === 2) {
            const errors = e.errors;
            return errors.some(e => e.path === 'userId') &&
                errors.some(e => e.path === 'userGroupId');
        }

        return false;
    }
};
