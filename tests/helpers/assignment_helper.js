const {Assignment}      = require('../../src/models');
const AssignmentService = require('../../src/services/assignment_service');
const UserHelper        = require('./user_helper');
const UserGrouspHelper  = require('./user_groups_helper');

module.exports = {

    async insertSimpleAssignment() {
        const group = await UserGrouspHelper.insertGroup();
        const taskPool = await TaskPoolHelper;

        return await AssignmentService.createAssignment({
            name               : 'Un compito semplice',
            createdBy          : await UserHelper.insertNewRandom(),
            assignedUserGroupId: group.id,
            draws: [{
                minPerQuestionDraw: 1,
                numQuestionsToDraw: 1,
                //taskPoolId:
            }]
        });
    }
};
