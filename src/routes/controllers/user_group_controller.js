const Joi              = require('joi');
const UserGroupService = require('../../services/user_group_service');
const ErrorMapper = require('./error_mapper');

const groupSchema = Joi.object().keys({
    name: Joi.string().min(3).max(200).required()
});


module.exports = {
    async getAllGroups (req, res) {
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
            const createdGroup = await UserGroupService.createGroup(value);
            res.status(201).send({
                userGroupId: createdGroup.id
            });
        } catch (e) {
            ErrorMapper.map(res, e, []);
        }
    }
};