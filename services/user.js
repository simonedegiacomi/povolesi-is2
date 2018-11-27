const bcrypt       = require('bcrypt');
const randomstring = require("randomstring");

const {sequelize, User} = require('../models');

const BCRYPT_SALT_RAUNDS = 10;

module.exports = {
    registerUser(user) {
       /* if (!user.password || user.password.length < 6) {
            return res.status(400).send({
                errorMessage: "Field 'password' is missing or it's too short (at least 6 characters)"
            });
        }*/

        return bcrypt.hash(user.password, BCRYPT_SALT_RAUNDS)
            .then(hash => {
                user.password  = hash;
                user.authToken = this._generateToken();

                return User.create(user)
            })
            /*.catch((error) => {
                if (error instanceof sequelize.UniqueConstraintError) {
                    res.status(409).send();
                } else {
                    res.status(500).send();
                }
            });*/
    },

    _generateToken() {
        return randomstring.generate({
            length: 40
        });
    }
};