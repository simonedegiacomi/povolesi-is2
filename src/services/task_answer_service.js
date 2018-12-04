const {Answer} = require('../models');


module.exports = {
    async updateAnswer(id, data) {
        const answer = await Answer.findOne({
            where: {id}
        });
        return await answer.update(data);
    }
};