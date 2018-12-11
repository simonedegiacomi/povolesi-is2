const bcrypt       = require('bcrypt');
const randomstring = require("randomstring");
const Joi = require('joi');

const {sequelize, User} = require('../models/index');
const ServiceUtils = require('../utils/schema_utils');
const assertIsEmail = require("./parameters_helper").assertIsEmail;
const assertIsNumber = require("./parameters_helper").assertIsNumber;

const BCRYPT_SALT_ROUNDS = 10;

const userSchema = Joi.object().keys({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    badgeNumber: Joi.string().min(1).max(45).required(),
    password: Joi.string().min(6).required()
});

const loginSchema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

const updateUserDataSchema = Joi.object().keys({
    name       : Joi.string().min(3).max(30).required(),
    badgeNumber: Joi.string().min(1).max(45).required()
});

module.exports = {

    errors: {
        EMAIL_ALREADY_IN_USE: "email already in use",
        BADGE_NUMBER_ALREADY_IN_USE: "badge number already in use",
        PASSWORD_TOO_SHORT: "password too short",

        INVALID_USER: "invalid user",
        INVALID_CREDENTIALS: "invalid credentials",
        INVALID_EMAIL: "\"value\" must be a valid email",
        USER_NOT_FOUND: "user not found"

    },

    async registerUser(data) {
        ServiceUtils.validateSchemaOrThrowArgumentError(data, userSchema);

        data.password = await bcrypt.hash(data.password, BCRYPT_SALT_ROUNDS);
        data.authToken = this._generateToken();

        try {
            return await User.create(data);
        } catch (ex) {
            if (ex instanceof sequelize.UniqueConstraintError) {
                const wrongField = ex.errors[0].path;
                if (wrongField === 'badgeNumber') {
                    throw new Error(this.errors.BADGE_NUMBER_ALREADY_IN_USE);
                } else if (wrongField === 'email') {
                    throw new Error(this.errors.EMAIL_ALREADY_IN_USE);
                }
            }

            throw ex;
        }
    },

    async loginUser(email, password) {
        ServiceUtils.validateSchemaOrThrowArgumentError({email, password}, loginSchema);

        const user = await User.findOne({
            where: {
                email
            }
        });

        if (user == null) {
            throw new Error(this.errors.INVALID_CREDENTIALS);
        }

        const equals = await bcrypt.compare(password, user.password);
        if (!equals) {
            throw new Error(this.errors.INVALID_CREDENTIALS);
        }

        await user.update({
            authToken: this._generateToken()
        });
        return user;
    },

    _generateToken() {
        return randomstring.generate({
            length: 40
        });
    },

    async getAllUsers() {
        return User.findAll()
    },

    async updateUserEmail(userId, newEmail) {
        assertIsNumber(userId);
        assertIsEmail(newEmail, this.errors.INVALID_EMAIL);

        try {
            return await User.update(
                { email: newEmail },
                { where: { id: userId }}
            );
        } catch (ex) {
            if (ex instanceof sequelize.UniqueConstraintError) {
                const wrongField = ex.errors[0].path;
                if (wrongField === 'email') {
                    throw new Error(this.errors.EMAIL_ALREADY_IN_USE);
                }
            }

            throw ex;
        }
    },

    async getUserById(userId) {
        const user = await User.findOne({
            where: {id: userId}
        });

        if (user == null) {
            throw new Error(this.errors.USER_NOT_FOUND);
        }

        return user;
    },

    async updateUserData (userId, newData) {
        ServiceUtils.validateSchemaOrThrowArgumentError(newData, updateUserDataSchema);

        const user = await this.getUserById(userId);

        try {
            return await user.update({
                name: newData.name,
                badgeNumber: newData.badgeNumber
            })
        } catch (e) {
            if (e instanceof sequelize.UniqueConstraintError) {
                const wrongField = e.errors[0].path;
                if (wrongField === 'badgeNumber') {
                    throw new Error(this.errors.BADGE_NUMBER_ALREADY_IN_USE);
                }
            }
            throw e;
        }
    },

    async updateUserPassword(userId, newPassword) {
        ServiceUtils.validateSchemaOrThrowArgumentError(newPassword, Joi.string().min(6).required());

        const user = await this.getUserById(userId);
        newPassword = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS);

        return await user.update({
            password: newPassword
        });
    }
};
