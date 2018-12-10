const {TaskPool, User, Task, UserPermission, Assignment, UserGroup} = require('../models/index');
const Joi = require('joi');
const SchemaUtils = require('../utils/schema_utils');

const taskPoolSchema = Joi.object().keys({
    name: Joi.string().required(),
    createdById: Joi.number().integer().required(),
    tasks: Joi.array().items(Joi.number().integer()).required(),
    numQuestionsToDraw: Joi.number().integer().required()
});

module.exports = {

    errors: {
        TASK_NOT_FOUND: 'one of the tasks doesn\'t exist',
        NUM_QUESTIONS_TO_DRAW_TOO_HIGH: 'numQuestionsToDraw is greater than the number of tasks',
        TASK_POOL_NOT_FOUND: 'task pool not found'
    },


    /**
     * Return true if the user is allowed to edit the specified TaskPool
     * @param taskPoolId
     * @param userId
     * @returns {Promise<boolean>}
     */
    async canManageTaskPoolById(taskPoolId, userId) {
        const userTaskPools = await this.getTaskPoolsByUserId(userId);

        // TODO: Do not load all the taskPools
        return userTaskPools.some(taskPool => taskPool.id === taskPoolId);
    },

    async createTaskPool(taskPool) {
        SchemaUtils.validateSchemaOrThrowArgumentError(taskPool, taskPoolSchema);
        this.validateNumQuestionsToDrawOrThrowArgumentError(taskPool);

        const createdTaskPool = await TaskPool.create(taskPool);

        try {
            await createdTaskPool.setTasks(taskPool.tasks);
        } catch (e) {
            throw new Error(this.errors.TASK_NOT_FOUND);
        }

        return createdTaskPool;
    },

    validateNumQuestionsToDrawOrThrowArgumentError(taskPool) {
        if (taskPool.numQuestionsToDraw > taskPool.tasks.length) {
            throw new Error(this.errors.NUM_QUESTIONS_TO_DRAW_TOO_HIGH);
        }
    },

    /**
     * Return all the TaskPools that the user created and can edit. A user can edit all the TaskPools in an assignment
     * assigned to a group in which the user has the 'canManageTasks' permission.
     * @param userId
     * @returns {Promise<Array<Model>>}
     */
    async getTaskPoolsByUserId(userId) {
        // We need to eagerly fetch the Tasks of the TaskPools
        const taskInclude = {
            model: Task,
            as: 'tasks'
        };

        const createdTaskPools = await TaskPool.findAll({
            where: {createdById: userId},
            include: taskInclude
        });


        const taskPoolsInAssignmentsCreatedByUser = await TaskPool.findAll({
            include: [{
                model: Assignment,
                as: 'assignment',
                where: {createdById: userId}
            }, taskInclude]
        });

        const taskPoolsInAssignmentsAssignedToGroupCreatedByUser = await TaskPool.findAll({
            include: [{
                model: Assignment,
                as: 'assignment',
                required: true,
                include: [{
                    model: UserGroup,
                    as: 'assignedUserGroup',
                    include: [{
                        model: User,
                        as: 'createdBy',
                        where: {id: userId}
                    }]
                }]
            },]
        });

        const taskPoolsInAssignmentsAssignedToGroupWhereTheUserHasEditTasksPermission = await TaskPool.findAll({
            include: [{
                model: Assignment,
                as: 'assignment',
                required: true,
                include: [{
                    model: UserGroup,
                    as: 'assignedUserGroup',
                    include: [{
                        model: UserPermission,
                        where: {
                            userId,
                            canManageTasks: true
                        }
                    }]
                }]
            }, taskInclude]
        });

        const allPools = createdTaskPools.concat(
            taskPoolsInAssignmentsCreatedByUser,
            taskPoolsInAssignmentsAssignedToGroupCreatedByUser,
            taskPoolsInAssignmentsAssignedToGroupWhereTheUserHasEditTasksPermission
        );

        const distinctPools = {};
        allPools.forEach(pool => distinctPools[pool.id] = pool);
        return Object.values(distinctPools);
    },

    async getTaskPoolById(taskPoolId, userId) {
        // TODO: Implement
    }


};

//query SELECT * WHERE user=userMe
/*
const jsonArray = await Assignment.findAll({

    where: {},

    include: [
        {
            model: Group,
            include: [{
                model: UserPermission,
                include: [{
                    model: User
                }]
            }]
        }, {
            model: TaskDraw,
            include: [{
                model: TaskPool
            }]
        }
    ]
});*/