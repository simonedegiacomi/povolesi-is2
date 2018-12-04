const bcrypt       = require('bcrypt');
const randomstring = require("randomstring");

const {sequelize, User} = require('../models/index');

const BCRYPT_SALT_RAUNDS = 10;

module.exports = {

    errors: {
        EMAIL_ALREADY_IN_USE       : "email already in use",
        BADGE_NUMBER_ALREADY_IN_USE: "badge number already in use",
        PASSWORD_TOO_SHORT         : "password too short",

        INVALID_CREDENTIALS: "invalid credentials"
    },

    constants: {
        MIN_PASSWORD_LENGTH: 6
    },

    async registerUser(user) {
        if (user.password.length < this.constants.MIN_PASSWORD_LENGTH) {
            throw new Error(this.errors.EMAIL_ALREADY_IN_USE);
        }

        user.password  = await bcrypt.hash(user.password, BCRYPT_SALT_RAUNDS);
        user.authToken = this._generateToken();

        try {
            return await User.create(user);
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

    updateUserEmail (user, newEmail) {
        return user.update({
            email: newEmail
        });
    },

    updateUserData (user, newName, newBadgeNumber) {
        return user.update({
            name: newName,
            badgeNumber: newBadgeNumber
        })
    }

};
