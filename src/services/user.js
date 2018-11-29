const bcrypt       = require('bcrypt');
const randomstring = require("randomstring");

const {sequelize, User} = require('../models/index');

const BCRYPT_SALT_RAUNDS = 10;

module.exports = {

    errors: {
        EMAIL_ALREADY_IN_USE: "email already in use",
        PASSWORD_TOO_SHORT  : "password too short",

        INVALID_CREDENTIALS: "invalid credentials"
    },

    constants: {
        MIN_PASSWORD_LENGTH: 6
    },

    registerUser(user) {
        if (user.password.length < this.constants.MIN_PASSWORD_LENGTH) {
            throw new Error(this.errors.PASSWORD_TOO_SHORT);
        }

        return bcrypt.hash(user.password, BCRYPT_SALT_RAUNDS)
            .then(hash => {
                user.password  = hash;
                user.authToken = this._generateToken();

                return User.create(user)
            })
            .catch((error) => {
                if (error instanceof sequelize.UniqueConstraintError) {
                    throw new Error(this.errors.EMAIL_ALREADY_IN_USE);
                } else {
                    throw error;
                }
            });
    },

    loginUser(email, password) {
        return User.find({
            where: {
                email
            }
        }).then(user => {
            if (user == null) {
                throw new Error(this.errors.INVALID_CREDENTIALS);
            }

            return bcrypt.compare(password, user.password)
                .then(equals => {
                    if (!equals) {
                        throw new Error(this.errors.INVALID_CREDENTIALS);
                    }

                    user.update({
                        authToken: this._generateToken()
                    });

                    return user;
                });
        });
    },

    _generateToken(){
        return randomstring.generate({
            length: 40
        });
    },

    //don't need any control of error because there is no problem
    getAllUsers(){
        return User.findAll()
    }

};
