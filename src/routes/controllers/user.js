const Joi         = require('joi');
const UserService = require('../../services/user');
const ErrorMapper = require('./error_mapper');

const userSchema = Joi.object().keys({
    name       : Joi.string().min(3).max(30).required(),
    email      : Joi.string().email().required(),
    badgeNumber: Joi.string().min(1).max(45).required(),
    password   : Joi.string().required()
});

const loginSchema = Joi.object().keys({
    email   : Joi.string().email().required(),
    password: Joi.string().required()
});

module.exports = {

    register: function (req, res) {
        const {error, value} = Joi.validate(req.body, userSchema);

        if (error != null) {
            return res.status(400).send({
                errorMessage: error.details[0].message
            });
        }

        return UserService.registerUser(value)
            .then(user => res.status(201).send({
                userId: user.id,
                token : user.authToken
            }))
            .catch(error => ErrorMapper.map(res, error, [{
                error: UserService.errors.EMAIL_ALREADY_IN_USE,
                status : 409
            }, {
                error: UserService.errors.BADGE_NUMBER_ALREADY_IN_USE,
                status : 409
            }, {
                error: UserService.errors.PASSWORD_TOO_SHORT,
                status : 400
            }]))
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
            .catch(error => ErrorMapper.map(res, error, [{
                error: UserService.errors.INVALID_CREDENTIALS,
                status : 400
            }]));
    },

    getAllUsers: async function (req, res) {
        const users = await UserService.getAllUsers();

        res.status(200).send(users);
    }
};