const {sequelize} = require('../../src/models/index');
const UserService = require('../../src/services/user_service');

module.exports = {
    async insertMario () {
        return await UserService.registerUser({
            name       : 'Mario Rossi',
            password   : 'password',
            email      : 'mario@rossi.it',
            badgeNumber: '000001'
        });
    }
};