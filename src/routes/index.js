'use strict';

const express = require('express');

const userController = require('./controllers/user');

const authenticationMiddleware = require('./middlewares/authentication');

module.exports = (app) => {

    setupUnauthenticatedRoutes(app);
    setupAuthenticatedRoutes(app);

};

function setupUnauthenticatedRoutes (app) {
    const router = express.Router();

    router.post('/register', userController.register);
    router.post('/login', userController.login);

    app.use('/api/v1', router);
}

function setupAuthenticatedRoutes (app) {
    const router = express.Router();

    router.use(authenticationMiddleware);

    router.get('/secure', (req, res) => res.status(200).send(`Hi ${req.user.name}!`));

    app.use('/api/v1', router);
}