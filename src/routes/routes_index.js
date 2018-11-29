'use strict';

const express = require('express');

const userController       = require('./controllers/user_controller');
const userGroupsController = require('./controllers/user_group_controller');

const authenticationMiddleware = require('./middlewares/authentication');

module.exports = (app) => {
    setupUnauthenticatedRoutes(app);
    setupAuthenticatedRoutes(app);
};

function setupUnauthenticatedRoutes (app) {
    const router = express.Router();

    router.post('/register', userController.register);
    router.post('/login', userController.login);

    //TODO: sposta nell autheticated
    router.get('/users', userController.getAllUsers);

    router.get ('/groups', userGroupsController.getAllGroups);
    router.post('/groups', userGroupsController.createUserGroup);

    app.use('/api/v1', router);
}

function setupAuthenticatedRoutes (app) {
    const router = express.Router();

    router.use(authenticationMiddleware);
    
    router.put('/users/me/email', userController.updateEmail);

    app.use('/api/v1', router);
}