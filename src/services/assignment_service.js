const Joi = require('joi');

const {Assignment, AssignedTask, UserGroup, UserPermission, TaskPool, Task} = require('../models/index');
const ServiceUtils = require('../utils/schema_utils');
const RandomUtils = require('./random_utils');

const assignmentSchema = Joi.object().keys({
    name: Joi.string().min(3).max(200).required(),
    startsOn: Joi.date().required(),
    submissionDeadline: Joi.date().required(),
    peerReviewsDeadline: Joi.date().required(),
    createdById: Joi.number().integer().required(),
    assignedUserGroupId: Joi.number().integer().required(),
    taskPoolIds: Joi.array().items(Joi.number().integer())
});


// TODO: Should we move this declaration somewhere else?
Array.prototype.flatMap = function (lambda) {
    return Array.prototype.concat.apply([], this.map(lambda));
};

module.exports = {

    errors: {
        TOO_FEW_TASKS_IN_TASK_POOL: 'too few taks in task pool',
        ASSIGNMENT_NOT_FOUND: 'assignment not found'
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
     * If an assignment is not started yet, the assignedTasks field will be null.
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
    async assignOrGetAssignedTasksOfUserGroupedByAssignment(userId) {
        const assignmentsWithTasks = await this.findAssignedAssignmentsWithAssignedTasks(userId);

        for (let assignment of assignmentsWithTasks) {
            if (assignment.assignedTasks == null && this.isAssignmentStarted(assignment)) {
                assignment.assignedTasks = await this.assignTasksOfAssignmentToUser(assignment.id, userId);
            }
        }

        return assignmentsWithTasks;
    },

    isAssignmentStarted(assignment) {
        return new Date() >= assignment.startsOn;
    },

    /**
     * Finds all the assignments assigned to the user with the assigned tasks.
     * If the user doesn't have assigned tasks for an assignment, the assignedTasks field will be null.
     * @param userId
     * @returns {Promise<Array>}
     */
    async findAssignedAssignmentsWithAssignedTasks(userId) {
        return await Assignment.findAll({
            include: [
                // Join the Assignment table with the UserGroup and then the UserPermission, to retrieve only assignments
                // assigned to the user
                {
                    model: UserGroup,
                    as: 'assignedUserGroup',
                    include: {
                        model: UserPermission,
                        where: { userId }
                    }
                },

                // Join the AssignedTask table to get the task assigned to the user in an assignment
                {
                    model: AssignedTask,
                    where: {userId},

                    // LEFT JOIN: When there aren't assigned tasks for an assignment, the assignment will have the
                    // assignedTasks field null, so we know we have to assign some tasks
                    required: false,
                }
            ]
        });
    },

    async assignTasksOfAssignmentToUser(assignmentId, userId) {
        const poolsOfAssignment = await this.getTaskPoolsOfAssignment(assignmentId);

        const tasksIdsToAssign = this.randomlyChooseTaskIdsFromTaskPools(poolsOfAssignment);

        return await this.assignTasksToUser(assignmentId, tasksIdsToAssign, userId);
    },

    async getTaskPoolsOfAssignment(assignmentId) {
        return await TaskPool.findAll({
            include: [{
                model: Assignment,
                as: 'assignment',
                where: {id: assignmentId }
            }, {
                model: Task, // eagerly load tasks, we'll need them,
                as: 'tasks'
            }]
        });
    },

    /**
     * Returns an array of ids of tasks randomly chosen from the TaskPools.
     * NOTE: This method assumed uses randomlyChooseTaskIdsFromTaskPool, so check that method notes.
     * @param taskPools
     * @returns {Array}
     */
    randomlyChooseTaskIdsFromTaskPools(taskPools) {
        return taskPools.flatMap(taskPool => this.randomlyChooseTaskIdsFromTaskPool(taskPool));
    },

    /**
     * Return an array of ids randomly chosen from the TaskPool. The number of chosen tasks is equal to the
     * numQuestionsToDraw of the TaskPool.
     * NOTE: This method assumes that the TaskPool has the tasks inside. That is:the tasks were loaded together with
     * with the TaskPool using eager loading.
     * @param taskPool
     * @returns {Array}
     */
    randomlyChooseTaskIdsFromTaskPool(taskPool) {
        const tasksToChooseFromPool = taskPool.numQuestionsToDraw;
        const tasks = taskPool.tasks;

        try {
            const randomIndexes = RandomUtils.getUniqueRandomIndexesFromArray(tasks, tasksToChooseFromPool);
            return randomIndexes.map(index => tasks[index].id);
        } catch (e) {
            throw new Error(this.errors.TOO_FEW_TASKS_IN_TASK_POOL);
        }
    },

    /**
     * Assign the tasks to the user for the given assignments and return all the assigned tasks of that user in that
     * assignments.
     * NOTE: The returned array may contain more assigned tasks than the tasks in the tasksIdsToAssign array.
     * @param assignmentId
     * @param tasksIdsToAssign
     * @param userId
     * @returns {Promise<Array<Model>>}
     */
    async assignTasksToUser(assignmentId, tasksIdsToAssign, userId) {
        const assignedTasksToCreate = tasksIdsToAssign.map(taskId => {
            return {userId, taskId, assignmentId}
        });

        await AssignedTask.bulkCreate(assignedTasksToCreate);

        // Sequelize bulkCreate method doesn't return the ids of the insert entries, so we need to fetch them
        return await AssignedTask.findAll({
            where: {
                assignmentId,
                userId
            }
        }, {
            include: [{
                model: Task,
                as: 'task'
            }]
        });
    },

    async getAssignmentById(assignmentId) {
        const assignment = await Assignment.findOne({
            where: {id: assignmentId}
        });

        if (assignment == null) {
            throw new Error(this.errors.ASSIGNMENT_NOT_FOUND);
        }

        return assignment;
    }
};