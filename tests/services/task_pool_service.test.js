const TaskPoolService = require('../../src/services/task_pool_service');
const {TaskPool}      = require('../../src/models');

var taskPoolExample = {
    id: 1,
    name: 'esempio',
    createdById: 1
}

var taskPoolError = {
    id: 1,
    name: 'esempio',
    createdById: 2
}


describe('creation of taskPool', () => {

    test('insert taskPool', async () => {
        const json = await TaskPoolService.createTaskPool(taskPoolExample)

        expect(json.id).toEqual(taskPoolExample.id)
        expect(json.name).toEqual(taskPoolExample.name)
        expect(json.createdById).toEqual(taskPoolExample.createdById)
    });

    test('insert taskPool with inexistent creatorUser ', async () => {
        const error = await TaskPoolService.createTaskPool(taskPoolError)

        expect(error).toEqual("FAIL OF QUERY, the task pool is incorrect")
    })

    test('insert two taskPool with the same id', async () => {
        taskPoolError.id=1
        await TaskPoolService.createTaskPool(taskPoolExample)
        const error = await TaskPoolService.createTaskPool(taskPoolError)

        expect(error).toEqual("FAIL OF QUERY, the task pool is incorrect")
    })
})