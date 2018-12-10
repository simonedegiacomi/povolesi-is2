const AssignmentService = require('../../src/services/assignment_service');
const AssignmentHelper = require('../helpers/assignment_helper');
const UserGroupsHelper = require('../helpers/user_groups_helper');

describe("Test the creation of a new assignment", () => {

    test('Should create a new assignment', async () => {
        let assignment = await AssignmentHelper.createAssignment();

        expect(assignment).not.toBeNull();
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
