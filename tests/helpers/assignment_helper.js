const {Assignment}      = require('../../src/models');
const AssignmentService = require('../../src/services/assignment_service');
const UserHelper        = require('./user_helper');
const UserGroupsHelper  = require('./user_groups_helper');
const TaskPoolHelper    = require('./task_pool_helper');

module.exports = {

    async insertSimpleAssignment() {
        const group    = await UserGroupsHelper.insertGroup();
        const taskPool = await TaskPoolHelper.createSimplePool();

        return await AssignmentService.createAssignment({
            name               : 'Un compito semplice',
            createdBy          : await UserHelper.insertNewRandom(),
            assignedUserGroupId: group.id,
            draws              : [{
                minPerQuestionDraw: 1,
                numQuestionsToDraw: 1,
                taskPoolId        : taskPool.id
            }]
        });
    }
};
