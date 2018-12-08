const {TaskPool, User, Task, Group, UserPermission, TaskDraw, Assignment, UserGroup} = require('../models/index');
const Utils = require('../utils/task_pool_utils');
const {Op} = require('sequelize');


module.exports = {

    errors: {
        NO_CREATOR_SPECIFIED: "no creator specified",

        NO_NAME: "task pool have no name",
        USER_NOT_EXIST: "user not exist",
        TASK_NOT_EXIST: "tasks not exist",
        TASK_POOL_ID_IS_NO_CORRECT: "taskPoolId is no correct"
    },


    async canManageThisTaskPool(taskPoolId, userId) {
        const myTaskPools = await this.getMyTaskPool(userId);

        for (let t of myTaskPools) {
            if (t.id === taskPoolId)
                return true;
        }

        return false;
    },

    async createTaskPool(taskPool, tasks = []) {

        if (taskPool.name == null) {
            throw new Error(this.errors.NO_NAME);
        }
        else if (taskPool.createdBy == null) {
            throw new Error(this.errors.NO_CREATOR_SPECIFIED);
        } else if (!(await Utils.isTasksExist(tasks))) {
            throw new Error(this.errors.TASK_NOT_EXIST);
        }

        try {
            const createdTaskPool = await TaskPool.create({
                ...taskPool,
                createdById: taskPool.createdBy.id
            });
            createdTaskPool.createdBy = taskPool.createdBy;

            //aggiungo i task al taskPool creato
            await createdTaskPool.setTasks(tasks);

            return createdTaskPool;

        } catch (e) {
            throw e;
        }
    },

    /**
     * Return all the TaskPools that the user created and can edit. A user can edit all the TaskPools in an assignment
     * assigned to a group in which the user has the 'canManageTasks' permission.
     * @param userId
     * @returns {Promise<Array<Model>>}
     */
    async getMyTaskPool(userId) {
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
        /*
                return await TaskPool.findAll({
                    where: {
                        [Op.or]: [
                            {
                                '$User.createdBy'
                            }
                        ]
                    },
                    include: [
                        // eagerly fetch the Tasks of each TaskPool
                        {
                            model: Task,
                            as: 'tasks'
                        },

                        // LEFT JOIN the user table, to include the user if he created the TaskPool.
                        // This means that, if a TaskPool retrieved from this query has the createdBy equal to null, the user
                        // didn't create the TaskPool
                        {
                            model: User,
                            as: 'createdBy',
                            where: {
                                id: userId
                            },
                            required: false
                        },
                        {
                            model: Assignment,
                            as: 'assignment',
                            include: [
                                // Fetch the TaskPools in assignments that the user created
                                {
                                    model: User,
                                    where: {
                                        createdById: userId
                                    },
                                    required: false
                                },
                                {
                                    model: UserGroup,
                                    as: 'assignedUserGroup',
                                    include: [
                                        {
                                            model: UserPermission,
                                            where: {
                                                userId,
                                                canManageTasks: true
                                            },
                                            required: false
                                        },
                                        {
                                            model: User,
                                            required: false
                                        }
                                    ],
                                    required: false
                                }
                            ]
                        }
                    ]
                });*/
    },

    async getTaskPoolById(taskPoolId, userId) {
        if (!(await Utils.isTaskPoolIdExist(taskPoolId))) {
            throw new Error(this.errors.TASK_POOL_ID_IS_NO_CORRECT);
        } else if (!(await canManageThisTaskPool(taskPoolId, userId))) {
            //TODO: go over with this function
        }
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