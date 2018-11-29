'use strict';

const User = require('../../models/index').User;

module.exports = function (req, res, next) {
    const token = req.header('X-API-TOKEN');

    if (token == null) {
        return res.status(401).send({
            'errorMessage': "Header 'X-API-TOKEN' is missing, therefore you're not authenticated"
        })
    }

    User.find({
        where: {
            authToken: token
        }
    }).then(user => {
        if (user == null) {
            return res.status(401).send({
                'errorMessage': "Invalid authentication token"
            });
        }

        req.user = user;

        next();
    })

};
