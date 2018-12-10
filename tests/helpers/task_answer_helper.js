const {Answer} = require('../../src/models');

module.exports = {
    async findTaskAnswerById(id) {
        return await Answer.findOne({
            where: {id}
        });
    }
};