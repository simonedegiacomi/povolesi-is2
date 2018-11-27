const validator   = require('validator');
const UserService = require('../../services/user');


module.exports = {

    register: function (req, res) {
        const json = req.body;

        if (!json.name || validator.isEmpty(json.name)) {
            return res.status(400).send({
                errorMessage: "Field 'name' is missing or it's empty"
            });
        }

        if (!json.email || !validator.isEmail(json.email)) {
            return res.status(400).send({
                errorMessage: "Field 'email' is missing or it's not a valid email address"
            });
        }


        if (!json.badgeNumber || validator.isEmpty(json.badgeNumber)) {
            return res.status(400).send({
                errorMessage: "Field 'badgeNumber' is missing or it's empty"
            });
        }

        UserService.registerUser(json)
            .then(user => res.status(201).send({
                userId: user.id,
                token : user.authToken
            }))
            .catch(error => {
                switch (error.message) {
                    case UserService.errors.EMAIL_ALREADY_IN_USE:
                        res.status(409).send({
                            errorMessage: UserService.errors.EMAIL_ALREADY_IN_USE
                        });
                        break;

                    case UserService.errors.PASSWORD_TOO_SHORT:
                        res.status(400).send({
                            errorMessage: "Field 'password' is missing or it's too short (at least 6 characters)"
                        });
                        break;

                    default:
                        res.status(500).send();
                }
            });
    },

    login: function (req, res) {
        const json = req.body;

        if (!json.email) {
            return res.status(400).send({
                errorMessage: "Field 'email' is missing"
            });
        }

        if (!json.password) {
            return res.status(400).send({
                errorMessage: "Field 'password' is missing"
            });
        }

        UserService.loginUser(json.email, json.password)
            .then(user => res.status(200).send({
                userId: user.id,
                token : user.authToken
            }))
            .catch(error => {
                if (error.message === UserService.errors.INVALID_CREDENTIALS) {
                    return res.status(400).send({
                        errorMessage: UserService.errors.INVALID_CREDENTIALS
                    });
                } else {
                    return res.status(500).send();
                }
            });
    }
};