const TaskPoolService = require('../../services/task_pool_service');
const Mapper = require('./models_mapper');
const ErrorMapper = require('./error_mapper');

module.exports = {
    async getTaskPool(req, res) {
        try {
            const tasksPool = await TaskPoolService.getMyTaskPool(req.user);
            res.status(200).send(Mapper.mapTaskPoolArray(tasksPool));
        } catch(e){
            ErrorMapper.map(res, e, [{
                error: TaskPoolService.errors.USER_NOT_EXIST,
                status: 409
            }]);
        }
    },

    async postTaskPool(req, res) {
        const value = req.body;
        const userMe = req.user;
        const tasks = req.body.tasks;

        try {
            let taskPoolCreated = await TaskPoolService.createTaskPool({
                name: value.name,
                numQuestionsToDraw: value.numQuestionsToDraw,
                createdBy: userMe
            }, tasks);
            res.status(201).send({ taskPoolId: taskPoolCreated.id})
        } catch(e) {
            res.status(401).send({message: e.message})
        }
    },

    async getTaskPoolById(req, res){
        const taskPoolId = parseInt(req.params.id);
        const userMeId = req.user.id;

        try{
            const taskPool = await TaskPoolService.getTaskPoolById(taskPoolId,userMeId);
            res.status(201).send(Mapper.mapTaskPool(taskPool))
        } catch(e) {
            ErrorMapper.map(res, e, [{
                error: TaskPoolService.errors.USER_NOT_EXIST,
                status: 409
                }, {
                error: TaskPoolService.errors.TASK_POOL_ID_IS_NO_CORRECT,
                status: 409
                }, {
                error: TaskPoolService.errors.YOU_CANT_MANAGE_THIS_TASKPOOL,
                status: 401
                }
            ]);
        }

    }
};