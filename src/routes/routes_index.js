'use strict';

const express = require('express');

const userController = require('./controllers/user_controller');
const userGroupsController = require('./controllers/user_group_controller');
const taskPoolController = require('./controllers/task_pools_controller');
const userPermissionsController = require('./controllers/user_permissions_controller');

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

    // /user
    router.get('/users/me', userController.getCurrentUserData);
    router.put('/users/me', userController.updateUserData);
    router.put('/users/me/email', userController.updateEmail);
    router.get('/users/:id', userController.getUserById);

    // /user-groups
    router.get('/user-groups', userGroupsController.getAllGroups);
    router.post('/user-groups', userGroupsController.createUserGroup);
    router.get('/user-groups/:id', userGroupsController.getGroupById);
    router.delete('/user-groups/:id', userGroupsController.deleteGroupById);

    // /user-permissions
    router.post('/user-permissions', userPermissionsController.createPermission);
    router.delete('/user-permissions/:id', userPermissionsController.deletePermissionById);

    // /task-pools
    router.get('/task-pools', taskPoolController.getTaskPool);

    app.use('/api/v1', router);
}