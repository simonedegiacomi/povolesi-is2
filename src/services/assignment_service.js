const {Assignment} = require('../models');

module.exports = {
    async createAssignment (data) {
        // TODO: Checks
        return await Assignment.create(data);
    }
};