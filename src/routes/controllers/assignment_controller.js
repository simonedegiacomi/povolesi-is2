const ErrorMapper  = require('./error_mapper');
const ModelsMapper = require('./models_mapper');
const AssignmentService = require('../../services/assignment_service');

module.exports = {

    async postAssignment (req, res) {
        await AssignmentService.createAssignment(req.body);
        res.status(201).end();
    },

    async getAssignedAssignments (req, res) {
        const assignments = await AssignmentService.assignOrGetAssignedTasksOfUserGroupedByAssignment(req.user.id);
        const json = await ModelsMapper.mapAssignments(assignments);
        res.status(200).send(json);
    }

};