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
        const taskPoolId = parseInt(req.params.id);
        const userMeId = req.user.id;

        try {
            const taskPool = await TaskPoolService.getTaskPoolById(taskPoolId, userMeId);
            res.status(200).send(Mapper.mapTaskPool(taskPool))
        } catch (e) {
            ErrorMapper.map(res, e, [{
                error: TaskPoolService.errors.TASK_POOL_NOT_FOUND,
                status: 404
            }, {
                error: TaskPoolService.errors.USER_CANT_MANAGE_TASK_POOL,
                status: 403
            }]);
        }

    },

    async deleteTaskPoolById(req, res){
        const taskPoolId = parseInt(req.params.id);
        const userMeId = req.user.id;

        try{
            const taskPoolValue = await TaskPoolService.deleteTaskPoolById(taskPoolId,userMeId);
            res.status(204).res(taskPoolValue);
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
