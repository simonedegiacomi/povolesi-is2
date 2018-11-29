'use strict';

const User = require('../../models/index').User;

module.exports = async function (req, res, next) {
    const token = req.header('X-API-TOKEN');
    if (token == null) {
        return res.status(401).send({
            'errorMessage': "Header 'X-API-TOKEN' is missing, therefore you're not authenticated"
        })
    }

    const user = await User.findOne({
        where: {
            authToken: token
        }
    });


    if (user == null) {
        return res.status(401).send({
            'errorMessage': "Invalid authentication token"
        });
    }

    req.user = user;

    next();
};
