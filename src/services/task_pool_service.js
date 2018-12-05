const {TaskPool, User, Task, Group, UserPermission, TaskDraw, Assignment} = require('../models/index');

var isTaskExist = async function (task) {

    const fromDb = await Task.findOne({
        where:
            {id: task.id}
    });

    return fromDb !== null;
};

var isTasksExist = async function (tasks) {

    for (let t of tasks) {

        if (!(await isTaskExist(t)))
            return false;
    }

    return true;
};

var isUserExist = async function (user) {
    const fromDb = await User.findOne({
        where:
            {id: user.id}
    });

    return fromDb !== null;
};


module.exports = {

    errors: {
        NO_CREATOR_SPECIFIED: "no creator specified",

        NO_NAME: "task pool have no name",
        USER_NOT_EXIST: "user not exist",
        TASK_NOT_EXIST: "tasks not exist"
    },

    async createTaskPool(taskPool, tasks = []) {

        if (taskPool.name == null) {
            throw new Error(this.errors.NO_NAME);
        }
        else if (taskPool.createdBy == null) {
            throw new Error(this.errors.NO_CREATOR_SPECIFIED);
        } else if (!(await isTasksExist(tasks))) {
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

        if (!(await isUserExist(userMe))) {
            throw new Error(this.errors.USER_NOT_EXIST);
        }

        //TODO: insert the correct query simo
        //query SELECT * WHERE user=userMe

        const myTaskPools = await TaskPool.findAll({
            where: {
                createdById: userMe.id
            }
        });

        let jsonArrayResult = [];

        for(let t of myTaskPools){
            jsonArrayResult.push({
                ...t,
                tasks: await t.getTasks()
            })
        }

        return jsonArrayResult;
    },

    /*
    /!**
     * Anche quelli che posso maneggiare secondo l'user permission
     *!/
    async getTaskPool(userMe) {
        if (isUserExist(User)) {
            throw new Error(this.errors.USER_NOT_EXIST);
        }



        //TODO: miss a lot of helper for finish of implementation query
        //query SELECT * WHERE user=userMe
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
        });

        const jsonArray = [
            {
                "id": 0,
                "name": "string",
                "tasks": [
                    {
                        "id": 1234,
                        "question": "What is the meaning of life?",
                        "type": "multipleAnswer",
                        "multipleChoicesAllowed": true,
                        "choices": [
                            "Happiness",
                            "Balance",
                            42
                        ],
                        "maxLength": 0
                    }
                ],
                "createdBy": {
                    "id": 84,
                    "name": "Gianni Morandi",
                    "badgeNumber": 111244,
                    "email": "gianni@morandi.cit"
                }
            }
        ];


        return jsonArray
    },
*/

};