const {assertIsNumber, assertIsDefined}= require("./parameters_helper");
const {sequelize, UserPermission, UserGroup} = require('../models');

async function _canUserManageGroupUsers(userId, group) {
    if (userId === group.createdById) {
        return true;
    }

    const permission = await UserPermission.findOne({
        where: {
            userId: userId,
            userGroupId: group.id
        }
    });
    if (permission == null) {
        return false;
    }

    return permission.canManageUsers;
}

function _isDuplicateMemberError(e) {
    if (e instanceof sequelize.UniqueConstraintError && e.errors.length === 2) {
        const errors = e.errors;
        return errors.some(e => e.path === 'userId') &&
            errors.some(e => e.path === 'userGroupId');
    }

    return false;
}


module.exports = {

    errors: {
        UNAUTHORIZED: 'user is not authorized',
        USER_ALREADY_MEMBER: 'the user that you want to add is already a member of the specified group',
        WRONG_ARGUMENTS: 'wrong argument number or type',
        GROUP_NOT_FOUND: 'group not found',
        USER_PERMISSION_NOT_FOUND: 'user permission not found'
    },

    async createPermission(userId, permission) {
        assertIsNumber(userId);

        //TODO: use joi
        assertIsDefined(permission);
        assertIsNumber(permission.userId);
        assertIsNumber(permission.userGroupId);

        const group = await UserGroup.findOne({
            where: {id: permission.userGroupId}
        });
        if (group == null) {
            throw new Error(this.errors.GROUP_NOT_FOUND);
        }

        const hasPermission = await _canUserManageGroupUsers(userId, group);
        if (!hasPermission) {
            throw new Error(this.errors.UNAUTHORIZED);
        }

        try {
            return await UserPermission.create({
                userId: permission.userId,
                userGroupId: permission.userGroupId,
                canManageTasks: permission.canManageTasks || false,
                canManageUsers: permission.canManageUsers || false,
                canChangePermissions: permission.canChangePermissions || false
            });
        } catch (e) {
            if (_isDuplicateMemberError(e)) {
                throw new Error(this.errors.USER_ALREADY_MEMBER);
            }

            // TODO: Check if wrong user or group

            throw e;
        }
    },

    async deletePermissionById(userId, id) {
        assertIsNumber(userId);

        const permission = await this.getPermissionById(userId, id);
        await permission.destroy();

    },

    async getPermissionById(userId, id) {
        const permission = await UserPermission.findOne({
            where: {id}
        });

        if (permission == null) {
            throw new Error(this.errors.USER_PERMISSION_NOT_FOUND);
        }

        const group = await permission.getUserGroup();

        const performerHasPermission = await _canUserManageGroupUsers(userId, group);
        if (!performerHasPermission) {
            throw new Error(this.errors.UNAUTHORIZED);
        }

        return permission;
    },

    async getPermissionListByGroup(actionPerformerId, group) {
        if (group == null) {
            throw new Error(this.errors.GROUP_NOT_FOUND)
        }

        const permissionList =  await UserPermission.findAll({
            where: { userGroupId: group.id }
        });
        if (permissionList == null) {
            throw new Error(this.errors.GROUP_NOT_FOUND)
        }

        const performerHasPermission = await _canUserManageGroupUsers(actionPerformerId, group);
        if (!performerHasPermission) {
            throw new Error(this.errors.UNAUTHORIZED);
        }

        return permissionList;
    },

    async updateUserPermission(userId, permission, updatedPermission) {
        assertIsNumber(userId);

        //TODO: use joi
        assertIsDefined(permission);
        assertIsNumber(permission.userId);
        assertIsNumber(permission.userGroupId);

        const group = await UserGroup.findOne({
            where: {id: permission.userGroupId}
        });
        if (group == null) {
            throw new Error(this.errors.GROUP_NOT_FOUND);
        }

        const hasPermission = await _canUserManageGroupUsers(userId, group);
        if (!hasPermission) {
            throw new Error(this.errors.UNAUTHORIZED);
        }

        try {
            return await permission.update({
                userId              : updatedPermission.userId,
                userGroupId         : updatedPermission.userGroupId,
                canManageTasks      : updatedPermission.canManageTasks,
                canManageUsers      : updatedPermission.canManageUsers,
                canChangePermissions: updatedPermission.canChangePermissions
            });
        } catch (e) {
            if (_isDuplicateMemberError(e)) {
                throw new Error(this.errors.USER_ALREADY_MEMBER);
            }
            throw e;
        }
    }
};
