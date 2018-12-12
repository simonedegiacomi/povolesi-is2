const AssignmentService = require('../../src/services/assignment_service');
const AssignmentHelper = require('../helpers/assignment_helper');
const {Assignment} = require('../../src/models/index');
const UserGroupsHelper = require('../helpers/user_groups_helper');
const UserHelper = require('../helpers/user_helper');

describe("Test the creation of a new assignment", () => {

    test('Should create a new assignment', async () => {
        const {assignment} = await AssignmentHelper.createAssignmentWithUserAndPools();

        const fromDb = await Assignment.findOne({
            where: {id: assignment.id}
        });
        
        expect(fromDb).toBeDefinedAndNotNull();
    });

    test('Should not create an assignment without a name', async () => {
        const assignment = await AssignmentHelper.getValidAssignment();
        assignment.name = undefined;

        await expect(AssignmentService.createAssignment(assignment))
            .rejects.toThrow(new Error('"name" is required'));
    });

    test('Should not create an assignment without startsOn', async () => {
        const assignment = await AssignmentHelper.getValidAssignment();
        assignment.startsOn = undefined;

        await expect(AssignmentService.createAssignment(assignment))
            .rejects.toThrow(new Error('"startsOn" is required'));
    });

    test('Should not create an assignment without a submissionDeadline', async () => {
        const assignment = await AssignmentHelper.getValidAssignment();
        assignment.submissionDeadline = undefined;

        await expect(AssignmentService.createAssignment(assignment))
            .rejects.toThrow(new Error('"submissionDeadline" is required'));
    });

    test('Should not create an assignment without a peerReviewsDeadline', async () => {
        const assignment = await AssignmentHelper.getValidAssignment();
        assignment.peerReviewsDeadline = undefined;

        await expect(AssignmentService.createAssignment(assignment))
            .rejects.toThrow(new Error('"peerReviewsDeadline" is required'));
    });

    test('Should not create an assignment without createdById', async () => {
        const assignment = await AssignmentHelper.getValidAssignment();
        assignment.createdById = undefined;

        await expect(AssignmentService.createAssignment(assignment))
            .rejects.toThrow(new Error('"createdById" is required'));
    });

    test('Should not create an assignment without assignedUserGroupId', async () => {
        const assignment = await AssignmentHelper.getValidAssignment();
        assignment.assignedUserGroupId = undefined;

        await expect(AssignmentService.createAssignment(assignment))
            .rejects.toThrow(new Error('"assignedUserGroupId" is required'));
    });

    test('Should not create an assignment without taskPoolIds', async () => {
        const assignment = await AssignmentHelper.getValidAssignment();
        assignment.taskPoolIds = undefined;

        await expect(AssignmentService.createAssignment(assignment))
            .rejects.toThrow(new Error('"taskPoolIds" is required'));
    });

    test('Should not create an assignment with an empty taskPoolIds array', async () => {
        const assignment = await AssignmentHelper.getValidAssignment();
        assignment.taskPoolIds = [];

        await expect(AssignmentService.createAssignment(assignment))
            .rejects.toThrow(new Error('"taskPoolIds" does not contain 1 required value(s)'));
    });

    test('Should not allow submissionDeadline to be equal to startsOn', async () => {
        const assignment = await AssignmentHelper.getValidAssignment();
        assignment.submissionDeadline = assignment.startsOn;

        await expect(AssignmentService.createAssignment(assignment))
            .rejects.toThrow(new Error('deadlines are invalid'));
    });

    test('Should not allow submissionDeadline to be equal to submissionDeadline', async () => {
        const assignment = await AssignmentHelper.getValidAssignment();
        assignment.peerReviewsDeadline = assignment.submissionDeadline;

        await expect(AssignmentService.createAssignment(assignment))
            .rejects.toThrow(new Error('deadlines are invalid'));
    });

    test('Should not allow submissionDeadline to be before startsOn', async () => {
        const assignment = await AssignmentHelper.getValidAssignment();
        assignment.submissionDeadline = '01/01/2018 08:00';

        await expect(AssignmentService.createAssignment(assignment))
            .rejects.toThrow(new Error('deadlines are invalid'));
    });

    test('Should not allow submissionDeadline to be before submissionDeadline', async () => {
        const assignment = await AssignmentHelper.getValidAssignment();
        assignment.peerReviewsDeadline = '01/01/2018 08:00';

        await expect(AssignmentService.createAssignment(assignment))
            .rejects.toThrow(new Error('deadlines are invalid'));
    });

});

describe('Test the method to get the assigned assignments to a user', () => {

    test('Should return an empty array when the user is in a group without assignments', async () => {
        const {user} = await UserGroupsHelper.createGroupWithUser();

        const assignments = await AssignmentService.assignOrGetAssignedTasksOfUserGroupedByAssignment(user.id);

        expect(assignments.length).toBe(0);
    });


    test('Should return the assignment with the previously assigned tasks', async () => {
        const {user, assignedTasks} = await AssignmentHelper.createAssignedTaskForUser();

        const assignments = await AssignmentService.assignOrGetAssignedTasksOfUserGroupedByAssignment(user.id);

        expect(assignments.length).toBe(1);
        const firstAssignment = assignments[0];
        expect(firstAssignment.AssignedTasks[0].toJSON()).toEqual(assignedTasks[0].toJSON());
    });

    test('Should return the assignment with new assigned tasks', async () => {
        const {user} = await AssignmentHelper.createAssignmentWithUserAndPools();

        const assignments = await AssignmentService.assignOrGetAssignedTasksOfUserGroupedByAssignment(user.id);

        expect(assignments.length).toBe(1);

        // TODO: Check assigned tasks
    });


    // TODO: Test with assignment not started yet
});
