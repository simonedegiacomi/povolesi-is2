const request = require('supertest');
const AssignmentService = require('../../../src/services/assignment_service');
const AssignmentHelper = require('../../helpers/assignment_helper');
const UserGroupsHelper = require('../../helpers/user_groups_helper');
const app = require('../../../src/app');
const {Assignment} = require('../../../src/models');

function sendGetAssignments(user) {
    return request(app)
        .get('/api/v1/users/me/assignments')
        .set('X-API-TOKEN', user.authToken);
}

async function expectAssignmentWithIdToBeInDb(assignmentId) {
    const fromDb = await Assignment.findOne({
        where: {id: assignmentId}
    });
    expect(fromDb).toBeDefinedAndNotNull();
}

describe('Test the creation of assignments', () => {

    test('Should create an assignment', async () => {
        const {user, group} = await UserGroupsHelper.createGroupWithUser();

        const response = await request(app)
            .post('/api/v1/assignments')
            .set('X-API-TOKEN', user.authToken)
            .send({
                name: 'Esame di Gennaio',
                startsOn: '01/01/2018 09:00',
                submissionDeadline: '01/01/2018 09:00',
                peerReviewsDeadline: '01/01/2018 09:00',
                createdById: user.id,
                assignedUserGroupId: group.id,
                taskPoolIds: []
            });

        expect(response.status).toBe(201);
        await expectAssignmentWithIdToBeInDb(response.body.assignmentId);
    });

});

describe('Test the API to get assigned assignments', () => {

    test('GET /users/me/assignments should return array when the user is in a group without assignments', async () => {
        const {user} = await UserGroupsHelper.createGroupWithUser();

        const response = await sendGetAssignments(user);

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(0);
    });


    test('GET /users/me/assignments Should return the assignment with the previously assigned tasks', async () => {
        const {user, assignedTasks} = await AssignmentHelper.createAssignedTaskForUser();

        const response = await sendGetAssignments(user);
        const assignedAssignments = response.body;

        expect(response.status).toBe(200);
        expect(assignedAssignments.length).toBe(1);
        const firstAssignment = assignedAssignments[0];
        expect(firstAssignment.AssignedTasks[0]).toEqual(assignedTasks[0].toJSON());
    });

    test('GET /users/me/assignments Should return the assignment with new assigned tasks', async () => {
        const {user} = await AssignmentHelper.createAssignmentWithUserAndPools();

        const response = await sendGetAssignments(user);
        const assignedAssignments = response.body;

        expect(response.status).toBe(200);
        expect(assignedAssignments.length).toBe(1);
    });
});
