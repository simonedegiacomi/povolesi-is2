const validator = require('validator');
const User = require('../../models/index').User;

module.exports = {
    getCurrentUserData: function (req, res) {
        const json = req.user;
        res.status(200).send({
            id: json.id,
            name: json.name,
            badgeNumber: json.badgeNumber,
            email: json.email
        });
    },

    updateCurrentUserData: function (req, res) {
        const json = req.body;

        if (!json.name || validator.isEmpty(json.name)) {
            return res.status(400).send({
                errorMessage: "Field 'name' is missing or it's empty"
            });
        }

        if (!json.badgeNumber || validator.isEmpty(json.badgeNumber)) {
            return res.status(400).send({
                errorMessage: "Field 'badgeNumber' is missing or it's empty"
            });
        }

        User.find({
            where: {
                id: req.user.id
            }
        }).then(user => {
            user.update({
                name: json.name,
                badgeNumber: json.badgeNumber
            }).then(() => res.status(204).send())
        })
    }
};