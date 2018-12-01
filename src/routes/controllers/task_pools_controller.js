
const TaskPoolService = require('../../services/task_pool_service');



module.exports = {
    async getTaskPool(req,res){
        res.status(200).send(TaskPoolService.getTaskPool(req.user))
    }
};