'use strict';

const userController = require('./controllers/user');

const express = require('express');

module.exports = (app) => {

    setupUnauthenticatedRoutes(app);
    setupAuthenticatedRoutes(app);

};

function setupUnauthenticatedRoutes (app) {
    const router = express.Router();

    router.post('/register', userController.register);
    router.get('/login', userController.login);

    app.use('/api/v1', router);
}

function setupAuthenticatedRoutes (app) {
    const router = express.Router();

    app.use('/api/v1', router);
}