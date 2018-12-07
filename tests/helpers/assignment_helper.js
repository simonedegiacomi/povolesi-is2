const AssignmentService = require('../../src/services/assignment_service');
const {Assignment, TaskDraw} = require('../../src/models/index');
const UserHelper = require('./user_helper');
const UserGroupsHelper = require('./user_groups_helper');
const TaskPoolHelper = require('../helpers/task_pool_helper');
const UserPermissionHelper = require('../helpers/user_permission_helper');


module.exports = {

    async createAssignmentAssignedToGroup(groupId) {
        return await AssignmentService.createAssignment({
            name: 'Esame di Gennaio',
            startsOn: '01/01/2018 09:00',
            submissionDeadline: '01/01/2018 09:00',
            peerReviewsDeadline: '01/01/2018 09:00',
            createdById: (await UserHelper.insertNewRandom()).id,
            assignedUserGroupId: groupId
        });
    },

    async createAssignment() {
        const group = await UserGroupsHelper.createGroup();
        return await this.createAssignmentAssignedToGroup(group.id);
    },

    async addTaskDrawToAssignment(assignmentId, poolId) {
        await TaskDraw.create({
            assignmentId: assignmentId,
            taskPoolId: poolId,
            numQuestionsToDraw: 1,
            minPerQuestionDraw: 1
        });
    },

    async createAssignmentAssignedToGroupWithTaskDraws(groupId) {
        const assignment = await this.createAssignment(groupId);
        const pool = await TaskPoolHelper.insertTaskPoolWith2Tasks();

        await this.addTaskDrawToAssignment(assignment.id, pool.id);

        return assignment;
    },

    async createAssignmentWithUser() {
        const {group, user} = await UserGroupsHelper.createGroupWithUser();
        const assignment = await this.createAssignmentAssignedToGroupWithTaskDraws(group.id);

        return {
            user,
            assignment
        };
    },

    /**
     * Creates a new user, a group in which the user participate, and assignment assigned to the group and assigns task
     * to the user.
     * @returns {Promise<{user, assignedTasks: *}>}
     */
    async createAssignedTaskForUser() {
        const {assignment, user} = await this.createAssignmentWithUser();
        const assignedTasks = await AssignmentService.assignTasksOfAssignmentToUser(assignment.id, user.id);

        return {
            user,
            assignedTasks
        };
    }

};