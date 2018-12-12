'use strict';

const express = require('express');

const userController = require('./controllers/user_controller');
const userGroupsController = require('./controllers/user_group_controller');
const taskPoolController = require('./controllers/task_pools_controller');
const userPermissionsController = require('./controllers/user_permissions_controller');
const taskController = require('./controllers/task_controller');
const assignmentController = require('./controllers/assignment_controller');
const taskAnswerController = require('./controllers/task_answer_controller');

const authenticationMiddleware = require('./middlewares/authentication');

module.exports = (app) => {
    setupUnauthenticatedRoutes(app);
    setupAuthenticatedRoutes(app);
};

function setupUnauthenticatedRoutes(app) {
    const router = express.Router();

    router.get('/', (req, res) => res.status(200).send(`Welcome`));
    router.post('/register', userController.register);
    router.post('/login', userController.login);

    //TODO: sposta nell autheticated
    router.get('/users', userController.getAllUsers);

    router.get('/groups', userGroupsController.getAllGroups);
    router.post('/groups', userGroupsController.createUserGroup);


    app.use('/api/v1', router);
}

function setupAuthenticatedRoutes(app) {
    const router = express.Router();

    router.use(authenticationMiddleware);

    // /user
    router.get('/users/me', userController.getCurrentUserData);
    router.get('/users/:id', userController.getUserById);
    router.put('/users/me', userController.updateUserData);
    router.put('/users/me/email', userController.updateEmail);
    router.put('/users/me/password', userController.updateUserPassword);
    router.get('/users/me/assignments', assignmentController.getAssignedAssignments);

    // /user-groups
    router.get('/user-groups', userGroupsController.getAllGroups);
    router.get('/user-groups/:id', userGroupsController.getGroupById);
    router.post('/user-groups', userGroupsController.createUserGroup);
    // TODO: PUT /user-groups/:id
    router.delete('/user-groups/:id', userGroupsController.deleteGroupById);

    // /user-permissions
    router.get('/user-permissions', userPermissionsController.getPermissionListByGroup);
    router.post('/user-permissions', userPermissionsController.createPermission);
    router.put('/user-permissions/:id', userPermissionsController.updatePermission);
    router.delete('/user-permissions/:id', userPermissionsController.deletePermissionById);

    // /tasks
    router.get('/tasks', taskController.getTasks);
    router.get('/tasks/:id', taskController.getTask);
    router.post('/tasks', taskController.createTask);
    // TODO: PUT /tasks/:id
    router.delete('/tasks/:id', taskController.deleteTask);

    // /task-pools
    router.get('/task-pools', taskPoolController.getTaskPool);
    router.get('/task-pools/:id', taskPoolController.getTaskPoolById);
    router.post('/task-pools', taskPoolController.postTaskPool);
    // TODO: PUT /task-pools/:id
    router.delete('/task-pools/:id', taskPoolController.deleteTaskPoolById);

    // /task-answers
    router.get('/task-answers', taskAnswerController.getTaskAnswerByUserIdAndAssignmentId);
    // TODO: GET /task-answers/{id}
    router.get('/task-answers/:id', taskAnswerController.getTaskAnswerById);
    router.post('/task-answers', taskAnswerController.postTaskAnswer);
    // TODO: PUT /task-answers/{id}
    // TODO: DELETE /task-answers/{id}

    // /assignments
    router.post('/assignments', assignmentController.postAssignment);


    app.use('/api/v1', router);
}
