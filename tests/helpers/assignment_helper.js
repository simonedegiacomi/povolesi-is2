const AssignmentService = require('../../src/services/assignment_service');
const {Assignment} = require('../../src/models/index');
const UserHelper = require('./user_helper');
const UserGroupHelper = require('./user_groups_helper');

module.exports = {

    async createAssignment() {
        return await AssignmentService.createAssignment({
            name: 'Esame di Gennaio',
            startsOn: '01/01/2018 09:00',
            submissionDeadline: '01/01/2018 09:00',
            peerReviewsDeadline: '01/01/2018 09:00',
            createdById: (await UserHelper.insertNewRandom()).id,
            assignedUserGroupId: (await UserGroupHelper.createGroup()).id
        });
    }

};