
const TaskPoolService = require('../../services/task_pool_service');



module.exports = {
    async getTaskPool(req,res){
        res.status(200).send(TaskPoolService.getTaskPool(req.user))
    },


    async postTaskPool(req,res){
        const value = req.body
        const userMe = req.user
        const tasks = req.body.tasks

        try {
            //creo il task Pool
            let taskPoolCreated = await TaskPoolService.createTaskPool({
                name: value.name,
                createdBy: userMe
            }, tasks)
            res.status(201).send({ taskPoolId: taskPoolCreated.id})
        } catch(e) {
            res.status(401).send({message: e.message})
        }


    }
};