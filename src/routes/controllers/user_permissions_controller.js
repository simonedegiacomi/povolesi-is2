const Joi = require('joi');

const UserPermissionsService = require('../../services/user_permissions_service');
const ErrorMapper            = require('./error_mapper');
const ModelsMapper            = require('./models_mapper');

const permissionSchema = Joi.object().keys({
    userId: Joi.number().integer().required(),
    userGroupId: Joi.number().integer().required(),

    canManageTasks      : Joi.boolean().required(),
    canManageUsers      : Joi.boolean().required(),
    canChangePermissions: Joi.boolean().required()
});

module.exports = {

    async getPermissionListByGroup(req, res) {
        if (req.query.groupId == null) {
            return res.status(400).send({
                errorMessage: error.details[0].message
            });
        }

        try {
            const permissionList = await UserPermissionsService.getPermissionListByGroup(req.user, req.query.groupId);
            res.status(200).send(permissionList)
        } catch (e) {
            ErrorMapper.map(res, e, [{
                error: UserPermissionsService.errors.UNAUTHORIZED,
                status: 403
            }])
        }
    },

    async createPermission(req, res) {
        const {error, value} = Joi.validate(req.body, permissionSchema);

        if (error != null) {
            return res.status(400).send({
                errorMessage: error.details[0].message
            });
        }

        try {
            const permission = await UserPermissionsService.createPermission(req.user, value);
            res.status(201).send(ModelsMapper.mapUserPermission(permission));
        } catch (e) {
            ErrorMapper.map(res, e, [{
                error : UserPermissionsService.errors.USER_ALREADY_MEMBER,
                status: 409
            }, {
                error : UserPermissionsService.errors.UNAUTHORIZED,
                status: 403
            }]);
        }
    },


    async deletePermissionById (req, res) {
        const id = req.params.id;

        try {
            await UserPermissionsService.deletePermissionById(req.user, id);
            res.status(200).send();
        } catch (e) {
            ErrorMapper.map(res, e, [{
                error : UserPermissionsService.errors.USER_PERMISSION_NOT_FOUND,
                status: 404
            }, {
                error : UserPermissionsService.errors.UNAUTHORIZED,
                status: 403
            }]);
        }
    }

};