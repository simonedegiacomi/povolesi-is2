'use strict';

const express = require('express');

const userController = require('./controllers/user');
const userOperationsController = require('./controllers/user-operations');
const userGroupsController = require('./controllers/user_group');

const authenticationMiddleware = require('./middlewares/authentication');

module.exports = (app) => {
    setupUnauthenticatedRoutes(app);
    setupAuthenticatedRoutes(app);
};

function setupUnauthenticatedRoutes (app) {
    const router = express.Router();

    router.get('/', (req, res) => res.status(200).send(`Welcome`));
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
    
<<<<<<< HEAD:src/routes/index.js
    router.get('/secure', (req, res) => res.status(200).send(`Hi ${req.user.name}!`));
    router.get('/user/me', userOperationsController.getCurrentUserData);
    router.put('/user/me', userOperationsController.updateCurrentUserData);
=======
    router.put('/users/me/email', userController.updateEmail);
>>>>>>> develop:src/routes/routes_index.js

    app.use('/api/v1', router);
}