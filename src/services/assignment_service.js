const Joi = require('joi');

const {Assignment, AssignedTask, UserGroup, UserPermission, TaskPool} = require('../models/index');
const ArgumentError = require('./argument_error');
const ServiceUtils = require('./utils');

const assignmentSchema = Joi.object().keys({
    name: Joi.string().min(3).max(200).required(),
    startsOn: Joi.date().required(),
    submissionDeadline: Joi.date().required(),
    peerReviewsDeadline: Joi.date().required(),
    createdById: Joi.number().integer().required(),
    assignedUserGroupId: Joi.number().integer().required(),
    taskPoolIds: Joi.array().items(Joi.number().integer())
});

module.exports = {

    errors: {
        /*
                TASK_NOT_FOUND: 'task not found',
                WRONG_ARGUMENTS: 'wrong arguments'*/
    },

    async createAssignment(assignmentData) {
        ServiceUtils.validateSchemaOrThrowArgumentError(assignmentData, assignmentSchema);

        const assignment = await Assignment.create(assignmentData);
        await assignment.setTaskPools(assignmentData.taskPoolIds);

        return assignment;
    },

    /**
     * Find all the assignments assigned to groups in which the user participate and assign tasks to the user.
     * If tasks of some assignments are already assigned to the user, those tasks won't be reassigned but they will be
     * returned.
     *
     * Example:
     * - On monday the prof. assign the assignment A to the group X;
     * - On tuesday user 1 of group X asks for his assignments and he gets tasks A.1, A.5 and A.6
     * - On wednesday the prof. assign the assignment B to the group X;
     * - On thursday  usr 1 asks for his assignments and he gets the same tasks of assignment A (A.1, A.5 and A.6) and
     *   some new tasks from assignment B.
     *
     * @param userId
     * @returns {Promise<Array>}
     */
    async assignOrGetAssignmentsWithTasksOfUser(userId) {
        const assignmentsWithTasks = await this.findAssignmentsOfUser(userId);

        for (let assignment of assignmentsWithTasks) {
            if (assignment.assignedTasks == null) {
                assignment.assignedTasks = await this.assignTasksOfAssignmentToUser(assignment.id, userId);
            }
        }

        return assignmentsWithTasks;
    },

    /**
     * Finds all the assignments assigned to the user.
     * @param userId
     * @returns {Promise<Array>}
     */
    async findAssignmentsOfUser(userId) {
        // TODO: Finish
        return await Assignment.findAll({
            // TODO: Limit to user
            include: [{
                model: AssignedTask,
                where: {
                    userId
                },
                required: false, // to get null where tasks are not assigned yet
            }, {
                model: UserGroup,
                as: 'assignedUserGroup',
                include: {
                    model: UserPermission,
                    where: {
                        userId
                    }
                }
            }]
        });
    },

    async assignTasksOfAssignmentToUser(assignmentId, userId) {
        // Fetch task pools
        const pools = await TaskPool.findAll({
            include: [{
                model: Assignment,
                as: 'assignment',
                where: {
                  //  id: assignmentId
                }
            }]
        });


        const assignedTasks = [];

        for (let pool of pools) {
            const tasks = await pool.getTasks();

            // TODO: Complete
            const task = tasks[0];

            // TODO: Use bulk create
            assignedTasks.push(await AssignedTask.create({
                userId,
                assignmentId,
                taskId: task.id
            }));
        }

        // put assigned tasks
        return assignedTasks;
    }
};
