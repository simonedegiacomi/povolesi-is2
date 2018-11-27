const User = require('../../models/user').User;
const authenticationMiddleware = require('../middlewares/authentication');

module.exports = {
    me: function (req, res) {
        res.status(200).send({
            id: req.user.id,
            name: req.user.name,
            badgeNumber: req.user.badgeNumber,
            email: req.user.email
        });
    }
}