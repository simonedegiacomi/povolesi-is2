'use strict';

const validator    = require('validator');
const bcrypt       = require('bcrypt');
const randomstring = require("randomstring");

const BCRYPT_SALT_RAUNDS = 10;

const User = require('../../models').User;

function generateToken() {
    return randomstring.generate({
        length: 40
    });
}

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

        if (!json.password || json.password.length < 6) {
            return res.status(400).send({
                errorMessage: "Field 'password' is missing or it's too short (at least 6 characters)"
            });
        }

        bcrypt.hash(json.password, BCRYPT_SALT_RAUNDS)
            .then(hash => {
                json.password  = hash;
                json.authToken = generateToken();

                return User.create(json)
            })
            .then(user => {
                res.status(201).send({
                    userId: user.id,
                    token: user.authToken
                });
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


        User.find({
            where: {
                email: json.email
            }
        }).then(user => {
            if (user == null) {
                return res.status(400).send({
                    errorMessage: "Invalid credentials"
                });
            }

            bcrypt.compare(json.password, user.password)
                .then(equals => {
                    if (!equals) {
                        return res.status(400).send({
                            errorMessage: "Invalid credentials"
                        });
                    }

                    return user.update({
                        authToken: generateToken()
                    })
                })
                .then((user) => res.status(200).send({
                    userId: user.id,
                    token : user.authToken
                }));
        });
    }
};