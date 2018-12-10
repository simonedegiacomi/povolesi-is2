const TaskAnswerService = require('../../services/task_answer_service');
const ErrorMapper = require('./error_mapper');

module.exports = {

    async postTaskAnswer (req, res) {
        try  {
            const taskAnswer = await TaskAnswerService.createTaskAnswer({
                ...req.body,
                userId: req.user.id
            });
            res.status(201).send({
                taskAnswerId: taskAnswer.id
            })
        } catch (e) {
            ErrorMapper.map(res, e, [{
                error: TaskAnswerService.errors.ASSIGNED_TASK_NOT_FOUND,
                status: 400
            }, {
                error: TaskAnswerService.errors.EMPTY_ANSWER,
                status: 400
            }])
        }

    }

};