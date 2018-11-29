const Joi         = require('joi');
const UserGroupService = require('../../services/user_group_service');

const groupSchema = Joi.object().keys({
    name : Joi.string().min(3).max(200).required()
});


module.exports = {
    getAllGroups: function (req, res) {
        UserGroupService.getAllGroups()
            .then(groups => res.status(200).send(groups));
    },

    createUserGroup: function(req, res) {
        const {error, value} = Joi.validate(req.body, groupSchema);

        if (error != null) {
            return res.status(400).send({
                errorMessage: "The name of the group must be between 3 and 200 characters long."
            });
        }

        //TODO: check if the user actually has the permission to do so
        UserGroupService.createGroup(value)
            .then(group => res.status(201).send({
                groupId: group.id
            }))
            .catch(error => {
                res.status(500).send({
                    errorMessage: error.message
                })
            });
    }
};