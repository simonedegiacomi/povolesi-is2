const Joi = require('joi');

const {Assignment} = require('../models/index');
const ArgumentError = require('./argument_error');
const ServiceUtils = require('./utils');

const assignmentSchema = Joi.object().keys({
    name: Joi.string().min(3).max(200).required(),
    startsOn: Joi.date().required(),
    submissionDeadline: Joi.date().required(),
    peerReviewsDeadline: Joi.date().required(),
    createdById: Joi.number().integer().required(),
    assignedUserGroupId: Joi.number().integer().required()
});

module.exports = {

    errors: {/*
        TASK_NOT_FOUND: 'task not found',
        WRONG_ARGUMENTS: 'wrong arguments'*/
    },

    async createAssignment(assignmentData) {
        ServiceUtils.validateSchemaOrThrowArgumentError(assignmentData, assignmentSchema);

        return await Assignment.create(assignmentData);
    }

};
