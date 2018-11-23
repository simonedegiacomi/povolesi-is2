'use strict';

const express = require('express');

const userController = require('./controllers/user');

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

    app.use('/api/v1', router);
}