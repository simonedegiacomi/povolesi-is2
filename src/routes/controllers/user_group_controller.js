const Joi = require('joi');
const UserGroupService = require('../../services/user_group_service');
const ErrorMapper = require('./error_mapper');
const ModelsMapper = require('./models_mapper');

const groupSchema = Joi.object().keys({
    name: Joi.string().min(3).max(200).required()
});


module.exports = {
    async getAllGroups(req, res) {
        const groups = await UserGroupService.getAllGroups();

        res.status(200).send(groups)
    },

    async createUserGroup(req, res) {
        const {error, value} = Joi.validate(req.body, groupSchema);

        if (error != null) {
            return res.status(400).send({
                errorMessage: "The name of the group must be between 3 and 200 characters long."
            });
        }

        try {
            value.createdBy = req.user;
            const createdGroup = await UserGroupService.createGroup(value);
            res.status(201).send({
                userGroupId: createdGroup.id
            });
        } catch (e) {
            ErrorMapper.map(res, e);
        }
    },

    async updateGroup(req, res) {
        const {error, value} = Joi.validate(req.body, groupSchema);
        if (error != null) {
            return res.status(400).send({
                errorMessage: "The body must contain the name of the group."
            });
        }

        try {
            await UserGroupService.updateGroup(req.params.id, value.name, req.user.id);
            res.status(201).send();
        } catch (e) {
            ErrorMapper.map(res, e, [{
                error: UserGroupService.errors.GROUP_NOT_FOUND,
                status: 404
            }, {
                error: UserGroupService.errors.UNAUTHORIZED,
                status: 403
            }]);
        }
    },

    async getGroupById(req, res) {
        const id = req.params.id;

        try {
            const group = await UserGroupService.getGroupById(id);
            const json  = await ModelsMapper.mapUserGroup(group);
            res.send(json);
        } catch (e) {
            ErrorMapper.map(res, e, [{
                error: UserGroupService.errors.GROUP_NOT_FOUND,
                status: 404
            }]);
        }
    },

    async deleteGroupById(req, res) {
        const id = req.params.id;

        try {
            await UserGroupService.deleteById(req.user, id);
            res.status(200).send();
        } catch (e) {
            ErrorMapper.map(res, e, [{
                error: UserGroupService.errors.GROUP_NOT_FOUND,
                status: 404
            }, {
                error: UserGroupService.errors.UNAUTHORIZED,
                status: 403
            }]);
        }
    }
};