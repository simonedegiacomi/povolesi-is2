const AssignmentService = require('../../src/services/assignment_service');
const {Assignment} = require('../../src/models/index');
const AssignmentHelper = require('../helpers/assignment_helper');
const TestUtils = require('../test_utils');

describe("Test the creation of a new assignment", () => {

    test('Should create a new assignment', async () => {
        let assignment = await AssignmentHelper.createAssignment();

        expect(assignment).not.toBeNull();
    });

});
