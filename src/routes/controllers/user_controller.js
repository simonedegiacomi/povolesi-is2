const Joi          = require('joi');
const UserService  = require('../../services/user_service');
const ErrorMapper  = require('./error_mapper');
const ModelsMapper = require('./models_mapper');

//TODO: move to service
const updateEmailSchema = Joi.object().keys({
    newEmail: Joi.string().email().required()
});

module.exports = {

    async register(req, res) {
        try {
            const user = await UserService.registerUser(req.body);
            res.status(201).send({
                userId: user.id,
                token: user.authToken
            });
        } catch (e) {
            ErrorMapper.map(res, e, [{
                error: UserService.errors.EMAIL_ALREADY_IN_USE,
                status: 409
            }, {
                error: UserService.errors.BADGE_NUMBER_ALREADY_IN_USE,
                status: 409
            }, {
                error: UserService.errors.PASSWORD_TOO_SHORT,
                status: 400
            }]);
        }
    },

    async login(req, res) {
        const credentials = req.body;

        if (!credentials.email || !credentials.password) {
            return res.status(400).send({
                errorMessage: 'Missing username or password'
            });
        }

        try {
            const user = await UserService.loginUser(credentials.email, credentials.password);
            res.status(200).send({
                userId: user.id,
                token: user.authToken
            });
        } catch (e) {
            ErrorMapper.map(res, e, [{
                error: UserService.errors.INVALID_CREDENTIALS,
                status: 400
            }]);
        }
    },

    getAllUsers: async function (req, res) {
        const users = await UserService.getAllUsers();
        res.status(200).send(users.map(u => ModelsMapper.mapUser(u)));
    },

    async updateEmail(req, res) {
        const {error, value} = Joi.validate(req.body, updateEmailSchema);

        if (error != null) {
            return res.status(400).send({
                errorMessage: error.details[0].message
            });
        }

        try {
            await UserService.updateUserEmail(req.user.id, value.newEmail);
            res.status(200).send();
        } catch (e) {
            ErrorMapper.map(res, e, [{
                error: UserService.errors.EMAIL_ALREADY_IN_USE,
                status: 409
            }, {
                error: UserService.errors.INVALID_EMAIL,
                status: 400
            }])
        }
    },

    getCurrentUserData(req, res) {
        res.status(200).send(ModelsMapper.mapUser(req.user));
    },

    async updateUserData(req, res) {
        try {
            await UserService.updateUserData(req.user.id, req.body);
            res.status(204).send();
        } catch (e) {
            ErrorMapper.map(res, e, [{
                error: UserService.errors.BADGE_NUMBER_ALREADY_IN_USE,
                status: 409
            }]);
        }
    },

    async getUserById(req, res) {
        const id = req.params.id;

        try {
            const user = await UserService.getUserById(id);
            const json  = await ModelsMapper.mapUser(user);
            res.send(json);
        } catch (e) {
            ErrorMapper.map(res, e, [{
                error : UserService.errors.USER_NOT_FOUND,
                status: 404
            }]);
        }
    },

    async updateUserPassword(req, res) {
        try {
            await UserService.updateUserPassword(req.user.id, req.body.newPassword);
            res.status(204).send();
        } catch (e) {
            ErrorMapper.map(res, e, [{
                error: UserService.errors.PASSWORD_TOO_SHORT,
                status: 400
            }]);
        }
    }
};