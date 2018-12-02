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
    },

    async insertGiorgio () {
        return await UserService.registerUser({
            name       : 'Giorgio Segalla',
            password   : '112hhiufsk1',
            email      : 'giorgio@segalla.it',
            badgeNumber: '187633'
        });
    }
};