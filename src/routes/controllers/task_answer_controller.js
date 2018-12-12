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

    },

    async getTaskAnswerByUserIdAndAssignmentId(req, res) {
        if (req.query.userId == null) {
            return res.status(400).send({
                errorMessage: "Missing userId query"
            });
        }
        if (req.query.assignmentId == null) {
            return res.status(400).send({
                errorMessage: "Missing assignmentId query"
            });
        }
        const userId = req.query.userId;
        const assignmentId = req.query.assignmentId;
        try {
            const taskAnswers = await TaskAnswerService.getTaskAnswerByUserAndAssignment(userId,assignmentId);
            res.status(200).send(taskAnswers);
        } catch (e) {
            ErrorMapper.map(res, e, [{
                error: TaskAnswerService.errors.USER_NOT_FOUND,
                status: 404
            }, {
                error: TaskAnswerService.errors.ASSIGNMENT_NOT_FOUND,
                status: 404
            }])
        }
    },

    async getTaskAnswerById(req, res) {
        const id = req.params.id;
        try {
            const taskAnswer = await TaskAnswerService.getTaskAnswerById(id);
            res.status(200).send(taskAnswer);
        } catch (e) {
            ErrorMapper.map(res, e, [{
                error: TaskAnswerService.errors.TASK_ANSWER_NOT_FOUND,
                status: 404
            }])
        }
    }

};