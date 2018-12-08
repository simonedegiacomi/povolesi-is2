const {TaskPool, User, Task, Group, UserPermission, TaskDraw, Assignment} = require('../models/index');
const Utils = require('../utils/task_pool_utils')












module.exports = {

    errors: {
        NO_CREATOR_SPECIFIED: "no creator specified",

        NO_NAME: "task pool have no name",
        USER_NOT_EXIST: "user not exist",
        TASK_NOT_EXIST: "tasks not exist",

        TASK_POOL_ID_IS_NO_CORRECT: "taskPoolId is no correct",
        YOU_CANT_MANAGE_THIS_TASKPOOL: "you can't manage this task pool"
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


    async getMyTaskPool(userMe) {

        if (!(await Utils.isUserExist(userMe))) {
            throw new Error(this.errors.USER_NOT_EXIST);
        }

        //TODO: insert the correct query simo sotto ho lasciato la mezzza query che avevi fatto commentata
        //query SELECT * WHERE user=userMe

        return await TaskPool.findAll({
            where: {
                createdById: userMe.id
            },
            include: [{
                model: Task,
                as: 'tasks'
            }]
        });
    },

    async canManageThisTaskPool(taskPoolId, userId){
        const myTaskPools = await this.getMyTaskPool(await Utils.getUserById(userId));

        for(let t of myTaskPools){
            if(t.id === taskPoolId)
                return true;
        }

        return false;
    },

    async getTaskPoolById(taskPoolId,userId){
        if(!(await Utils.isUserExist( await Utils.getUserById(userId) ))) {
            throw new Error(this.errors.USER_NOT_EXIST);
        } else if(!(await Utils.isTaskPoolIdExist(taskPoolId))){
            throw new Error(this.errors.TASK_POOL_ID_IS_NO_CORRECT);
        } else if(!(await this.canManageThisTaskPool(taskPoolId,userId))) {
            throw new Error(this.errors.YOU_CANT_MANAGE_THIS_TASKPOOL);
        }

        try {
            //const taskPool = await Utils.getTaskPoolByIdWithoutControl(taskPoolId);

            return await TaskPool.findOne({
                where: {
                    id: taskPoolId
                },
                include: [{
                    model: Task,
                    as: 'tasks'
                }]
            });

        } catch (e) {
            console.log("error");
            throw e;
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