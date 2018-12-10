const TaskPoolService = require('../../services/task_pool_service');
const Mapper = require('./models_mapper');
const ErrorMapper = require('./error_mapper');

module.exports = {

    async getTaskPool(req, res) {
        const tasksPools = await TaskPoolService.getTaskPoolsByUserId(req.user.id);

        const json = Mapper.mapTaskPoolArray(tasksPools);

        res.status(200).send(json);
    },

    async postTaskPool(req, res) {
        try {
            //creo il task Pool
            let taskPoolCreated = await TaskPoolService.createTaskPool({
                ...req.body,
                createdById: req.user.id
            });
            res.status(201).send({taskPoolId: taskPoolCreated.id})
        } catch (e) {
            ErrorMapper.map(res, e, [{
                error: TaskPoolService.errors.TASK_NOT_FOUND,
                status: 404
            }, {
                error: TaskPoolService.errors.NUM_QUESTIONS_TO_DRAW_TOO_HIGH,
                status: 400
            }]);
        }
    },


    async getTaskPoolById(req, res) {
        const taskPoolId = req.params.id;
        const userMeId = req.user.id;

        try {
            const taskPool = await TaskPoolService.getTaskPoolById(taskPoolId, userMeId);
            const json = Mapper.mapTaskPool(taskPool);

            res.status(200).send(json);
        } catch (e) {
            ErrorMapper.map(res, e, [{
                error: TaskPoolService.errors.TASK_POOL_NOT_FOUND,
                status: 404
            }]);
        }
    }
};