const Joi         = require('joi');
const UserService = require('../../services/user_service');
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

const updateEmailSchema = Joi.object().keys({
    newEmail: Joi.string().email()
});

const updateUserDataSchema = Joi.object().keys({
    newName       : Joi.string().min(3).max(30).required(),
    newBadgeNumber: Joi.string().min(1).max(45).required()
});

module.exports = {

    async register(req, res) {
        const {error, value} = Joi.validate(req.body, userSchema);

        if (error != null) {
            return res.status(400).send({
                errorMessage: error.details[0].message
            });
        }

        try {
            const user = await UserService.registerUser(value);
            res.status(201).send({
                userId: user.id,
                token : user.authToken
            });
        } catch (e) {
            ErrorMapper.map(res, e, [{
                error : UserService.errors.EMAIL_ALREADY_IN_USE,
                status: 409
            }, {
                error : UserService.errors.BADGE_NUMBER_ALREADY_IN_USE,
                status: 409
            }, {
                error : UserService.errors.PASSWORD_TOO_SHORT,
                status: 400
            }]);
        }
    },

    async login(req, res) {
        const {error, value} = Joi.validate(req.body, loginSchema);

        if (error != null) {
            return res.status(400).send({
                errorMessage: error.details[0].message
            });
        }

        try {
            const user = await UserService.loginUser(value.email, value.password);
            res.status(200).send({
                userId: user.id,
                token : user.authToken
            });
        } catch (e) {
            ErrorMapper.map(res, e, [{
                error : UserService.errors.INVALID_CREDENTIALS,
                status: 400
            }]);
        }
    },

    getAllUsers: async function (req, res) {

        const users = await UserService.getAllUsers();

        let userFilter = []

        users.map(u => userFilter
            .push({name:u.name,
                email:u.email,
                badgeNumber:u.badgeNumber})
        );

        res.status(200).send(userFilter)
    },

    updateEmail(req, res) {
        const {error, value} = Joi.validate(req.body, updateEmailSchema);

        if (error != null) {
            return res.status(400).send({
                errorMessage: error.details[0].message
            });
        }

        return UserService.updateUserEmail(req.user, value.newEmail)
            .then(() => res.status(200).send())
            .catch(error => ErrorMapper.map(res, error, [{
                error : UserService.errors.EMAIL_ALREADY_IN_USE,
                status: 409
            }]))
    },

    getCurrentUserData: function (req, res) {
        const json = req.user;
        res.status(200).send({
            id: json.id,
            name: json.name,
            badgeNumber: json.badgeNumber,
            email: json.email
        });
    },

    updateUserData: function (req, res) {
        const {error, value} = Joi.validate(req.body, updateUserDataSchema);

        if (error != null) {
            return res.status(400).send({
                errorMessage: error.details[0].message
            });
        }

        return UserService.updateUserData(req.user, value.newName, value.newBadgeNumber)
            .then(() => res.status(204).send());
    }
};