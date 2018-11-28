const Joi         = require('joi');
const UserService = require('../../services/user');

const userSchema = Joi.object().keys({
    name       : Joi.string().min(3).max(30).required(),
    email      : Joi.string().email().required(),
    badgeNumber: Joi.string().min(1).max(45).required(),
    password   : Joi.string()
});

const loginSchema = Joi.object().keys({
    email   : Joi.string().email(),
    password: Joi.string()
});

module.exports = {

    register: function (req, res) {
        const {error, value} = Joi.validate(req.body, userSchema);

        if (error != null) {
            return res.status(400).send({
                errorMessage: error.details[0].message
            });
        }

        UserService.registerUser(value)
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
        const {error, value} = Joi.validate(req.body, loginSchema);

        if (error != null) {
            return res.status(400).send({
                errorMessage: error.details[0].message
            });
        }

        UserService.loginUser(value.email, value.password)
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
    },

    getAllUsers: async function (req, res) {
        var users =await UserService.getAllUsers()

        res.status(200).send(users);
    }
};