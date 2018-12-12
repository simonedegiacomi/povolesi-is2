const Joi = require('joi');
const TaskService = require('../../services/task_service');
const ErrorMapper = require('./error_mapper');

// TODO: Move to service layer
const taskSchema = Joi.object().keys({
    question: Joi.string().required(),
    type: Joi.string().required(),
    canBePeerReviewed: Joi.boolean().required(),
    maxLength: Joi.number().integer().min(0),
    multipleChoicesAllowed: Joi.boolean(),
    choices: Joi.array().min(2)
});

module.exports = {

    async getTask(req, res) {
        const id = parseInt(req.params.id);

        try {
            let task = await TaskService.getTask(id, req.user.id);
            res.status(200).send(task);
        } catch (e) {
            ErrorMapper.map(res, e, [{
                error: TaskService.errors.TASK_NOT_FOUND,
                status: 404
            }]);
        }
    },

    async deleteTask(req, res) {
        const id = parseInt(req.params.id);

        try {
            let task = await TaskService.deleteTask(id, req.user.id);
            res.status(204).send(task);
        } catch (e) {
            ErrorMapper.map(res, e, [{
                error: TaskService.errors.TASK_NOT_FOUND,
                status: 404
            }, {
                error: TaskService.errors.ONLY_THE_CREATOR_CAN_DELETE_A_TASK,
                status: 403
            }]);
        }
    },

    async getTasks(req, res) {
        try {
            const tasks = await TaskService.getTasks(req.user.id);

            res.status(200).send(tasks);
        } catch (e) {
            ErrorMapper.map(res, e, [{
                error: TaskService.errors.WRONG_ARGUMENTS,
                status: 400
            }]);
        }
    },

    async createTask(req, res) {
        const {error, value} = Joi.validate(req.body, taskSchema);

        if (error != null) {
            return res.status(400).send({
                errorMessage: error.details[0].message
            });
        }

        try {
            value.userId = req.user.id;

            const task = await TaskService.createTask(value);
            res.status(201).send({
                taskId: task.id
            });
        } catch (e) {
            ErrorMapper.map(res, e, [{
                error: TaskService.errors.WRONG_ARGUMENTS,
                status: 400
            }]);
        }
    }
};