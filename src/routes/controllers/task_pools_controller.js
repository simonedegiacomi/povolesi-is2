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
            //creo il task Pool
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
        const taskPoolId = req.params.id;
        const userMe = req.user.id;

        try{
            const taskPool = await TaskPoolService.getTaskPoolById(taskPoolId,userId);
            res.status(201).send(Mapper.mapTaskPool(taskPool))
        } catch(e) {
            //TODO: mettere errori giusti
            ErrorMapper.map(res, e, [{
                error: TaskPoolService.errors.USER_NOT_EXIST,
                status: 409
            }]);
        }

    }
};