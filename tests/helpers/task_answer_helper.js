const {TaskAnswer} = require('../../src/models');

module.exports = {
    async findTaskAnswerById(id) {
        return await TaskAnswer.findOne({
            where: {id}
        });
    }
};