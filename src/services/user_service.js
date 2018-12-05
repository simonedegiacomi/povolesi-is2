const bcrypt = require('bcrypt');
const randomstring = require("randomstring");
const Joi = require('joi');

const {sequelize, User} = require('../models/index');
const ArgumentError = require('./argument_error');

const BCRYPT_SALT_RAUNDS = 10;

const userSchema = Joi.object().keys({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    badgeNumber: Joi.string().min(1).max(45).required(),
    password: Joi.string().min(6).required()
});

module.exports = {

    errors: {
        EMAIL_ALREADY_IN_USE: "email already in use",
        BADGE_NUMBER_ALREADY_IN_USE: "badge number already in use",
        PASSWORD_TOO_SHORT: "password too short",

        INVALID_USER: "invalid user",
        INVALID_CREDENTIALS: "invalid credentials",
        INVALID_EMAIL: "\"value\" must be a valid email"
    },

    async registerUser(data) {
        const {error, value} = Joi.validate(data, userSchema);
        if (error != null) {
            throw new ArgumentError(error.details[0].message);
        }

        value.password = await bcrypt.hash(value.password, BCRYPT_SALT_RAUNDS);
        value.authToken = this._generateToken();

        try {
            return await User.create(value);
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

    getAllUsers() {
        return User.findAll()
    },

    async updateUserEmail(user, newEmail) {
        if (!(user instanceof User)) {
            throw new ArgumentError(this.errors.INVALID_USER);
        }

        const {error, value} = Joi.validate(newEmail, Joi.string().email().required());

        if (error != null) {
            throw new ArgumentError(error.details[0].message);
        }

        try {
            return await user.update({
                email: newEmail
            });
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

    updateUserData(user, newName, newBadgeNumber) {
        return user.update({
            name: newName,
            badgeNumber: newBadgeNumber
        })
    }

};
