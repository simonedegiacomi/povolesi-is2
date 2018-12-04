const TaskAnswerHelper  = require('../helpers/task_answer_helper');
const TaskAnswerService = require('../../src/services/task_answer_service');
const {Answer}          = require('../../src/models');

describe("Test the update of a submitted answer", () => {
    test('Should edit a task answer', async () => {
        const answer = await TaskAnswerHelper.insertAnswerOfAOpenTask();

        const update = {openAnswer: 'Mmmm, forse era quarantadue?'};
        await TaskAnswerService.updateAnswer(answer.id, update);

        const fromDb = await Answer.findOne({
            where: {id: answer.id}
        });
        expect(fromDb.openAnswer).toBe(update.openAnswer);
    });
});
