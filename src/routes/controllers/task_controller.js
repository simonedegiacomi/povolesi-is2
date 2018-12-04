const Joi         = require('joi');
const TaskService = require('../../services/task_service');
const ErrorMapper = require('./error_mapper');

const taskSchema = Joi.object().keys({
    question              : Joi.string().required(),
    type                  : Joi.string().required(),
    canBePeerReviewed     : Joi.boolean().required(),
    maxLength             : Joi.number().integer().min(0),
    multipleChoicesAllowed: Joi.boolean(),
    choices               : Joi.array().min(2)
});

module.exports = {

    async getTask(req, res) {
        const id = req.params.id;

        try {
            await TaskService.getTask(id, req.user.id);
            res.send(json);
        } catch (e) {
            ErrorMapper.map(res, e, [{
                error : this.errors.TASK_NOT_FOUND,
                status: 404
            }]);
        }
    },

    async getTasks(req, res) {
        try {
            const tasks = await TaskService.getTasks(req.user.id);

            res.status(200).send(tasks);
        } catch (e) {
            ErrorMapper.map(res, e, [{
                error : TaskService.errors.WRONG_ARGUMENTS,
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
                error : TaskService.errors.WRONG_ARGUMENTS,
                status: 400
            }]);
        }
    }
};