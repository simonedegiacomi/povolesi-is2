const Joi         = require('joi');
const TaskService = require('../../services/task_service');
const ErrorMapper = require('./error_mapper');
const ModelMapper = require('./models_mapper');

const taskSchema = Joi.object().keys({
    question              : Joi.string().required(),
    type                  : Joi.string().required(),
    canBePeerReviewed      : Joi.boolean().required(),
    maxLength             : Joi.number().integer().min(0),
    multipleChoicesAllowed: Joi.boolean(),
    choices               : Joi.array().min(2)
});

module.exports = {
    async createTask(req, res) {
        const {error, value} = Joi.validate(req.body, taskSchema);

        if (error != null) {
            return res.status(400).send({
                errorMessage: error.details[0].message
            });
        }

        try {
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